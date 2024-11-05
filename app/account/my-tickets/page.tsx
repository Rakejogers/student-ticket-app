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
import { CalendarIcon, MoreVerticalIcon, PlusIcon, TagIcon, UserIcon, MailIcon, PhoneIcon } from "lucide-react"
import pb from '@/app/pocketbase'
import { RecordModel } from 'pocketbase'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import isAuth from '@/components/isAuth'

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-yellow-500"
    case "Sold": return "bg-green-500"
    case "Removed": return "bg-red-500"
    case "Available": return "bg-gray-500"
    default: return "bg-gray-500"
  }
}

const UserTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<RecordModel[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<RecordModel | null>(null)
  const [isOffersDialogOpen, setIsOffersDialogOpen] = useState(false)
  const [showingBuyerInfo, setShowingBuyerInfo] = useState<{ [key: string]: boolean }>({})

  const deleteTicket = async (ticketId: string) => {
    try {
      await pb.collection('tickets').delete(ticketId);
      setTickets((prevTickets) => prevTickets.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  }

  const handleOffersClick = (ticket: RecordModel) => {
    setSelectedTicket(ticket);
    setIsOffersDialogOpen(true);
  }

  const handleOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    try {
      await pb.collection('offers').update(offerId, { status: action === 'accept' ? 'Accepted' : 'Declined' });

      // Update the local state to reflect the offer status change
      setSelectedTicket((prevSelectedTicket) => {
        if (!prevSelectedTicket) return null;
        return {
          ...prevSelectedTicket,
          expand: {
            ...prevSelectedTicket.expand,
            offers: prevSelectedTicket.expand?.offers?.map((offer: RecordModel) =>
              offer.id === offerId ? { ...offer, status: action === 'accept' ? 'Accepted' : 'Declined' } : offer
            ),
          },
        };
      });

      // Update the tickets state to reflect the offer status change
      setTickets((prevTickets) => prevTickets.map(ticket => 
        ticket.id === selectedTicket!.id ? {
          ...ticket,
          expand: {
            ...ticket.expand,
            offers: ticket.expand?.offers?.map((offer: RecordModel) =>
              offer.id === offerId ? { ...offer, status: action === 'accept' ? 'Accepted' : 'Declined' } : offer
            ),
          },
        } : ticket
      ));

      if (action === 'accept') {
        // Update ticket status to sold
        await pb.collection('tickets').update(selectedTicket!.id, { 
          status: 'Sold',
          buyer_id: selectedTicket!.expand?.offers?.find((offer: RecordModel) => offer.id === offerId)?.sender 
        });

        // Immediately update the local state to reflect the ticket as sold
        setTickets((prevTickets) => prevTickets.map(ticket => 
          ticket.id === selectedTicket!.id ? { ...ticket, status: 'Sold' } : ticket
        ));

        // Refetch tickets to get updated data
        fetchTickets();
      }
    } catch (error) {
      console.error(`Error ${action}ing offer:`, error);
    }
  }

  const toggleBuyerInfo = (ticketId: string) => {
    setShowingBuyerInfo(prev => ({ ...prev, [ticketId]: !prev[ticketId] }));
  }

  const fetchTickets = async () => {
    try {
      if (!pb.authStore.model) {
        return
      }
      const userTickets = await pb.collection('tickets').getList(1, 10, {
        filter: `seller_id="${pb.authStore.model.id}"`,
        sort: '+created',
        expand: 'event_id,buyer_id,offers',
      });
      setTickets(userTickets.items)
      setLoading(false)
    } catch (error) {
      console.error('No tickets found', error);
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tickets</h1>
          <Link href="/list-ticket">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Ticket
            </Button>
          </Link>
        </header>

        {tickets.length === 0 ? (
          <p>You don&apos;t have any tickets for sale.</p>
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
                <CardContent className='h-24'>
                  {ticket.status === 'Sold' && (
                    <div>
                      {showingBuyerInfo[ticket.id] && ticket.expand?.buyer_id && (
                        <div className="space-y-2">
                          <p className="flex items-center">
                            <UserIcon className="mr-2 h-4 w-4" /> {ticket.expand.buyer_id.name}
                          </p>
                          <p className="flex items-center">
                            <MailIcon className="mr-2 h-4 w-4" /> {ticket.expand.buyer_id.email}
                          </p>
                          <p className="flex items-center">
                            <PhoneIcon className="mr-2 h-4 w-4" /> {ticket.expand.buyer_id.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {!showingBuyerInfo[ticket.id] && (
                    <>
                      <p className="flex items-center text-lg font-semibold">
                        <TagIcon className="mr-2 h-4 w-4" /> ${ticket.price}
                      </p>
                      <Badge className={`${getStatusColor(ticket.status)} text-white mt-2`}>
                        {ticket.status}
                      </Badge>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {ticket.status === 'Sold' ? (
                    <Button variant="outline" onClick={() => toggleBuyerInfo(ticket.id)}>
                      {showingBuyerInfo[ticket.id] ? 'Hide Buyer Info' : 'Contact Buyer'}
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => handleOffersClick(ticket)}>
                      Offers ({ticket.expand?.offers?.filter((offer: RecordModel) => offer.status === 'Pending').length || 0})
                    </Button>
                  )}
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => deleteTicket(ticket.id)}>Remove Listing</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOffersDialogOpen} onOpenChange={setIsOffersDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offers for {selectedTicket?.expand?.event_id?.name}</DialogTitle>
            <DialogDescription>
              Ticket Price: ${selectedTicket?.price}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket?.expand?.offers?.length === 0 ? (
            <p>No offers yet for this ticket.</p>
          ) : (
            <div className="space-y-4">
              {selectedTicket?.expand?.offers?.map((offer: RecordModel) => (
                <div key={offer.id} className="flex justify-between items-center">
                  <span>Offer: ${offer.amount}</span>
                  {offer.status === 'Pending' && (
                    <div>
                      <Button variant="outline" className="mr-2" onClick={() => handleOfferAction(offer.id, 'accept')}>
                        Accept
                      </Button>
                      <Button variant="outline" onClick={() => handleOfferAction(offer.id, 'decline')}>
                        Decline
                      </Button>
                    </div>
                  )}
                  {offer.status !== 'Pending' && (
                    <span className={offer.status === 'Accepted' ? 'text-green-600' : 'text-red-600'}>
                      {offer.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsOffersDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default isAuth(UserTicketsPage);