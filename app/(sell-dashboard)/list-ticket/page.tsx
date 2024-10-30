"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import isAuth from '../../../components/isAuth';
import pb from '@/app/pocketbase';
import { RecordModel } from 'pocketbase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CiCircleAlert } from "react-icons/ci";

const SellTicketsPage: React.FC = () => {
  const [sport, setSport] = useState('');
  const [event, setEvent] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [price, setPrice] = useState('');
  const [events, setEvents] = useState<RecordModel[]>([]);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!sport) return;
      try {
        const records = await pb.collection('events').getList(1, 10, {
          filter: `sport="${sport}"`,
          sort: '-date'
        });
        setEvents(records.items);
      } catch (error) {
        setError("Error fetching events");
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [sport]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pb.authStore.model == null) {
      throw new Error("User not found");
    }
    if (pb.authStore.model.verified == false) {
      setError("Please verify your account before selling tickets. Go to Account->Profile to send a verification email.");
      return;
    }
    const data = {
      "event_id": event,
      "ticket_type": ticketType,
      "price": price,
      "status": "Available",
      "seller_id": pb.authStore.model.id,
    };

    try {
      await pb.collection('tickets').create(data);
      router.push("/account/my-tickets");
    } catch (error) {
      setError("Error creating ticket");
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sell Your Ticket</CardTitle>
            <CardDescription className="text-center">Select your preferences and sell tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Select onValueChange={setSport} required>
                  <SelectTrigger id="sport">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event">Event</Label>
                <Select onValueChange={setEvent} required>
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((eventRecord) => (
                      <SelectItem key={eventRecord.id} value={eventRecord.id}>
                        {eventRecord.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-type">Ticket Type</Label>
                <Select onValueChange={setTicketType} required>
                  <SelectTrigger id="ticket-type">
                    <SelectValue placeholder="Select a ticket type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sport !== 'football' && (
                      <SelectItem value="Ezone">Ezone</SelectItem>
                    )}
                    <SelectItem value="Reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <CiCircleAlert className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button className="w-full" type="submit">Sell Ticket</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default isAuth(SellTicketsPage);