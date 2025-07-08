'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  priority?: boolean
  quality?: number
  blur?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  quality = 85,
  blur = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <Image
        src={src}
        alt={alt}
        className={cn(
          'transition-all duration-300',
          isLoading && blur ? 'scale-105 blur-sm' : 'scale-100 blur-0',
          error ? 'opacity-50' : 'opacity-100',
          className
        )}
        quality={quality}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
      
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-inherit" />
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center rounded-inherit">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  )
}