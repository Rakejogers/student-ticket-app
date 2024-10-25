"use client";

import React, { useState, useEffect } from 'react';
import isAuth from '../../../components/isAuth';
import pb from '@/app/pocketbase';
import { RecordModel } from 'pocketbase';
import { useRouter } from 'next/navigation';

const SellTicketsPage: React.FC = () => {
  const [event, setEvent] = useState('');
  const [price, setPrice] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [events, setEvents] = useState<RecordModel[]>([]);
  const [sport, setSport] = useState('');

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
        console.error('Error fetching events:', error);
      }
    };

      fetchEvents();
  }, [sport]);

  const handleSellTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pb.authStore.model == null) {
      throw new Error("User not found");
    }
    const data = {
      "event_id": event,
      "ticket_type": ticketType,
      "price": price,
      "status": "Available",
      "seller_id": pb.authStore.model.id,
    };

    const record = await pb.collection('tickets').create(data);
    router.push("/account/my-tickets")
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-900 to-blue-900 text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Sell Your Ticket</h1>
      <form onSubmit={handleSellTicket} className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
        <div className="mb-4">
          <label htmlFor="sport" className="block text-sm font-medium mb-2">Sport</label>
          <select
            id="sport"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select ticket type</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="event" className="block text-sm font-medium mb-2">Event Name</label>
          <select
            id="event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select an event</option>
            {events.map((eventRecord) => (
              <option key={eventRecord.id} value={eventRecord.id}>
                {eventRecord.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="ticketType" className="block text-sm font-medium mb-2">Ticket Type</label>
          <select
            id="ticketType"
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select ticket type</option>
            {sport !== 'football' && (
              <option value="ezone">Ezone</option>
            )}
            <option value="reserved">Reserved</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium mb-2">Price ($)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Sell Ticket
        </button>
      </form>
    </div>
  );
};

export default isAuth(SellTicketsPage);