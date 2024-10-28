"use client";

import Link from 'next/link'
import { notFound, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import pb from '@/app/pocketbase'
import { useEffect, useState } from 'react'
import { toast } from "@/hooks/use-toast"
import { ToastAction } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, TagIcon, Armchair } from "lucide-react"

const EventPage: React.FC = () => {
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

  const [event, setEvent] = useState<EventType | null>(null);
  const [offerAmount, setOfferAmount] = useState<string>('');

  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  if (eventId == null) {
    notFound()
  }

  useEffect(() => {
    const fetchEvent = async () => {
      pb.autoCancellation(false);

      const event = await pb.collection('events').getOne(eventId, {});

      const tickets = await pb.collection('tickets').getList(1, 10, {
        filter: `event_id="${eventId}"`,
        sort: '-created',
        expand: 'seller_id'
      });
      console.log(tickets.items);
      
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
            },
          },
        }))
      };
      

      setEvent(data);
    };

    fetchEvent();
  }, []);

  const handleOfferSubmit = async (ticketId: string, sellerId: string) => {
    try {
      // Here you would typically send the offer to your backend
      // For this example, we'll just show a success message
      toast({
        title: `Offer Sent to ${sellerId}`,
        description: `Your offer of $${offerAmount} has been sent to the seller.`,
        action: (
          <ToastAction altText='Offer sent'>Offer Sent</ToastAction>
        ),
      })
      console.log(`Offer sent to ${sellerId} for ticket ${ticketId} with amount $${offerAmount}`);
      setOfferAmount('');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your offer. Please try again.",
        variant: "destructive",
      })
    }
  };


  // Render loading skeleton while fetching event data
  if (event == null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <div className="container mx-auto p-4">
          <Skeleton className="h-12 w-3/4 mb-6" /> {/* Event title skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" /> {/* Card title skeleton */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" /> {/* Card title skeleton */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>

          <Skeleton className="h-8 w-1/2 mb-4" /> {/* Available Tickets heading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" /> {/* Ticket title skeleton */}
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-10 w-full" /> {/* Button skeleton */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">{event.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Date:</strong> {formatDate(event.date)}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Select from available tickets below. Make an offer to the seller.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Available Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader>
                <CardTitle>{ticket.expand.seller_id.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" /> {formatDate(event.date)}
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
                          onChange={(e) => setOfferAmount(e.target.value)}
                        />
                      </div>
                      <Button onClick={() => handleOfferSubmit(ticket.id, ticket.seller_id)}>
                        Send Offer
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          ))}
        </div>

        {event.tickets.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No tickets available for this event.</p>
        )}
      </div>
    </div>
  )
}

export default EventPage;