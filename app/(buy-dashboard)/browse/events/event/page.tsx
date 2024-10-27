"use client";

import Link from 'next/link'
import { notFound, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import pb from '@/app/pocketbase'
import { useEffect, useState } from 'react';

const EventPage: React.FC = () => {
  // Define a type for the event state
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

  //useState for event
  const [event, setEvent] = useState<EventType | null>(null);

  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  if (eventId == null) {
    notFound()
  }

  useEffect(() => {
    const fetchEvent = async () => {
      pb.autoCancellation(false);

      const event = await pb.collection('events').getOne(eventId, {
      });
      

      const tickets = await pb.collection('tickets').getList(1, 10, {
        filter: `event_id="${eventId}"`,
        sort: '+created'
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
          seller_id: ticket.seller_id
        }))
      };

      console.log(data);

      setEvent(data);
    };

    fetchEvent();
  }, []);


  if (event == null) {
    return <p>Loading...</p>; // Add a loading state or handle the null case
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
              <p>Select from available tickets below. We are not responsible for transaction of ticket.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Available Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Type:</strong> {ticket.ticket_type}</p>
                <p><strong>Price:</strong> ${ticket.price}</p>
                <Link href={`/browse/events/ticket/?ticketId=${ticket.id}`}>
                <Button className="mt-4 w-full">Purchase Ticket</Button>
                </Link>
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