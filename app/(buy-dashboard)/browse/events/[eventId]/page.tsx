"use client";

import { notFound, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import pb from '@/app/pocketbase'
import { Suspense, useEffect, useState } from 'react'
import { toast } from "@/hooks/use-toast"
import { ToastAction } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, TagIcon, Armchair, Star, Ticket, Search } from "lucide-react"

type EventType = {
  id: string;
  name: string;
  date: string;
  sport: string;
  venue: string;
  tickets: Array<{
    id: string;
    price: number;
    ticket_type: string;
    seller_id: string;
    status: string;
    expand: {
      seller_id: {
        name: string;
        seller_rating: number;
        tickets_sold: number;
      };
    };
  }>;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

interface Params {
  eventId: string;
}

export default function EventPage({ params }: { params: Params }) {
  const [event, setEvent] = useState<EventType | null>(null);
  const [offerAmount, setOfferAmount] = useState(0);
  const [offerMade, setOfferMade] = useState<string[]>([]); // Track which ticket has an offer made
  const [sortBy, setSortBy] = useState<string>("price");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { eventId } = params
  const router = useRouter();

  if (eventId == null) {
    notFound()
  }

  useEffect(() => {
    const fetchEvent = async () => {
      pb.autoCancellation(false);

      const event = await pb.collection('events').getOne(eventId, {});

      const tickets = await pb.collection('tickets').getList(1, 50, {
        filter: `event_id="${eventId}" && seller_id!="${pb.authStore.model?.id}" && status!="Sold"`,
        sort: '-created',
        expand: 'seller_id'
      });

      const data: EventType = {
        id: event.id,
        name: event.name,
        date: event.date,
        sport: event.sport,
        venue: event.venue,
        tickets: tickets.items.map(ticket => ({
          id: ticket.id,
          price: ticket.price,
          ticket_type: ticket.ticket_type,
          seller_id: ticket.seller_id,
          status: ticket.status,
          expand: {
            seller_id: {
              name: ticket.expand?.seller_id.name,
              seller_rating: ticket.expand?.seller_id.seller_rating,
              tickets_sold: ticket.expand?.seller_id.tickets_sold,
            },
          },
        }))
      };

      setEvent(data);
    };

    fetchEvent();
  }, [eventId]);

  const handleOfferSubmit = async (ticketId: string, sellerId: string) => {
    try {
      //make sure buyer is verified
      if (pb.authStore.model?.verified == false) {
        toast({
          title: `Verification Required`,
          description: `Verify your account before sending an offer.`,
          variant: "destructive",
          action: (
            <ToastAction onClick={() => { router.push("/account/profile") }} altText='Verify Account'>Verify Now</ToastAction>
          ),
        })
        return;
      }
      // Send offer to seller
      const data = {
        ticket: ticketId,
        sender: pb.authStore.model?.id,
        receiver: sellerId,
        amount: offerAmount,
        status: "Pending"
      };

      const newOfferData = await pb.collection('offers').create(data);
      await pb.collection('tickets').update(ticketId, {
        status: "Pending",
        'offers+': newOfferData.id
      });
      //show toast to confirm offer sent
      const sellerName = event?.tickets.find(ticket => ticket.id === ticketId)?.expand.seller_id.name;
      toast({
        title: `Offer Sent to ${sellerName}`,
        description: `Your offer of $${offerAmount} has been sent to the seller.`,
      })
      setOfferAmount(0);
      setOfferMade((prevOffers) => [...prevOffers, ticketId]);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your offer. Please try again.",
        variant: "destructive",
      })
      console.error('Error sending offer:', error);
    }
  };

  const sortedAndFilteredTickets = event?.tickets
    .filter(ticket =>
      ticket.expand.seller_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticket_type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.expand.seller_id.seller_rating - a.expand.seller_id.seller_rating;
        case "sold":
          return b.expand.seller_id.tickets_sold - a.expand.seller_id.tickets_sold;
        case "type":
          return a.ticket_type.localeCompare(b.ticket_type);
        default:
          return 0;
      }
    });

  // Render loading skeleton while fetching event data
  if (event == null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto p-4">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">{event.name}</h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search tickets</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search tickets or sellers"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="type">Ticket Type</SelectItem>
                <SelectItem value="rating">Seller Rating</SelectItem>
                <SelectItem value="sold">Seller Tickets Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAndFilteredTickets?.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <CardTitle>{ticket.expand.seller_id.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" /> {formatDate(event.date)}
                  </CardDescription>
                  <CardDescription className="flex items-center mt-1">
                    <Star className="mr-2 h-4 w-4" /> Rating: {ticket.expand.seller_id.seller_rating.toFixed(0)}%
                    <Ticket className="ml-4 mr-2 h-4 w-4" /> Sold: {ticket.expand.seller_id.tickets_sold}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center text-md font-regular">
                    <Armchair className="mr-2 h-4 w-4" /> {ticket.ticket_type}
                  </p>
                  <p className="flex items-center text-lg font-semibold">
                    <TagIcon className="mr-2 h-4 w-4" /> ${ticket.price}
                  </p>
                  <p className={`mt-2 ${ticket.status === "Available" ? "text-green-600" : "text-yellow-600"}`}>
                    {ticket.status}
                  </p>
                  {offerMade.includes(ticket.id) ? (
                    <Button className="mt-4 w-full" onClick={() => router.push("/account/sent-offers")}>
                      View Offer
                    </Button>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="mt-4 w-full">Make an Offer</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Make an Offer</h4>
                            <p className="text-sm text-muted-foreground">
                              Enter your offer amount for this ticket.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="amount">Offer Amount</Label>
                            <Input
                              id="amount"
                              placeholder="Enter amount"
                              type="number"
                              value={offerAmount}
                              onChange={(e) => setOfferAmount(Number(e.target.value))}
                            />
                          </div>
                          <Button onClick={() => handleOfferSubmit(ticket.id, ticket.seller_id)}>
                            Send Offer
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedAndFilteredTickets?.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">No tickets available for this event.</p>
          )}
        </div>
      </div>
    </Suspense>
  )
}