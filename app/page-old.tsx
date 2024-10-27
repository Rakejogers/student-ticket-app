import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-900 to-blue-900 text-gray-200">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold">Student Ticket Marketplace</h1>
        <p className="text-2xl mt-4">
          The <span className="font-bold text-red-600">ONLY</span> Student Ticket Marketplace <span className="font-bold text-green-500">free</span> and <span className="font-bold text-orange-500">open-source</span>
        </p>
      </header>
      <div className="flex gap-5">
        <Link href="/login">
          <button className="bg-gray-800 text-gray-400 rounded-lg px-6 py-3 text-lg font-medium border border-transparent hover:bg-gray-700 hover:text-purple-500 hover:border-purple-500 transition-colors">Login</button>
        </Link>
        <Link href="/signup">
          <button className="bg-gray-800 text-gray-400 rounded-lg px-6 py-3 text-lg font-medium border border-transparent hover:bg-gray-700 hover:text-purple-500 hover:border-purple-500 transition-colors">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;