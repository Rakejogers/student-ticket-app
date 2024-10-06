import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold">Student Ticket Marketplace</h1>
        <p className="text-2xl mt-4">Buy and sell student tickets easily and securely</p>
      </header>
      <div className="flex gap-5">
        <Link href="/login">
          <button className="bg-gray-800 text-white rounded-lg px-6 py-3 text-lg font-medium hover:bg-gray-700 transition-colors">Login</button>
        </Link>
        <Link href="/signup">
          <button className="bg-gray-800 text-white rounded-lg px-6 py-3 text-lg font-medium hover:bg-gray-700 transition-colors">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;