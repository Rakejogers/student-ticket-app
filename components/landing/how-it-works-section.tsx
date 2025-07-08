'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, Lock, GraduationCap, LucideIcon } from 'lucide-react'
import OptimizedImage from '@/components/optimized-image'

interface HowItWorksStep {
  title: string
  description: string
  image: string
  icon: LucideIcon
  bgColor: string
}

const howItWorks: HowItWorksStep[] = [
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

interface HowItWorksStepProps {
  step: HowItWorksStep
  index: number
}

function HowItWorksStepComponent({ step, index }: HowItWorksStepProps) {
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
              <OptimizedImage 
                src={step.image} 
                alt={step.title} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      id="how-it-works" 
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these three easy steps to buy or sell tickets.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative z-10">
          {howItWorks.map((step, index) => (
            <HowItWorksStepComponent key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}