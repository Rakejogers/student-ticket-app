'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Users, Lock, ArrowUpRight, GraduationCap } from 'lucide-react'
import pb from '@/app/pocketbase'
import { useRouter } from 'next/navigation'
import LoginButton from '@/components/loginButton'
import OptimizedImage from '@/components/optimized-image'

const heroImages = [
  { src: "/images/uk_football.jpg", alt: "UK Football" },
  { src: "/images/ky-basketball.jpg", alt: "Kentucky Basketball" },
  { src: "/images/rupp-arena.jpg", alt: "Rupp Arena" },
  { src: "/images/kroger_field.webp", alt: "Kroger Field" }
]

export default function HeroSection() {
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
        setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isSwiping]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSwiping(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
      } else {
        setActiveImageIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
      }
    }
    
    setIsSwiping(false);
  };

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <section className="relative min-h-[700px] sm:min-h-[850px] flex flex-col items-center justify-center overflow-hidden bg-background px-0 sm:px-10 pt-0 sm:pt-16 md:pt-20">
      {/* Mobile Immersive Hero - Only visible on mobile */}
      <div className="md:hidden w-full relative h-[65vh] overflow-hidden"
           onTouchStart={handleTouchStart}
           onTouchEnd={handleTouchEnd}>
        
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
        {heroImages.map((image, index) => (
          <motion.div 
            key={index}
            className="absolute inset-0 w-full h-full"
            animate={{ 
              opacity: activeImageIndex === index ? 1 : 0,
              scale: activeImageIndex === index ? 1.05 : 1
            }}
            transition={{ duration: 0.8 }}
          >
            <OptimizedImage 
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
          </motion.div>
        ))}

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center">
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
              
              {/* CTA button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
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
        
        {/* Image indicators */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-3 z-20">
          {heroImages.map((_, index) => (
            <motion.div 
              key={index}
              className={`w-2 h-${activeImageIndex === index ? '12' : '2'} rounded-full cursor-pointer transition-all duration-300 ${activeImageIndex === index ? 'bg-primary' : 'bg-primary/30'}`}
              onClick={() => handleImageClick(index)}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
      
      {/* Desktop Hero Images - Only visible on desktop */}
      <div className="hidden lg:block">
        {heroImages.map((image, index) => {
          const positions = [
            { right: '-44px', top: '50px', rotate: 3, width: 479, height: 304 },
            { left: '-91px', top: '120px', rotate: -6, width: 491, height: 325 },
            { right: '-110px', top: '380px', rotate: 2, width: 472, height: 291 },
            { left: '-151px', top: '470px', rotate: -3, width: 450, height: 280 }
          ];
          
          const pos = positions[index];
          
          return (
            <motion.div
              key={index}
              style={{ 
                ...pos,
                willChange: 'transform, opacity',
                width: `${pos.width}px`,
                height: `${pos.height}px`
              }}
              className={`absolute z-[${index + 1}] rounded-3xl hover:shadow-xl hover:z-10 group border-2 border-border`}
              animate={activeImageIndex === index ? {
                scale: 1.05,
                rotate: pos.rotate,
                zIndex: index + 1,
              } : {
                scale: 1,
                rotate: pos.rotate,
                zIndex: index + 1,
              }}
              transition={{ duration: 1 }}
            >
              <OptimizedImage 
                src={image.src}
                alt={image.alt}
                fill
                className={`object-cover rounded-3xl transition-all duration-500 ${activeImageIndex === index ? 'opacity-100' : 'opacity-50'}`}
                priority={index === 0}
                quality={75}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}