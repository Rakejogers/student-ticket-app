'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "@/app/SentOffersPage.css" // Make sure to create this CSS file with the flip card styles

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
    case "Removed": return "bg-destructive"
    case "Available": return "bg-muted-foreground"
    default: return "bg-muted-foreground"
  }
}

const UserTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<RecordModel[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<RecordModel | null>(null)
  const [isOffersDialogOpen, setIsOffersDialogOpen] = useState(false)
  const [showingBuyerInfo, setShowingBuyerInfo] = useState<{ [key: string]: boolean }>({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<RecordModel | null>(null)
  const [editedPrice, setEditedPrice] = useState('')

  const handleEditClick = (ticket: RecordModel) => {
    setEditingTicket(ticket)
    setEditedPrice(ticket.price.toString())
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTicket) return

    try {
      const updatedTicket = await pb.collection('tickets').update(editingTicket.id, { 
        price: parseFloat(editedPrice)
      })

      setTickets((prevTickets) => prevTickets.map(ticket => 
        ticket.id === updatedTicket.id ? { ...ticket, price: updatedTicket.price } : ticket
      ))

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }
  
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
        await pb.collection('tickets').update(selectedTicket!.id, { 
          status: 'Sold',
          buyer_id: selectedTicket!.expand?.offers?.find((offer: RecordModel) => offer.id === offerId)?.sender 
        });

        setTickets((prevTickets) => prevTickets.map(ticket => 
          ticket.id === selectedTicket!.id ? { ...ticket, status: 'Sold' } : ticket
        ));

        await pb.collection('events').update(selectedTicket!.expand?.event_id?.id, {'tickets-': selectedTicket!.id});
        await pb.collection('users').update(pb.authStore.model!.id,{"tickets_sold+": 1})

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
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
              <div
                key={ticket.id}
                className={`flip-card ${showingBuyerInfo[ticket.id] ? 'flipped' : ''}`}
              >
                <div className="flip-card-inner">
                  {/* Front Side */}
                  <Card className="bg-card rounded-t-lg border-t border-border flip-card-front">
                    <CardHeader className='bg-card rounded-t-lg border-t border-border'>
                      <CardTitle className="text-left">{ticket.expand?.event_id?.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" /> {formatDate(ticket.expand?.event_id?.date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-15 bg-card">
                      <p className="flex items-center text-lg font-semibold">
                        <TagIcon className="mr-2 h-4 w-4" /> ${ticket.price}
                      </p>
                      <div className="mr-2 flex items-center justify-between">
                        <Badge className={`${getStatusColor(ticket.status)} text-muted mt-2`}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex bg-card justify-between rounded-b-lg border-b border-border">
                      {ticket.status === 'Sold' ? (
                        <Button variant="default" onClick={() => toggleBuyerInfo(ticket.id)}>
                          Contact Buyer
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
                          <DropdownMenuItem onSelect={() => handleEditClick(ticket)}>Edit Price</DropdownMenuItem>
                          <DropdownMenuItem>Share Listing</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onSelect={() => deleteTicket(ticket.id)}>Remove Listing</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                  
                  {/* Back Side (Buyer Info) */}
                  {ticket.status === 'Sold' && (
                    <Card className="bg-card rounded-t-lg border-t border-border flip-card-back">
                      <CardHeader className="bg-card rounded-t-lg text-left">
                        <CardTitle>Buyer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="bg-card h-15">
                        {ticket.expand?.buyer_id && (
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
                      </CardContent>
                      <CardFooter className="bg-card justify-between rounded-b-lg p-3.5">
                        <Button variant="outline" onClick={() => toggleBuyerInfo(ticket.id)} className="w-full">
                          Back to Ticket
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              </div>
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
                    <span className={offer.status === 'Accepted' ? 'text-green-600' : 'text-destructive'}>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>
              Update the price for {editingTicket?.expand?.event_id?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default isAuth(UserTicketsPage);