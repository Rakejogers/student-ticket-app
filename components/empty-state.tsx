"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Ticket } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon = <Ticket className="h-12 w-12 text-muted-foreground" />,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50", className)}>
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {icon}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        {action && (
          <Button onClick={action.onClick} className="relative">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
} 