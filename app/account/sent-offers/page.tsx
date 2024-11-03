"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, TagIcon, TicketIcon } from "lucide-react"
import pb from '@/app/pocketbase'
import { RecordModel } from 'pocketbase'
import { toast } from "@/hooks/use-toast"
import isAuth from "@/components/isAuth"

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

const SentOffersPage: React.FC = () => {
  const [sentOffers, setSentOffers] = useState<RecordModel[]>([])
  const [offerAmount, setOfferAmount] = useState(0);

  useEffect(() => {
    async function fetchOffers() {
      try {
        if (!pb.authStore.model) {
          return
        }
        const userOffers = await pb.collection('offers').getList(1, 10, {
          filter: `sender="${pb.authStore.model.id}"`,
          sort: '+created',
          expand: 'ticket.event_id'
        });
        
        setSentOffers(userOffers.items)
      } catch (error) {
        console.error('No tickets found', error);
      }
    }

    fetchOffers()
  }, [])

  const handleCancelOffer = async (offerId: string) => {
    try {
      await pb.collection('offers').delete(offerId)
      setSentOffers((prevOffer) => prevOffer.filter(offer => offer.id !== offerId));
    } catch (error) {
      console.error('Error canceling ticket:', error);
    }
  }

  const handleNewOffer = async (ticketId: string, sellerId: string, oldOfferId: string) => {
    try {
      // Send offer to seller
      const data = {
        ticket: ticketId,
        sender: pb.authStore.model?.id,
        receiver: sellerId,
        amount: offerAmount,
        status: "Pending"
      };

      await pb.collection('offers').create(data);
      await pb.collection('offers').delete(oldOfferId);
      //show toast to confirm offer sent
      toast({
        title: `New Offer Sent`,
        description: `Your offer of $${offerAmount} has been sent to the seller.`,
      })
      setOfferAmount(0);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your offer. Please try again.",
        variant: "destructive",
      })
      console.error('Error sending offer:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500"
      case "Accepted": return "bg-green-500"
      case "Declined": return "bg-red-500"
      case "Cancelled": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Sent Offers</h1>
        
        {sentOffers.length === 0 ? (
          <p>You haven&apos;t sent any offers yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sentOffers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <CardTitle>{offer.expand?.ticket.expand.event_id?.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" /> {formatDate(offer.expand?.ticket.expand.event_id?.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <TagIcon className="mr-2 h-4 w-4" /> 
                      Original Price: ${offer.expand?.ticket.price}
                    </p>
                    <p className="flex items-center font-semibold">
                      <TicketIcon className="mr-2 h-4 w-4" /> 
                      Your Offer: ${offer.amount}
                    </p>
                    <Badge className={`${getStatusColor(offer.status)} text-white`}>
                      {offer.status}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {offer.status === "Pending" && (
                    <>
                      <Button onClick={() => handleCancelOffer(offer.id)} variant="outline" className="flex-1 ml-2">
                        Cancel
                      </Button>
                    </>
                  )}
                  {offer.status === "Accepted" && (
                    <Button disabled className="flex-1">Accepted</Button>
                  )}
                  {offer.status === "Declined" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="mt-4 w-full">Make New Offer</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Make New Offer</h4>
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
                          <Button onClick={() => handleNewOffer(offer.ticket, offer.receiver, offer.id)}>
                            Send Offer
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  {offer.status === "Cancelled" && (
                    <Button disabled className="flex-1">Cancelled</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default isAuth(SentOffersPage);