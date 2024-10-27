'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600">
          Student Ticket Marketplace
        </h1>
        <p className="text-xl mb-8 text-gray-700">
          The ONLY Student Ticket Marketplace free and open-source
        </p>
        <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700" asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
      </motion.div>
    </div>
  )
}