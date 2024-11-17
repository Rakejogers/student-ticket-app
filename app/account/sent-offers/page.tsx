"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, TagIcon, TicketIcon, UserIcon, PhoneIcon, MailIcon, Wallet, StarIcon, SendIcon, Undo2 } from "lucide-react"
import pb from '@/app/pocketbase'
import { RecordModel } from 'pocketbase'
import { toast } from "@/hooks/use-toast"
import isAuth from "@/components/isAuth"
import "@/app/SentOffersPage.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import LoadingSkeleton from "@/components/loading-skeleton"

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
  const [sellerInfo, setSellerInfo] = useState<{ [key: string]: RecordModel }>({});
  const [showSellerInfo, setShowSellerInfo] = useState<{ [key: string]: boolean }>({});
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true)
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [currentOfferId, setCurrentOfferId] = useState<string | null>(null);
  const [messages, setMessages] = useState<RecordModel[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [reportReason, setReportReason] = useState("");
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);

  const scrollToBottom = () => {
    const scrollArea = document.getElementById('messageScrollArea');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        setLoading(false)
      } catch (error) {
        console.error('No tickets found', error);
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  useEffect(() => {
    if (currentOfferId) {
      pb.collection('messages').subscribe('*', function (e) {
        if (e.record.offer !== currentOfferId) return;
        setMessages(prevMessages => [...prevMessages, e.record]);
      });

      fetchMessages(currentOfferId);
    }

    return () => {
      pb.collection('messages').unsubscribe("*");
    };
  }, [currentOfferId]);

  const fetchMessages = async (offerId: string) => {
    try {
      const messagesList = await pb.collection('messages').getList(1, 50, {
        filter: `offer="${offerId}"`,
        sort: '+created',
      });
      setMessages(messagesList.items);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentOfferId) return;

    try {
      await pb.collection('messages').create({
        offer: currentOfferId,
        sender: pb.authStore.model?.id,
        content: newMessage,
        receiver: sentOffers.find(offer => offer.id === currentOfferId)?.receiver,
      });

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const viewSellerInfo = async (offerId: string, sellerId: string) => {
    try {
      const sellerData = await pb.collection('users').getOne(sellerId);
      setSellerInfo(prevState => ({ ...prevState, [offerId]: sellerData }));
      setShowSellerInfo(prevState => ({ ...prevState, [offerId]: true }));
    } catch (error) {
      console.error('Error fetching seller info:', error);
      toast({
        title: "Error",
        description: "There was an error fetching the seller information. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelOffer = async (offerId: string, ticketId: string) => {
    try {
      await pb.collection('offers').delete(offerId)
      await pb.collection('tickets').update(ticketId,{'offers-': offerId});
      setSentOffers((prevOffer) => prevOffer.filter(offer => offer.id !== offerId));
    } catch (error) {
      console.error('Error canceling ticket:', error);
    }
  }

  const handleNewOffer = async (ticketId: string, sellerId: string, oldOfferId: string) => {
    try {
      const data = {
        ticket: ticketId,
        sender: pb.authStore.model?.id,
        receiver: sellerId,
        amount: offerAmount,
      };

      const newOfferData = await pb.collection('offers').create(data);
      await pb.collection('offers').delete(oldOfferId);
      await pb.collection('tickets').update(ticketId,{
        'offers+': newOfferData.id,
        'offers-': oldOfferId
      });
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
      case "Pending": return "bg-yellow-700"
      case "Accepted": return "bg-green-700"
      case "Declined": return "bg-destructive"
      case "Cancelled": return "bg-muted-foreground"
      default: return "bg-muted-foreground"
    }
  }

  const handleRateSeller = async (sellerId: string) => {
    try {
      await pb.collection('ratings').create({
        ratedUserID: sellerId,
        rating: rating,
      });
      toast({
        title: "Rating Submitted",
        description: "Thank you for rating the seller.",
      });
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was an error submitting your rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReportSeller = async (sellerId: string) => {
    try {
      await pb.collection('support').create({
        sender: pb.authStore.model?.id,
        reportedUser: sellerId,
        message: reportReason,
        type: "report"
      });
      setReportReason("");
      toast({
        title: "Seller Reported",
        description: "Thank you for reporting the seller. We will investigate this matter.",
      });
      setIsReportDrawerOpen(false);
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openChatDialog = (offerId: string) => {
    setCurrentOfferId(offerId);
    setIsChatDialogOpen(true);
  };


  if (loading) {
    return <LoadingSkeleton />
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Sent Offers</h1>
        
        {sentOffers.length === 0 ? (
          <p>You haven&apos;t sent any offers yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sentOffers.map((offer) => (
              <div
                key={offer.id}
                className={`flip-card-sent-offers ${showSellerInfo[offer.id] ? 'flipped' : ''}`}
              >
                <div className="flip-card-inner">
                  <Card className="border bg-card rounded-t-lg border-t border-border flip-card-front">
                    <CardHeader className="p-4 bg-muted border border-border rounded-t-lg">
                      <CardTitle className="text-left">{offer.expand?.ticket.expand.event_id?.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" /> {formatDate(offer.expand?.ticket.expand.event_id?.date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-15 bg-card p-5 border border-border border-b-0 border-t-0">
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <TagIcon className="mr-2 h-4 w-4 flex-shrink-0" /> 
                          Original Price: ${offer.expand?.ticket.price}
                        </p>
                        <p className="flex items-center font-semibold">
                          <TicketIcon className="mr-2 h-4 w-4 flex-shrink-0" /> 
                          Your Offer: ${offer.amount}
                        </p>
                        <div className="mr-2 flex items-center justify-between">
                          <Badge className={`${getStatusColor(offer.status)} text-foreground`}>
                            {offer.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center bg-card rounded-b-lg border border-border border-t-0">
                      {offer.status === "Pending" && (
                        <Button onClick={() => handleCancelOffer(offer.id, offer.expand?.ticket.id)} variant="secondary" className="w-full">
                          Cancel
                        </Button>
                      )}
                      {offer.status === "Accepted" && (
                        <>
                          <Button 
                            onClick={() => viewSellerInfo(offer.id, offer.receiver)}
                            className="w-full mr-2"
                            variant={"secondary"}
                          >
                            Seller Details
                          </Button>
                          <Button 
                            onClick={() => openChatDialog(offer.id)}
                            className="w-full"
                          >
                            Chat with Seller
                          </Button>
                        </>
                      )}
                      {offer.status === "Declined" && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="w-full">Make New Offer</Button>
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
                                Send New Offer
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      {offer.status === "Cancelled" && (
                        <Button disabled className="w-full">Cancelled</Button>
                      )}
                    </CardFooter>
                  </Card>
                  
                  <Card className="flip-card-back border bg-card rounded-t-lg border-t border-border">
                    <CardHeader className="p-3 pt-1 pb-1 bg-muted border border-border rounded-t-lg text-left ">
                      <div className="flex justify-between items-center">
                        <CardTitle>Seller Details</CardTitle>
                        <Button variant={"ghost"} size={"icon"} onClick={() => setShowSellerInfo(prevState => ({ ...prevState, [offer.id]: false }))}>
                          <Undo2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="h-15 bg-card p-5 border border-border border-b-0 border-t-0 border-b-transparent">
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <UserIcon className="mr-2 h-4 w-4 flex-shrink-0" /> 
                          Seller: {sellerInfo[offer.id]?.name}
                        </p>
                        <p className="flex items-center">
                          <PhoneIcon className="mr-2 h-4 w-4 flex-shrink-0" /> 
                          Phone: {sellerInfo[offer.id]?.phone}
                        </p>
                        <p className="flex items-center">
                          <MailIcon className="mr-2 h-4 w-4 flex-shrink-0" /> 
                          Email: {sellerInfo[offer.id]?.email}
                        </p>
                        <p className="flex items-center">
                          <Wallet className="mr-2 h-4 w-4 flex-shrink-0" /> 
                          Venmo: {sellerInfo[offer.id]?.venmo}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center bg-card rounded-b-lg border border-border border-t-0 border-t-transparent">
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button className="w-full">Rate Seller</Button>
                        </DrawerTrigger>
                        <DrawerContent
                          onCloseAutoFocus={(event) => {
                            event.preventDefault();
                          }}
                        >
                          <DrawerHeader>
                            <DrawerTitle>Rate Seller</DrawerTitle>
                            <DrawerDescription>How was your experience with this seller?</DrawerDescription>
                          </DrawerHeader>
                          <div className="flex justify-center my-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                onClick={() => setRating(star)}
                              />
                            ))}
                          </div>
                          <DrawerFooter>
                            <Button onClick={() => handleRateSeller(offer.receiver)}>Submit Rating</Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                      <Drawer open={isReportDrawerOpen} onOpenChange={setIsReportDrawerOpen}>
                        <DrawerTrigger asChild>
                          <Button className="w-full ml-2" variant={"destructive"}>Report Seller</Button>
                        </DrawerTrigger>
                        <DrawerContent
                          onCloseAutoFocus={(event) => {
                            event.preventDefault();
                          }}
                        >
                          <DrawerHeader>
                            <DrawerTitle>Report Seller</DrawerTitle>
                            <DrawerDescription>Please provide a reason for reporting this seller.</DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4">
                            <Label htmlFor="report" className="text-right">Reason for reporting</Label>
                            <Textarea 
                              id="report" 
                              value={reportReason} 
                              onChange={(e) => setReportReason(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                          <DrawerFooter>
                            <Button variant={"destructive"} onClick={() => handleReportSeller(offer.receiver)}>Submit Report</Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat with Seller</DialogTitle>
            <DialogDescription>
              Discuss the details of your offer with the seller.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea id="messageScrollArea" className="h-[300px] w-full rounded-md border p-4" ref={scrollAreaRef}>
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.sender === pb.authStore.model?.id ? 'text-right' : 'text-left'}`}>
                <p className="inline-block bg-primary text-primary-foreground rounded-lg py-2 px-4 max-w-[70%] break-words">
                  {message.content}
                </p>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center space-x-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-grow max-h-32"
              rows={2}
            />
            <Button onClick={sendMessage} size="icon">
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default isAuth(SentOffersPage)