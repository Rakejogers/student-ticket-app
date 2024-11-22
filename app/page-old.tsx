'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, DollarSign, Shield, Zap, ArrowRight, Star } from 'lucide-react'

const features = [
  { icon: DollarSign, title: "No Fees", description: "No fees or inflated prices, ever" },
  { icon: Users, title: "Student-to-Student", description: "Connect directly with fellow students" },
  { icon: Shield, title: "Verified Students", description: "All students are verified for authenticity" },
  { icon: Star, title: "Reputaion and Rating System", description: "Keepings users accountable with seller ratings" },
  { icon: Zap, title: "Instant Transfer", description: "Quick and easy ticket transfers" },
  { icon: CheckCircle, title: "Built for Students, by Students", description: "Designed and built from students from your univeristy" },
]

const howItWorks = [
  { title: "Sign Up", description: "Create your account with your student email" },
  { title: "List or Browse", description: "Post your tickets or find the ones you want" },
  { title: "Ticket Exchange", description: "Contact the seller to complete the transaction" },
]

const faqs = [
  { question: "How does the ticket marketplace work?", answer: "Our app allows students to buy and sell tickets directly from one another. Sellers list their tickets with event details, and buyers can browse, message, and finalize deals directly with them. It’s a peer-to-peer, fee-free marketplace made just for students!" },
  { question: "How do I verify my student status?", answer: "You can verify your student status by signing up with your official university email address. We'll send a verification link to confirm your enrollment." },
  { question: "Are there any fees for using Scholar Seats?", answer: "Scholar Seats is completely free for students to use. We don't charge any fees for listing or purchasing tickets." },
  { question: "How is the app kept safe for students?", answer: "We require student verification at sign-up, so only verified students can use the platform. Plus, we have a reputation and rating system to help ensure trust and accountability among users." },
  { question: "How are payments handled?", answer: "Payments are made directly between the buyer and seller, using platforms like Venmo, Cash App, or any payment method you agree on. This keeps things simple and flexible!" },
  { question: "What univeristies are supported?", answer: "Currently we are only supported at the Univerity of Kentucky, but we plan to roll out to other universites soon!" },
]

export default function LandingPage() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true, // Ensures the animation triggers only once
    threshold: 0.5,    // Adjusts how much of the element needs to be visible before triggering
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <main>
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Scholar Seats
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
                No Fees, Just Seats – Student to Student
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <motion.h2
            className="text-3xl font-bold mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section ref={ref} className="container mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={controls}
          variants={itemVariants}
        >
          How It Works
        </motion.h2>
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {howItWorks.map((step, index) => (
            <motion.div key={index} className="flex flex-col items-center text-center max-w-xs" variants={itemVariants}>
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < howItWorks.length - 1 && (
                <ArrowRight className="hidden md:block h-8 w-8 text-primary mt-4" />
              )}
              {index === 2 && <CheckCircle className="hidden md:block h-8 w-8 text-primary mt-4" />}
            </motion.div>
          ))}
        </motion.div>
      </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="bg-transparent text-secondary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center text-center">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:underline">Our Story</Link></li>
                <li><Link href="/team" className="hover:underline">Team</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-secondary-foreground/10 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Scholar Seats. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}