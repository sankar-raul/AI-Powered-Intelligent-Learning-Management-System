import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'border border-border bg-panel p-5 transition duration-200 hover:border-accent-muted',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 border-b border-border pb-4 mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 className={cn('font-display text-xl font-semibold uppercase tracking-wide text-text-primary', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <p className={cn('text-xs text-text-secondary', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('text-sm text-text-secondary leading-relaxed', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 border-t border-border pt-4 mt-4', className)} {...props}>
      {children}
    </div>
  )
}
