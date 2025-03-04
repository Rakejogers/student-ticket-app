"use client"

import { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// This component ensures links navigate properly within the PWA context on iOS
interface PWASafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  className?: string
  children: React.ReactNode
}

const PWASafeLink = forwardRef<HTMLAnchorElement, PWASafeLinkProps>(
  ({ href, className, children, ...props }, ref) => {
    // For absolute URLs (external links), we'll let the browser handle them normally
    const isExternalLink = /^(https?:\/\/|mailto:|tel:)/.test(href)
    
    if (isExternalLink) {
      return (
        <a 
          href={href} 
          ref={ref} 
          className={className} 
          target="_blank" 
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      )
    }
    
    // For internal links, use Next.js Link with PWA-friendly attributes
    return (
      <Link 
        href={href} 
        ref={ref} 
        className={cn(className)}
        target="_self"
        rel="noopener"
        {...props}
      >
        {children}
      </Link>
    )
  }
)

PWASafeLink.displayName = 'PWASafeLink'

export { PWASafeLink } 