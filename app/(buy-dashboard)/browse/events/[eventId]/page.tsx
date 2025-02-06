"use client";

import { notFound, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import pb from '@/app/pocketbase'
import { Suspense, useEffect, useState } from 'react'
import { toast } from "@/hooks/use-toast"
import { ToastAction } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { TagIcon, Armchair, Star, Ticket, Search } from "lucide-react"
import isAuth from '@/components/isAuth';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { EmptyState } from "@/components/empty-state"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HandCoins } from "lucide-react"

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
      event_id: {
        name: string;
      };
      offers: Array<{
        id: string;
        sender: string;
        amount: number;
        status: string;
        expand?: {
          sender: {
            name: string;
          };
        };
      }>;
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

type Params = {
  eventId: string;
};

interface BrowseTicketsPageProps {
  params: Params;
}

const BrowseTicketsPage: React.FC<BrowseTicketsPageProps> = ({ params }) => {
  const [event, setEvent] = useState<EventType | null>(null);
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [offerMade, setOfferMade] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("price");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<string[]>([]);
  const [hideOfferedTickets, setHideOfferedTickets] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const perPage = 30; // You can adjust this value as needed
  const [isOffersDialogOpen, setIsOffersDialogOpen] = useState(false);
  const [selectedTicket] = useState<EventType['tickets'][0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<{ id: string; sellerId: string } | null>(null);

  const { eventId } = params
  const router = useRouter();

  if (eventId == null) {
    notFound()
  }

  useEffect(() => {
    const fetchEvent = async () => {
      pb.autoCancellation(false);

      const event = await pb.collection('events').getOne(eventId, {});

      // Determine the sort field and direction based on sortBy value
      let sortString = '-created';
      switch (sortBy) {
        case "price":
          sortString = '+price';
          break;
        case "rating":
          sortString = '-seller_id.seller_rating';
          break;
        case "sold":
          sortString = '-seller_id.tickets_sold';
          break;
        case "type":
          sortString = '+ticket_type';
          break;
      }

      const ticketsResponse = await pb.collection('tickets').getList(currentPage, perPage, {
        filter: `event_id="${eventId}" && seller_id!="${pb.authStore.model?.id}" && status!="Sold"`,
        sort: sortString,
        expand: 'seller_id,event_id,offers,offers.sender'
      });

      const data: EventType = {
        id: event.id,
        name: event.name,
        date: event.date,
        sport: event.sport,
        venue: event.venue,
        tickets: ticketsResponse.items.map(ticket => ({
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
            event_id: {
              name: ticket.expand?.event_id.name,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            offers: ticket.expand?.offers?.map((offer: any) => ({
              id: offer.id,
              sender: offer.sender,
              amount: offer.amount,
              status: offer.status,
              expand: {
                sender: {
                  name: offer.expand?.sender?.name
                }
              }
            })) || []
          },
        }))
      };

      // Set the max price for the slider
      const maxTicketPrice = Math.max(...data.tickets.map(ticket => ticket.price));
      //if no tickets set to default value
      if (maxTicketPrice === -Infinity) setMaxPrice(10);
      else setMaxPrice(maxTicketPrice);

      setEvent(data);
      setTotalPages(ticketsResponse.totalPages);
    };

    fetchEvent();
  }, [eventId, currentPage, sortBy]);

  const handleOfferSubmit = async (ticketId: string, sellerId: string) => {
    try {
      //make sure buyer is verified
      if (pb.authStore.model!.verified == false) {
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

      if (pb.authStore.model!.phone == null) {
        toast({
          title: `Phone Number Required`,
          description: `Add a phone number before sending an offer.`,
          variant: "destructive",
          action: (
            <ToastAction onClick={() => { router.push("/account/profile") }} altText='Add Number'>Add Now</ToastAction>
          ),
        })
        return;
      }

      const numericAmount = parseFloat(offerAmount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid offer amount.",
          variant: "destructive",
        })
        return;
      }

      // Send offer to seller
      const data = {
        ticket: ticketId,
        sender: pb.authStore.model?.id,
        receiver: sellerId,
        amount: numericAmount,
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
        description: `Your offer of $${numericAmount} has been sent to the seller.`,
      })
      setOfferAmount('');
      setOfferMade((prevOffers) => [...prevOffers, ticketId]);

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).response.data.amount) {
        toast({
          title: "Error",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: (error as any).response.data.amount.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "An error occurred while sending the offer.",
          variant: "destructive",
        })
      }
      // toast({
      //   title: "Error",
      //   description: (error as any).response.data.amount.message || "An error occurred while sending the offer.",
      //   variant: "destructive",
      // })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error sending offer:', (error as any).response);
    }
  };

  const sortedAndFilteredTickets = event?.tickets
    .filter(ticket => {
      // Search filter
      const searchMatch = ticket.expand.seller_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticket_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Ticket type filter
      const typeMatch = selectedTicketTypes.length === 0 || selectedTicketTypes.includes(ticket.ticket_type);
      
      // Offers filter
      const offersMatch = !hideOfferedTickets || 
        !ticket.expand.offers.some(offer => offer.sender === pb.authStore.model?.id);
      
      // Price filter
      const priceMatch = ticket.price <= maxPrice;
      
      return searchMatch && typeMatch && offersMatch && priceMatch;
    });

  // Render loading skeleton while fetching event data
  if (event == null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto p-4">
          <Skeleton className="h-12 w-3/4 mb-6" />
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
          {/* <Skeleton className="h-10 w-full mb-6" /> */}
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <p className="text-muted-foreground">{formatDate(event.date)}</p>
          </div>

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

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ezone"
                    checked={selectedTicketTypes.includes("Ezone")}
                    onCheckedChange={(checked) => {
                      setSelectedTicketTypes(prev => 
                        checked 
                          ? [...prev, "Ezone"]
                          : prev.filter(t => t !== "Ezone")
                      );
                    }}
                  />
                  <Label htmlFor="ezone">EZone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reserved"
                    checked={selectedTicketTypes.includes("Reserved")}
                    onCheckedChange={(checked) => {
                      setSelectedTicketTypes(prev => 
                        checked 
                          ? [...prev, "Reserved"]
                          : prev.filter(t => t !== "Reserved")
                      );
                    }}
                  />
                  <Label htmlFor="reserved">Reserved</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hideOffered"
                    checked={hideOfferedTickets}
                    onCheckedChange={(checked) => setHideOfferedTickets(!!checked)}
                  />
                  <Label htmlFor="hideOffered">Hide Offered</Label>
                </div>
              </div>

              <div className="flex flex-col space-y-2 w-[200px]">
                <Label>Max Price: ${maxPrice}</Label>
                <Slider
                  value={[maxPrice]}
                  onValueChange={(values) => setMaxPrice(values[0])}
                  max={event ? Math.max(...event.tickets.map(ticket => ticket.price)) : 1000}
                  step={1}
                />
              </div>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="rating">Seller Rating</SelectItem>
                <SelectItem value="sold">Seller Tickets Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAndFilteredTickets?.map((ticket) => (
              <Card key={ticket.id} className='cursor-pointer hover:shadow-lg transition-shadow border border-border rounded-lg flex flex-col'>
                <CardHeader className='bg-muted text-card-foreground p-4 border border-border rounded-t-lg'>
                  <CardTitle>{ticket.expand.seller_id.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Star className="mr-2 h-4 w-4" /> Rating: {ticket.expand.seller_id.tickets_sold < 3 ? 'N/A' : `${ticket.expand.seller_id.seller_rating.toFixed(0)}%`}
                    <Ticket className="ml-4 mr-2 h-4 w-4" /> Tickets Sold: {ticket.expand.seller_id.tickets_sold}
                  </CardDescription>
                </CardHeader>
                <CardContent className='border border-border rounded-b-lg flex-grow'>
                  <p className="flex mt-4 items-center text-md font-regular">
                    <Armchair className="mr-2 h-4 w-4" /> {ticket.ticket_type}
                  </p>
                  <p className="flex items-center text-lg font-semibold">
                    <TagIcon className="mr-2 h-4 w-4" /> ${ticket.price}
                  </p>
                  <div className="flex items-center">
                    <Badge className={`${ticket.status === "Available" ? "bg-green-500" : "bg-yellow-500"} text-foreground`}>
                      {ticket.status}
                    </Badge>
                    {ticket.expand.offers.filter(offer => offer.sender === pb.authStore.model?.id).length > 0 && (
                      <p className="ml-2 text-muted-foreground">
                        {" "}({ticket.expand.offers.filter(offer => offer.sender === pb.authStore.model?.id).length === 1 
                          ? "You've sent an offer already"
                          : `You've sent ${ticket.expand.offers.filter(offer => offer.sender === pb.authStore.model?.id).length} offers already`})
                      </p>
                    )}
                  </div>
                  {offerMade.includes(ticket.id) ? (
                    <Button className="mt-4 w-full" onClick={() => router.push("/account/sent-offers")}>
                      View Offer
                    </Button>
                  ) : isDesktop ? (
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
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                              <Input
                                id="amount"
                                className="pl-7"
                                placeholder="0.00"
                                type="number"
                                min="0"
                                step="0.01"
                                value={offerAmount}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                    setOfferAmount(value);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <Button onClick={() => handleOfferSubmit(ticket.id, ticket.seller_id)}>
                            Send Offer
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                      <DrawerTrigger asChild>
                        <Button 
                          className="mt-4 w-full"
                          onClick={() => {
                            setCurrentTicket({ id: ticket.id, sellerId: ticket.seller_id });
                            setIsDrawerOpen(true);
                          }}
                        >
                          Make an Offer
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>Make an Offer</DrawerTitle>
                            <DrawerDescription>
                              Enter your offer amount for this ticket.
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4">
                            <div className="grid gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="amount-mobile">Offer Amount</Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                                  <Input
                                    id="amount-mobile"
                                    className="pl-7"
                                    placeholder="0.00"
                                    inputMode="decimal"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={offerAmount}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                        setOfferAmount(value);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <Button 
                                type="button" 
                                onClick={async () => {
                                  if (currentTicket) {
                                    await handleOfferSubmit(currentTicket.id, currentTicket.sellerId);
                                    setIsDrawerOpen(false);
                                    setCurrentTicket(null);
                                    setOfferAmount('');
                                  }
                                }} 
                                className="w-full"
                              >
                                Send Offer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedAndFilteredTickets?.length === 0 && (
            <EmptyState
              icon={<Ticket className="h-12 w-12 text-muted-foreground" />}
              title="No tickets available"
              description="There are no tickets available for this event at the moment. Try adjusting your filters or check back later."
              action={{
                label: "List Your Ticket",
                onClick: () => router.push('/list-ticket')
              }}
            />
          )}
          {/* Add the pagination component */}
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  />
                </PaginationItem>
                {[...Array(Math.min(totalPages, 3))].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <Dialog open={isOffersDialogOpen} onOpenChange={setIsOffersDialogOpen}>
            <DialogContent className="max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Offers for {selectedTicket?.expand?.event_id?.name}</DialogTitle>
                <DialogDescription>
                  Ticket Price: ${selectedTicket?.price}
                </DialogDescription>
              </DialogHeader>
              {selectedTicket?.expand?.offers?.length === 0 ? (
                <EmptyState
                  icon={<HandCoins className="h-12 w-12 text-muted-foreground/50" />}
                  title="No offers yet"
                  description="This ticket hasn't received any offers yet. Be the first to make an offer!"
                  className="min-h-[200px]"
                />
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 my-4">
                  <div className="space-y-4">
                    {selectedTicket?.expand?.offers?.map((offer) => (
                      <Card key={offer.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">From: {offer.expand?.sender?.name || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">Amount: ${offer.amount}</p>
                          </div>
                          <Badge variant={offer.status === 'Accepted' ? 'default' : 'secondary'}>
                            {offer.status}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              <DialogFooter className="mt-2">
                <Button onClick={() => setIsOffersDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Suspense>
  )
}

export default isAuth(BrowseTicketsPage);