'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, DollarSign, Shield, Lock, ArrowRight, Star, ChevronDown, GraduationCap } from 'lucide-react'
import pb from './pocketbase'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

const features = [
  { icon: DollarSign, title: "No Fees", description: "No fees or inflated prices, ever" },
  { icon: Users, title: "Student-to-Student", description: "Connect directly with fellow students" },
  { icon: Shield, title: "Verified Students", description: "All students are verified for authenticity" },
  { icon: Star, title: "Reputation and Rating System", description: "Keepings users accountable with seller ratings" },
  { icon: Lock, title: "Secure Platform", description: "Your data is only used for ticket transactions" },
  { icon: GraduationCap, title: "Built for Students, by Students", description: "Designed and built from students at UK" },
]

const howItWorks = [
  { title: "Sign Up", description: "Create your account with your student email" },
  { title: "List or Browse", description: "Post your tickets or find the ones you want" },
  { title: "Ticket Exchange", description: "Contact the seller to complete the transaction" },
]

const faqs = [
  { question: "How does the ticket marketplace work?", answer: "Our app allows students to buy and sell tickets directly from one another. Sellers list their tickets with event details, and buyers can browse, message, and finalize deals directly with them. It's a peer-to-peer, fee-free marketplace made just for students!" },
  { question: "How do I verify my student status?", answer: "You sign in with your official university's Single Sign-On, which automatically verifies that you attend that university. We never handle or see your university credentials; they are managed by your university." },
  { question: "Are there any fees for using Scholar Seats?", answer: "Scholar Seats is completely free for students to use. We don't charge any fees for listing or purchasing tickets." },
  { question: "How is the app kept safe for students?", answer: "We require student verification at sign-up, so only verified students can use the platform. Plus, we have a reputation and rating system to help ensure trust and accountability among users." },
  { question: "How are payments handled?", answer: "Payments are made directly between the buyer and seller, using platforms like Venmo, Cash App, or any payment method you agree on. This keeps things simple and flexible!" },
  { question: "What univeristies are supported?", answer: "Currently we are only supported at the Univerity of Kentucky, but we plan to roll out to other universites soon!" },
]

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: inView ? 1 : 0, 
        y: inView ? 0 : 20 
      }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <CardHeader>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <feature.icon className="h-8 w-8 mb-2 text-primary" />
          </motion.div>
          <CardTitle>{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{feature.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HowItWorksStep = ({ step, index }: { step: typeof howItWorks[0], index: number }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div 
      ref={ref}
      className="flex flex-col items-center text-center max-w-xs" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: inView ? 1 : 0, 
        y: inView ? 0 : 20 
      }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
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
      {index === howItWorks.length - 1 && (
        <CheckCircle className="hidden md:block h-8 w-8 text-primary mt-4" />
      )}
    </motion.div>
  );
};

export default function LandingPage() {
  const router = useRouter();

  const oauthLogin = async () => {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'microsoft' });
    console.log(authData)
    const email = authData.meta?.email;
    const emailDomain = email?.split('@')[1];

    if (emailDomain === 'uky.edu') {
      if (authData.meta?.isNew || authData.record?.name === "") {
        router.push("/onboarding")
      } else {
        router.push("/browse/events")
      }
    } else {
      pb.authStore.clear();
      await pb.collection('users').delete(authData.record.id);
      toast({
        title: "Access Denied",
        description: "You must use a uky.edu email to access this application.",
        variant: "destructive",
      });
    }
  }

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="relative min-h-[950px] flex items-center justify-center overflow-hidden bg-background px-4 sm:px-10 pt-16 md:pt-20">
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 z-[1]"></div>
          
          {/* Background images */}
          {/* First image - Top Right */}
          <div className="absolute right-[-20px] sm:right-[-44px] top-[60px] sm:top-[50px] z-0 w-[280px] sm:w-[479px] h-[180px] sm:h-[304px] rounded-3xl transform rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:z-10">
            <Image 
              src="/images/uk_football.jpg" 
              alt="Concert stage background image" 
              fill
              className="object-cover rounded-3xl opacity-50 sm:opacity-70 hover:opacity-90 transition-opacity duration-500"
            />
          </div>
          {/* Second image - Below Left */}
          <div className="absolute left-[-50px] sm:left-[-101px] top-[180px] sm:top-[100px] z-0 w-[280px] sm:w-[491px] h-[200px] sm:h-[325px] rounded-3xl transform -rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:z-10">
            <Image 
              src="/images/ky-basketball.jpg"
              alt="Concert lights background image" 
              fill
              className="object-cover rounded-3xl opacity-50 sm:opacity-70 hover:opacity-90 transition-opacity duration-500"
            />
          </div>
          {/* Third image - Below Right */}
          <div className="absolute right-[-40px] sm:right-[-120px] top-[320px] sm:top-[400px] z-0 w-[280px] sm:w-[472px] h-[180px] sm:h-[291px] rounded-3xl transform rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:z-10">
            <Image 
              src="/images/rupp-arena.jpg" 
              alt="Concert performance background image" 
              fill
              className="object-cover rounded-3xl opacity-50 sm:opacity-70 hover:opacity-90 transition-opacity duration-500"
            />
          </div>
          {/* Fourth image - Bottom Left */}
          <div className="absolute left-[-60px] sm:left-[-171px] top-[460px] sm:top-[450px] z-0 w-[280px] sm:w-[450px] h-[180px] sm:h-[280px] rounded-3xl transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:z-10">
            <Image 
              src="/images/kroger_field.webp" 
              alt="Concert crowd background image" 
              fill
              className="object-cover rounded-3xl opacity-50 sm:opacity-70 hover:opacity-90 transition-opacity duration-500"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto text-center">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl sm:text-6xl md:text-[88px] font-extrabold mb-4 sm:mb-6 text-primary leading-tight uppercase font-['Reddit_Sans_Condensed',_sans-serif]">
                  GET INVOLVED.<br/>GET YOUR <span className="text-foreground">SEAT.</span>
                </h1>
                <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-[600px] mx-auto">
                  Buy and sell university sports tickets directly with verified students. No fees, no hassle.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col gap-4 justify-center items-center mb-8 sm:mb-12"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(var(--primary), 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full max-w-[250px]"
                >
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 group flex items-center gap-2 w-full py-2.5 sm:py-3 px-6 sm:px-8 text-base sm:text-lg font-semibold" 
                    onClick={() => oauthLogin()}
                  >
                    Get Ticket now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </motion.div>
                <p className="text-[10px] sm:text-xs text-muted-foreground text-center w-full flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Secure login through Microsoft
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex justify-center mt-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                variant="ghost"
                size="lg"
                className="flex flex-col items-center gap-2 group hover:bg-transparent hover:text-primary"
                onClick={scrollToFeatures}
              >
                Learn More
                <motion.div
                  animate={{
                    y: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronDown className="w-6 h-6 text-primary group-hover:text-primary/80" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </section>

        <section 
          id="features"
          className="container mx-auto px-4 py-16"
        >
          <motion.h2
            className="text-3xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </section>

        <section 
          id="how-it-works" 
          className="container mx-auto px-4 py-16"
        >
          <motion.h2
            className="text-3xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
            {howItWorks.map((step, index) => (
              <HowItWorksStep key={index} step={step} index={index} />
            ))}
          </div>
        </section>

        <section 
          id="faq" 
          className="container mx-auto px-4 py-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <AccordionTrigger>
                    <motion.div
                      animate={{ rotate: 0 }}
                      exit={{ rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {faq.question}
                    </motion.div>
                  </AccordionTrigger>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AccordionContent>{faq.answer}</AccordionContent>
                </motion.div>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="bg-transparent text-secondary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center text-center">
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-secondary-foreground/10 pt-8 text-center">
            <motion.a
              href="https://www.buymeacoffee.com/jakerogers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 mb-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">☕</span>
              Buy Us a Coffee
            </motion.a>
            <p>&copy; {new Date().getFullYear()} Scholar Seats. All rights reserved.</p>
            <p className="text-xs text-muted-foreground text-center w-full flex items-center justify-center gap-1 mt-1">
              Built by Jake and Nate
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}