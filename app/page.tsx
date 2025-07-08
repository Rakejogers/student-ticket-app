'use client'

import { lazy, Suspense } from 'react'
import HeroSection from '@/components/landing/hero-section'

// Lazy load the heavy sections that are below the fold
const FeaturesSection = lazy(() => import('@/components/landing/features-section'))
const HowItWorksSection = lazy(() => import('@/components/landing/how-it-works-section'))
const FAQSection = lazy(() => import('@/components/landing/faq-section'))

// Loading components for suspense fallback
function SectionLoader() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section - Load immediately */}
        <HeroSection />

        {/* Features Section - Lazy loaded */}
        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>

        {/* How It Works Section - Lazy loaded */}
        <Suspense fallback={<SectionLoader />}>
          <HowItWorksSection />
        </Suspense>

        {/* FAQ Section - Lazy loaded */}
        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>
      </main>
    </div>
  )
}