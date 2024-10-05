import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-blue-100 to-white">
            <header className="flex flex-col items-center bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-md">
                <h1 className="text-5xl font-extrabold text-blue-600 mb-6">Student Ticket Marketplace</h1>
                <nav>
                    <ul className="flex gap-8">
                        <li><Link href="/register" className="text-lg text-blue-700 hover:underline hover:text-blue-900 transition">Register</Link></li>
                        <li><Link href="/login" className="text-lg text-blue-700 hover:underline hover:text-blue-900 transition">Login</Link></li>
                        <li><Link href="/list-ticket" className="text-lg text-blue-700 hover:underline hover:text-blue-900 transition">List a Ticket</Link></li>
                        <li><Link href="/browse-tickets" className="text-lg text-blue-700 hover:underline hover:text-blue-900 transition">Browse Tickets</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="flex flex-col gap-12 row-start-2 items-center sm:items-start">
                <h2 className="text-3xl font-semibold text-blue-800">Welcome to the Student Ticket Marketplace!</h2>
                <p className="text-center sm:text-left max-w-xl text-gray-700">Buy and sell student tickets for your university events safely and easily with our simple and secure platform.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="p-8 border border-gray-300 rounded-xl shadow-lg transition hover:shadow-2xl hover:border-blue-400">
                        <h3 className="text-2xl font-bold text-blue-800 mb-3">Find Tickets by Event</h3>
                        <p className="text-gray-600">Filter tickets by event, date, and price to find exactly what you're looking for.</p>
                    </div>
                    <div className="p-8 border border-gray-300 rounded-xl shadow-lg transition hover:shadow-2xl hover:border-blue-400">
                        <h3 className="text-2xl font-bold text-blue-800 mb-3">Sell Your Tickets</h3>
                        <p className="text-gray-600">List your tickets in just a few easy steps, and connect with buyers instantly.</p>
                    </div>
                    <div className="p-8 border border-gray-300 rounded-xl shadow-lg transition hover:shadow-2xl hover:border-blue-400">
                        <h3 className="text-2xl font-bold text-blue-800 mb-3">Secure Authentication</h3>
                        <p className="text-gray-600">Verify your student status to gain access to exclusive student-only deals and offers.</p>
                    </div>
                    <div className="p-8 border border-gray-300 rounded-xl shadow-lg transition hover:shadow-2xl hover:border-blue-400">
                        <h3 className="text-2xl font-bold text-blue-800 mb-3">Reputation System</h3>
                        <p className="text-gray-600">Review your experience with sellers to keep the marketplace safe and reliable for everyone.</p>
                    </div>
                </div>
            </main>

            <footer className="row-start-3 flex gap-8 flex-wrap items-center justify-center bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-700">&copy; 2024 Student Ticket Marketplace. All rights reserved.</p>
            </footer>
        </div>
    );
}