"use client";

import { useSearchParams } from 'next/navigation';

const TicketPage = () => {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketId');

  return (
    <div>
        <h1>Ticket Information</h1>
        <div>
            <h2>Id: {ticketId}</h2>
            <p>Date: TBD</p>
            <p>Location: TBD</p>
            <p>Price: TBD</p>
        </div>
        <div>
            <h3>Description</h3>
            <p>Event description goes here...</p>
        </div>
        <div>
            <h3>Additional Information</h3>
            <p>Additional details about the event...</p>
        </div>
    </div>
);
};
export default TicketPage;