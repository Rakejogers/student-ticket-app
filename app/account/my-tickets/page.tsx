'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarIcon, MoreVerticalIcon, PlusIcon, TagIcon } from "lucide-react"
import pb from '@/app/pocketbase'
import { RecordModel } from 'pocketbase'
import Link from 'next/link'

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

export default function UserTicketsPage() {
  const [tickets, setTickets] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true)

  const deleteTicket = async (ticketId: string) => {
    try {
      await pb.collection('tickets').delete(ticketId);
      setTickets((prevTickets) => prevTickets.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  }

  useEffect(() => {
    async function fetchTickets() {
      try {
        if (!pb.authStore.model) {
          return
        }
        const userTickets = await pb.collection('tickets').getList(1, 10, {
          filter: `seller_id="${pb.authStore.model.id}"`,
          sort: '+created',
          expand: 'event_id',
        });
        console.log(userTickets.items)
        setTickets(userTickets.items)
        setLoading(false)
      } catch (error) {
        console.error('No tickets found', error);
      }
    }

    fetchTickets()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tickets for Sale</h1>
          <Link href="/list-ticket">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Ticket
            </Button>
          </Link>
        </header>

        {tickets.length === 0 ? (
          <p>You don't have any tickets for sale.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <CardTitle>{ticket.expand?.event_id?.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" /> {formatDate(ticket.expand?.event_id?.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center text-lg font-semibold">
                    <TagIcon className="mr-2 h-4 w-4" /> ${ticket.price}
                  </p>
                  <p className={`mt-2 ${ticket.status === "Available" ? "text-green-600" : "text-yellow-600"}`}>
                    {ticket.status}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Edit</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVerticalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Share Listing</DropdownMenuItem>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem className="text-red-600" onClick={() => deleteTicket(ticket.id)}>Remove Listing</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}