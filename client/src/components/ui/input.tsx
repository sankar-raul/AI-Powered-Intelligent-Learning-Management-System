import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'mechanical-focus h-11 w-full border border-border bg-background px-3 text-sm text-text-primary placeholder:text-text-muted transition focus:border-accent',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'mechanical-focus min-h-28 w-full resize-y border border-border bg-background px-3 py-3 text-sm text-text-primary placeholder:text-text-muted transition focus:border-accent',
        className,
      )}
      {...props}
    />
  )
}

export function FieldLabel({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-text-secondary">{label}</span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  )
}
