"use client"; // Add this line at the top to prevent server-side rendering

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import isAuth from '../../../../components/isAuth';

interface Ticket {
  id: string;
  event: string;
  price: number;
  date: string;
  location: string;
}

const BrowseTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Mock data fetching
    const mockTickets: Ticket[] = [
      { id: '1', event: 'Concert A', price: 50, date: '2024-10-10', location: 'Venue X' },
      { id: '2', event: 'Concert B', price: 60, date: '2024-10-15', location: 'Venue Y' },
      { id: '3', event: 'Game C', price: 45, date: '2024-11-05', location: 'Stadium Z' },
    ];
    setTickets(mockTickets);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 to-blue-900 text-gray-200 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Browse Tickets</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">{ticket.event}</h2>
            <p className="text-lg">Date: {ticket.date}</p>
            <p className="text-lg">Location: {ticket.location}</p>
            <p className="text-lg font-semibold mt-4">Price: ${ticket.price}</p>
            <Link href={`/tickets/${ticket.id}`}>
              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default isAuth(BrowseTicketsPage);