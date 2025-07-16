"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import isAuth from '../../../components/isAuth';
import pb from '@/app/pocketbase';
import { RecordModel } from 'pocketbase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CiCircleAlert } from "react-icons/ci";
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { 
  MdSportsSoccer, 
  MdSportsBasketball, 
  MdEvent, 
  MdConfirmationNumber, 
  MdAttachMoney,
  MdArrowForward,
  MdCheckCircle
} from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";

const SellTicketsPage: React.FC = () => {
  const [sport, setSport] = useState('');
  const [event, setEvent] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [price, setPrice] = useState('');
  const [events, setEvents] = useState<RecordModel[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [existingTickets, setExistingTickets] = useState<RecordModel[]>([]);
  const [priceStats, setPriceStats] = useState<{
    lowest: number;
    average: number;
    histogram: { price: number; count: number }[];
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push(`/login?redirect=${encodeURIComponent("/list-ticket")}`);
    }
    
    const fetchEvents = async () => {
      if (!sport) {
        setEvents([]);
        return;
      }
      
      setIsLoading(true);
      setError("");
      
      try {
        const records = await pb.collection('events').getList(1, 10, {
          filter: `sport="${sport}" && active=true`,
          sort: '+date'
        });
        setEvents(records.items);
        setCurrentStep(2);
      } catch (error) {
        setError("Error fetching events");
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [sport, router]);

  const handleSportChange = (value: string) => {
    setSport(value);
    setEvent('');
    setTicketType('');
    setPrice('');
    setCurrentStep(1);
  };

  const handleEventChange = (value: string) => {
    setEvent(value);
    setCurrentStep(3);
  };

  const handleTicketTypeChange = (value: string) => {
    setTicketType(value);
    setCurrentStep(4);
  };

  // Fetch existing tickets for price analysis
  useEffect(() => {
    const fetchExistingTickets = async () => {
      if (!event || !ticketType) {
        setExistingTickets([]);
        setPriceStats(null);
        return;
      }

      try {
        const tickets = await pb.collection('tickets').getList(1, 100, {
          filter: `event_id="${event}" && ticket_type="${ticketType}" && status="Available"`,
          sort: '+price'
        });

        setExistingTickets(tickets.items);

        if (tickets.items.length > 0) {
          const prices = tickets.items.map(ticket => parseFloat(ticket.price));
          const lowest = Math.min(...prices);
          const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

          // Create histogram data
          const priceRanges = new Map<number, number>();
          prices.forEach(price => {
            const roundedPrice = Math.round(price / 5) * 5; // Group by $5 intervals
            priceRanges.set(roundedPrice, (priceRanges.get(roundedPrice) || 0) + 1);
          });

          const histogram = Array.from(priceRanges.entries())
            .map(([price, count]) => ({ price, count }))
            .sort((a, b) => a.price - b.price);

          setPriceStats({ lowest, average, histogram });
        } else {
          setPriceStats(null);
        }
      } catch (error) {
        console.error('Error fetching existing tickets:', error);
        setPriceStats(null);
      }
    };

    fetchExistingTickets();
  }, [event, ticketType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pb.authStore.model == null) {
      throw new Error("User not found");
    }
    
    if (pb.authStore.model.verified == false) {
      toast({
        title: `Verification Required`,
        description: `Verify your account before selling tickets.`,
        variant: "destructive",
        action: (
          <ToastAction onClick={() => { router.push("/account/profile") }} altText='Verify Account'>Verify Now</ToastAction>
        ),
      })
      return;
    }
    
    if (!sport || !event || !ticketType || !price) {
      toast({
        title: `Fill in all fields`,
        description: `Please fill in all fields before submitting.`,
        variant: "destructive",
      })
      return;
    }
    
    if (pb.authStore.model.venmo == ""){
      toast({
        title: `Must have a Venmo in Profile`,
        description: `Please add a Venmo account to your profile before selling tickets.`,
        variant: "destructive",
        action: (
          <ToastAction onClick={() => { router.push("/account/profile") }} altText='Add Venmo'>Add Now</ToastAction>
        ),
      })
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    const data = {
      "event_id": event,
      "ticket_type": ticketType,
      "price": price,
      "status": "Available",
      "seller_id": pb.authStore.model.id,
    };

    try {
      const newTicketRecord = await pb.collection('tickets').create(data);
      await pb.collection('events').update(event, {'tickets+': newTicketRecord.id})
      
      toast({
        title: "Success!",
        description: "Your ticket has been listed successfully.",
        action: (
          <ToastAction onClick={() => { router.push("/account/my-tickets") }} altText='View Tickets'>View Tickets</ToastAction>
        ),
      });
      
      router.push("/account/my-tickets");
    } catch (error) {
      setError("Error creating ticket. Please try again.");
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Sell Your Ticket
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            List your tickets in just a few simple steps and connect with buyers instantly
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-4 sm:mb-6 px-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {currentStep > step ? <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-md mx-auto px-4">
            <span>Sport</span>
            <span>Event</span>
            <span>Type</span>
            <span>Price</span>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Sport Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <MdSportsSoccer className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold">Choose Sport</Label>
                      <p className="text-sm text-muted-foreground">Select the sport for your ticket</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <motion.button
                      type="button"
                      onClick={() => handleSportChange('football')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative h-20 sm:h-24 rounded-xl border-2 transition-all duration-300
                        flex flex-col items-center justify-center space-y-2
                        ${sport === 'football' 
                          ? 'border-primary bg-primary/10 text-primary shadow-lg' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <MdSportsSoccer className={`w-6 h-6 sm:w-8 sm:h-8 ${sport === 'football' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`} />
                      <span className={`text-sm sm:text-base font-semibold ${sport === 'football' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                        Football
                      </span>
                      {sport === 'football' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <MdCheckCircle className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => handleSportChange('basketball')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative h-20 sm:h-24 rounded-xl border-2 transition-all duration-300
                        flex flex-col items-center justify-center space-y-2
                        ${sport === 'basketball' 
                          ? 'border-primary bg-primary/10 text-primary shadow-lg' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <MdSportsBasketball className={`w-6 h-6 sm:w-8 sm:h-8 ${sport === 'basketball' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`} />
                      <span className={`text-sm sm:text-base font-semibold ${sport === 'basketball' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                        Basketball
                      </span>
                      {sport === 'basketball' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <MdCheckCircle className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Event Selection */}
                <AnimatePresence>
                  {sport && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <MdEvent className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <Label htmlFor="event" className="text-lg font-semibold">Select Event</Label>
                          <p className="text-sm text-muted-foreground">Choose the specific game or event</p>
                        </div>
                      </div>
                      {isLoading ? (
                        <div className="space-y-3">
                          <Skeleton className="h-14 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        <Select onValueChange={handleEventChange} value={event}>
                          <SelectTrigger className="h-14 text-lg">
                            <SelectValue placeholder="Select an event" />
                          </SelectTrigger>
                          <SelectContent>
                            {events.map((eventRecord) => (
                              <SelectItem key={eventRecord.id} value={eventRecord.id} className="text-lg py-3">
                                {eventRecord.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ticket Type Selection */}
                <AnimatePresence>
                  {event && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <MdConfirmationNumber className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <Label htmlFor="ticket-type" className="text-lg font-semibold">Ticket Type</Label>
                          <p className="text-sm text-muted-foreground">Select your ticket category</p>
                        </div>
                      </div>
                      <Select onValueChange={handleTicketTypeChange} value={ticketType}>
                        <SelectTrigger className="h-14 text-lg">
                          <SelectValue placeholder="Select a ticket type" />
                        </SelectTrigger>
                        <SelectContent>
                          {sport !== 'football' && (
                            <SelectItem value="Ezone" className="text-lg py-3">Ezone</SelectItem>
                          )}
                          <SelectItem value="Reserved" className="text-lg py-3">Reserved</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Price Input */}
                <AnimatePresence>
                  {ticketType && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                          <MdAttachMoney className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <Label htmlFor="price" className="text-lg font-semibold">Set Your Price</Label>
                          <p className="text-sm text-muted-foreground">Enter the price you want to sell for</p>
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-muted-foreground">$</span>
                                                 <Input
                           id="price"
                           type="number"
                           placeholder="0.00"
                           value={price}
                           onChange={(e) => setPrice(e.target.value)}
                           min="0"
                           step="0.01"
                           className="h-14 text-lg pl-8"
                         />
                       </div>
                       
                       {/* Price Analysis */}
                       <AnimatePresence>
                         {priceStats && (
                           <motion.div
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             transition={{ duration: 0.3 }}
                             className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                           >
                             <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                               Market Analysis ({existingTickets.length} tickets listed)
                             </h4>
                             
                             {/* Price Stats */}
                             <div className="grid grid-cols-2 gap-4 mb-4">
                               <div className="text-center">
                                 <div className="text-lg font-bold text-green-600">
                                   ${priceStats.lowest.toFixed(2)}
                                 </div>
                                 <div className="text-xs text-muted-foreground">Lowest</div>
                               </div>
                               <div className="text-center">
                                 <div className="text-lg font-bold text-blue-600">
                                   ${priceStats.average.toFixed(2)}
                                 </div>
                                 <div className="text-xs text-muted-foreground">Average</div>
                               </div>
                             </div>
                             
                             {/* Simple Histogram */}
                             {/* {priceStats.histogram.length > 0 && (
                               <div className="space-y-2">
                                 <div className="text-xs text-muted-foreground mb-2">Price Distribution</div>
                                 <div className="space-y-1">
                                   {priceStats.histogram.map((item, index) => {
                                     const maxCount = Math.max(...priceStats.histogram.map(h => h.count));
                                     const widthPercentage = (item.count / maxCount) * 100;
                                     return (
                                       <div key={index} className="flex items-center space-x-2">
                                         <div className="w-12 text-xs text-muted-foreground">
                                           ${item.price}
                                         </div>
                                         <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                           <div 
                                             className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                             style={{ width: `${widthPercentage}%` }}
                                           />
                                         </div>
                                         <div className="w-6 text-xs text-muted-foreground text-right">
                                           {item.count}
                                         </div>
                                       </div>
                                     );
                                   })}
                                 </div>
                               </div>
                             )} */}
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </motion.div>
                   )}
                 </AnimatePresence>

                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/10">
                        <CiCircleAlert className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="pt-6"
                >
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isSubmitting || !sport || !event || !ticketType || !price}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Listing Your Ticket...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>List My Ticket</span>
                        <MdArrowForward className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8 text-sm text-muted-foreground max-w-md mx-auto"
        >
          <p>
            Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a> or check out our <a href="/terms" className="text-blue-600 hover:underline">selling guidelines</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default isAuth(SellTicketsPage);