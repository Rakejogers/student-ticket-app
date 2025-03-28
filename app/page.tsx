'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Shield, Lock, ArrowRight, Star, ChevronDown, GraduationCap, ArrowUpRight } from 'lucide-react'
import pb from './pocketbase'
import { useRouter } from 'next/navigation'
import LoginButton from '@/components/loginButton'

const features = [
  { icon: DollarSign, title: "No Fees", description: "No fees or inflated prices, ever" },
  { icon: Users, title: "Student-to-Student", description: "Connect directly with fellow students" },
  { icon: Shield, title: "Verified Students", description: "All students are verified for authenticity" },
  { icon: Star, title: "Reputation and Rating System", description: "Keepings users accountable with seller ratings" },
  { icon: Lock, title: "Secure Platform", description: "Your data is only used for ticket transactions" },
  { icon: GraduationCap, title: "Built for Students, by Students", description: "Designed and built from students at UK" },
]

const howItWorks = [
  { 
    title: "Login with LinkBlue", 
    description: "Login with your LinkBlue account to get started.",
    image: "/images/login.png",
    icon: GraduationCap,
    bgColor: "from-blue-500/20 to-transparent"
  },
  { 
    title: "List or Browse", 
    description: "Post your tickets for sale or browse available tickets for upcoming events. Filter by event type, date, or price.",
    image: "/images/buy-sell.png",
    icon: Users,
    bgColor: "from-blue-500/20 to-transparent"
  },
  { 
    title: "Connect", 
    description: "Message sellers directly through our secure chat system or your preferred messaging app to arrange the details of your ticket exchange.",
    image: "/images/chat.png",
    icon: Lock,
    bgColor: "from-blue-500/20 to-transparent"
  }
]

const faqs = [
  { question: "How does the ticket marketplace work?", answer: "Our app allows students to buy and sell tickets directly from one another. Sellers list their tickets with event details, and buyers can browse, message, and finalize deals directly with them. It's a peer-to-peer, fee-free marketplace made just for students!" },
  { question: "How do I verify my student status?", answer: "You sign in with your official university's Single Sign-On, which automatically verifies that you attend that university. We never handle or see your university credentials; they are managed by your university." },
  { question: "Are there any fees for using Scholar Seats?", answer: "Scholar Seats is completely free for students to use. We don't charge any fees for listing or purchasing tickets. We run completely on donations from users and advertisers." },
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

  const isEven = index % 2 === 0;

  return (
    <motion.div 
      ref={ref}
      className="relative w-full mb-20 last:mb-0" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: inView ? 1 : 0, 
        y: inView ? 0 : 20 
      }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      {/* Timeline line */}
      {index < howItWorks.length - 1 && (
        <div className="absolute left-[28px] top-[60px] bottom-[-80px] w-1 bg-primary/20 hidden md:block"></div>
      )}
      
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Step number and icon */}
        <div className="relative z-20">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold z-10 relative shadow-lg">
            {index + 1}
          </div>
          <motion.div 
            className="absolute -inset-2 rounded-full bg-primary/10"
            initial={{ scale: 0 }}
            animate={{ scale: inView ? [0, 1.2, 1] : 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
          />
        </div>
        
        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
          {/* Text content */}
          <div className={`flex-1 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
            <motion.div
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : (isEven ? -20 : 20) }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
              className="mb-6 md:mb-0"
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-3 flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <step.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">{step.description}</p>
            </motion.div>
          </div>
          
          {/* Image/illustration */}
          <div className={`flex-1 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
            <motion.div 
              className="relative h-40 sm:h-48 md:h-64 w-full overflow-hidden rounded-xl border border-border shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} z-10`} />
              <Image 
                src={step.image} 
                alt={step.title} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    if (pb.authStore.isValid) {
      router.push('/browse/events');
    }
  }, [router]);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const record = await pb.collection('num_users').getOne('1');
        setUserCount(Math.round(record.totalUsers / 5) * 5);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };
    fetchUserCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSwiping) {
        setActiveImageIndex((prev) => (prev + 1) % 4); // Cycle through 4 images
      }
    }, 4000); // Slowed down to 4 seconds for better user experience

    return () => clearInterval(interval);
  }, [isSwiping]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSwiping(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // threshold to detect a real swipe
      if (diff > 0) {
        // Swiped left
        setActiveImageIndex((prev) => (prev + 1) % 4);
      } else {
        // Swiped right
        setActiveImageIndex((prev) => (prev === 0 ? 3 : prev - 1));
      }
    }
    
    setIsSwiping(false);
  };

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="relative min-h-[700px] sm:min-h-[850px] flex flex-col items-center justify-center overflow-hidden bg-background px-0 sm:px-10 pt-0 sm:pt-16 md:pt-20">
          {/* Mobile Immersive Hero - Only visible on mobile */}
          <div className="md:hidden w-full relative h-[65vh] overflow-hidden"
               onTouchStart={(e: React.TouchEvent) => handleTouchStart(e)}
               onTouchEnd={(e: React.TouchEvent) => handleTouchEnd(e)}>
            {/* Ticket-style overlay at top */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background via-background/80 to-transparent h-[100px] flex items-center justify-center px-4 pt-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/30 border border-primary rounded-full px-4 py-2"
              >
                <div className="relative w-2 h-2">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping" />
                  <div className="absolute inset-0 bg-primary rounded-full" />
                </div>
                <span className="text-xs font-medium text-primary">No fees • Student verified</span>
              </motion.div>
            </div>
            
            {/* Images with parallax effect */}
            <motion.div 
              className="absolute inset-0 w-full h-full"
              animate={{ 
                opacity: activeImageIndex === 0 ? 1 : 0,
                scale: activeImageIndex === 0 ? 1.05 : 1
              }}
              transition={{ duration: 0.8 }}
            >
              <Image 
                src="/images/uk_football.jpg" 
                alt="UK Football" 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
            </motion.div>
            <motion.div 
              className="absolute inset-0 w-full h-full"
              animate={{ 
                opacity: activeImageIndex === 1 ? 1 : 0,
                scale: activeImageIndex === 1 ? 1.05 : 1 
              }}
              transition={{ duration: 0.8 }}
            >
              <Image 
                src="/images/ky-basketball.jpg" 
                alt="Kentucky Basketball" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
            </motion.div>
            <motion.div 
              className="absolute inset-0 w-full h-full"
              animate={{ 
                opacity: activeImageIndex === 2 ? 1 : 0,
                scale: activeImageIndex === 2 ? 1.05 : 1
              }}
              transition={{ duration: 0.8 }}
            >
              <Image 
                src="/images/rupp-arena.jpg" 
                alt="Rupp Arena" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
            </motion.div>
            <motion.div 
              className="absolute inset-0 w-full h-full"
              animate={{ 
                opacity: activeImageIndex === 3 ? 1 : 0,
                scale: activeImageIndex === 3 ? 1.05 : 1
              }}
              transition={{ duration: 0.8 }}
            >
              <Image 
                src="/images/kroger_field.webp" 
                alt="Kroger Field" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
            </motion.div>

            {/* Headline overlay */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center">
              {/* Content card that appears to float */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-full px-6 pb-12 pt-8 bg-gradient-to-t from-background via-background/90 to-transparent flex flex-col items-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className="text-4xl font-black mb-3 text-primary leading-tight uppercase font-['Reddit_Sans_Condensed',_sans-serif] tracking-tight text-center">
                    GET YOUR <span className="text-foreground">SEAT</span><span className="text-primary">.</span>
                  </h1>
                  
                  <div className="flex flex-col gap-2 mb-6">
                    <p className="text-base text-muted-foreground text-center max-w-[270px] mx-auto">
                      Buy and sell tickets directly between verified students
                    </p>
                    
                    {/* Social proof */}
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                          <Users className="w-3 h-3 text-primary" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                          <GraduationCap className="w-3 h-3 text-primary" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        <b>{userCount}+</b> UK students
                      </span>
                    </div>
                  </div>
                  
                  {/* New CTA button with improved design */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.02
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative z-[30] mb-2 pointer-events-auto"
                    onClick={() => pb.collection('users').authWithOAuth2({ provider: 'microsoft' })}
                  >
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl"></div>
                    <LoginButton
                      buttonText="Get Tickets"
                      icon={<ArrowUpRight className="w-4 h-4 order-last" />}
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground flex items-center justify-center gap-1 py-5 text-base font-semibold rounded-lg shadow-lg border border-primary/20 pointer-events-auto relative z-[40]"
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground text-center w-full flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Secure login with LinkBlue
                  </p>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Modern image indicators */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-3 z-20">
              {[0, 1, 2, 3].map((index) => (
                <motion.div 
                  key={index}
                  className={`w-2 h-${activeImageIndex === index ? '12' : '2'} rounded-full cursor-pointer transition-all duration-300 ${activeImageIndex === index ? 'bg-primary' : 'bg-primary/30'}`}
                  onClick={() => handleImageClick(index)}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
          
          {/* Desktop Background images - Only visible on desktop */}
          <div className="hidden lg:block">
            {/* First image - Top Right */}
            <motion.div
              style={{ willChange: 'transform, opacity' }}
              className="absolute right-[-44px] top-[50px] z-[1] w-[479px] h-[304px] rounded-3xl hover:shadow-xl hover:z-10 group rotate-3 border-2 border-border"
              animate={activeImageIndex === 0 ? {
                scale: 1.05,
                rotate: 3,
                zIndex: 1,
              } : {
                scale: 1,
                rotate: 3,
                zIndex: 1,
              }}
              transition={{ duration: 1 }}
            >
              <Image 
                src="/images/uk_football.jpg" 
                alt="UK Football" 
                fill
                className={`object-cover rounded-3xl transition-all duration-500 ${activeImageIndex === 0 ? 'opacity-100' : 'opacity-50'}`}
              />
            </motion.div>
            {/* Second image - Below Left */}
            <motion.div 
              className="absolute left-[-91px] top-[120px] z-[2] w-[491px] h-[325px] rounded-3xl hover:shadow-xl hover:z-10 group -rotate-6 border-2 border-border"
              animate={activeImageIndex === 1 ? {
                scale: 1.05,
                rotate: -6,
                zIndex: 2,
              } : {
                scale: 1,
                rotate: -6,
                zIndex: 2,
              }}
              transition={{ duration: 1 }}
            >
              <Image 
                src="/images/ky-basketball.jpg"
                alt="Kentucky Basketball" 
                fill
                className={`object-cover rounded-3xl transition-all duration-500 ${activeImageIndex === 1 ? 'opacity-100' : 'opacity-50'}`}
              />
            </motion.div>
            {/* Third image - Below Right */}
            <motion.div 
              className="absolute right-[-110px] top-[380px] z-[3] w-[472px] h-[291px] rounded-3xl hover:shadow-xl hover:z-10 group rotate-2 border-2 border-border"
              animate={activeImageIndex === 2 ? {
                scale: 1.05,
                rotate: 2,
                zIndex: 3,
              } : {
                scale: 1,
                rotate: 2,
                zIndex: 3,
              }}
              transition={{ duration: 1 }}
            >
              <Image 
                src="/images/rupp-arena.jpg" 
                alt="Rupp Arena" 
                fill
                className={`object-cover rounded-3xl transition-all duration-500 ${activeImageIndex === 2 ? 'opacity-100' : 'opacity-50'}`}
              />
            </motion.div>
            {/* Fourth image - Bottom Left */}
            <motion.div 
              className="absolute left-[-151px] top-[470px] z-[4] w-[450px] h-[280px] rounded-3xl hover:shadow-xl hover:z-10 group -rotate-3 border-2 border-border"
              animate={activeImageIndex === 3 ? {
                scale: 1.05,
                rotate: -3,
                zIndex: 4,
              } : {
                scale: 1,
                rotate: -3,
                zIndex: 4,
              }}
              transition={{ duration: 1 }}
            >
              <Image 
                src="/images/kroger_field.webp" 
                alt="Kroger Field" 
                fill
                className={`object-cover rounded-3xl transition-all duration-500 ${activeImageIndex === 3 ? 'opacity-100' : 'opacity-50'}`}
              />
            </motion.div>
          </div>
          
          {/* Desktop Content - Only visible on desktop */}
          <div className="container mx-auto px-4 relative z-10 hidden sm:flex flex-col justify-center h-full">
            <div className="mx-auto text-center">
              <motion.div
                className="mb-6 sm:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4 sm:mb-6"
                >
                  <div className="relative w-2 h-2">
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping" />
                    <div className="absolute inset-0 bg-primary rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-primary">New: Get Push Notifications on Mobile</span>
                </motion.div>
                <h1 className="text-4xl sm:text-6xl md:text-[88px] font-black mb-3 sm:mb-6 text-primary leading-tight uppercase font-['Reddit_Sans_Condensed',_sans-serif]">
                  GET INVOLVED.<br/>GET YOUR <span className="text-foreground">SEAT.</span>
                </h1>
                <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-5 sm:mb-8 max-w-[600px] mx-auto">
                  Buy and sell university sports tickets directly with verified students. No fees, no hassle.
                </p>
                {/* Desktop User Count */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hidden sm:flex items-center justify-center gap-3 mb-8"
                >
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Join <span className="font-semibold text-primary">{userCount}+</span> UK students
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-12 relative z-[20]"
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
                  <LoginButton
                    buttonText="Get Ticket now"
                    icon={<ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 order-last" />}
                    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground flex items-center justify-center gap-2 py-6 text-base sm:text-lg font-semibold z-10"
                  />
                </motion.div>
                <p className="text-[10px] sm:text-xs text-muted-foreground text-center w-full flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Secure login through with LinkBlue
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex justify-center mt-8 sm:mt-24"
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
            className="text-3xl md:text-4xl font-bold mb-16 text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative inline-block">
              How we do it
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </section>

        <section 
          id="how-it-works" 
          className="container mx-auto px-4 py-24 relative overflow-hidden"
        >
          
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-16 text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative inline-block">
              How it works
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.h2>
          <div className="max-w-5xl mx-auto relative z-10">
            {howItWorks.map((step, index) => (
              <HowItWorksStep key={index} step={step} index={index} />
            ))}
          </div>
        </section>

        <section 
          id="cta" 
          className="container mx-auto px-4 py-32 relative"
        >
          <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-12">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-3xl md:text-6xl lg:text-[88px] font-black leading-tight uppercase font-['Reddit_Sans_Condensed',_sans-serif]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0 }}
                  className="text-primary"
                >
                  READY TO
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-primary"
                >
                  TAKE YOUR
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-foreground"
                >
                  SEAT?
                </motion.div>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-lg mx-auto"
              >
                Buy and sell tickets directly with verified students. No fees, no hassle.
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col gap-4 justify-center items-center"
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
                <LoginButton
                    buttonText="Get Ticket now"
                    icon={<ArrowRight className="w-5 h-5 order-last"/>}
                    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground flex items-center justify-center gap-2 py-6 text-base sm:text-lg font-semibold"
                />
              </motion.div>
              <p className="text-xs text-muted-foreground text-center w-full flex items-center justify-center gap-1">
                <Lock className="w-4 h-4" />
                Secure login through with LinkBlue
              </p>
            </motion.div>
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
          <div className="flex flex-wrap justify-center gap-16 md:gap-48">
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold text-foreground">Support</h3>
              <div className="flex flex-col items-center gap-2">
                <Link href="/contact" className="text-foreground hover:underline">Contact Us</Link>
                <a 
                  href="https://www.buymeacoffee.com/jakerogers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  Buy Us a Coffee
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold text-foreground">Account</h3>
              <div className="flex flex-col items-center gap-2">
                <Link href="/login" className="text-foreground hover:underline">Login</Link>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold text-foreground">Legal</h3>
              <div className="flex flex-col items-center gap-2">
                <Link href="/privacy" className="text-foreground hover:underline">Privacy Policy</Link>
                <Link href="/terms" className="text-foreground hover:underline">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-50/10 pt-8 text-center">
            <p className="text-foreground">&copy; {new Date().getFullYear()} Scholar Seats. All rights reserved.</p>
            <p className="text-xs text-slate-400 mt-4">Built by Jake and Nate</p>
          </div>
        </div>
      </footer>
    </div>
  )
}