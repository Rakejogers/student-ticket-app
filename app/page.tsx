import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-[#202A25] to-[#5F4BB6] text-white">
            <header className="flex flex-col items-center bg-[#202A25]/90 backdrop-blur-sm p-6 rounded-lg shadow-md">
                <h1 className="text-5xl font-extrabold text-[#86A5D9] mb-6">Student Ticket Marketplace</h1>
                <nav>
                    <ul className="flex gap-8">
                        <li><Link href="/register" className="text-lg text-[#86A5D9] hover:underline hover:text-[#0CC0C0] transition">Register</Link></li>
                        <li><Link href="/login" className="text-lg text-[#86A5D9] hover:underline hover:text-[#0CC0C0] transition">Login</Link></li>
                        <li><Link href="/list-ticket" className="text-lg text-[#86A5D9] hover:underline hover:text-[#0CC0C0] transition">List a Ticket</Link></li>
                        <li><Link href="/browse-tickets" className="text-lg text-[#86A5D9] hover:underline hover:text-[#0CC0C0] transition">Browse Tickets</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="flex flex-col gap-12 row-start-2 items-center sm:items-start">
                <h2 className="text-xl font-bold text-[#C4EBC8] mb-4">The only <span className="text-[#0CC0C0] font-extrabold">open-source</span> and <span className="text-[#0CC0C0] font-extrabold">free to use</span> ticket marketplace</h2>
                <p className="text-center sm:text-left max-w-xl text-[#86A5D9]">Buy and sell student tickets for your university events safely and easily with our simple and secure platform.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="p-8 border border-[#5F4BB6] rounded-xl shadow-lg transition hover:shadow-2xl hover:border-[#0CC0C0]">
                        <h3 className="text-2xl font-bold text-[#0CC0C0] mb-3">Find Tickets by Event</h3>
                        <p className="text-[#C4EBC8]">Filter tickets by event, date, and price to find exactly what you're looking for.</p>
                    </div>
                    <div className="p-8 border border-[#5F4BB6] rounded-xl shadow-lg transition hover:shadow-2xl hover:border-[#0CC0C0]">
                        <h3 className="text-2xl font-bold text-[#0CC0C0] mb-3">Sell Your Tickets</h3>
                        <p className="text-[#C4EBC8]">List your tickets in just a few easy steps, and connect with buyers instantly.</p>
                    </div>
                    <div className="p-8 border border-[#5F4BB6] rounded-xl shadow-lg transition hover:shadow-2xl hover:border-[#0CC0C0]">
                        <h3 className="text-2xl font-bold text-[#0CC0C0] mb-3">Secure Authentication</h3>
                        <p className="text-[#C4EBC8]">Verify your student status to gain access to exclusive student-only deals and offers.</p>
                    </div>
                    <div className="p-8 border border-[#5F4BB6] rounded-xl shadow-lg transition hover:shadow-2xl hover:border-[#0CC0C0]">
                        <h3 className="text-2xl font-bold text-[#0CC0C0] mb-3">Reputation System</h3>
                        <p className="text-[#C4EBC8]">Review your experience with sellers to keep the marketplace safe and reliable for everyone.</p>
                    </div>
                </div>
            </main>

            <footer className="row-start-3 flex gap-8 flex-wrap items-center justify-center bg-[#202A25]/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <p className="text-sm text-[#86A5D9]">&copy; 2024 Student Ticket Marketplace. All rights reserved.</p>
            </footer>
        </div>
    );
}