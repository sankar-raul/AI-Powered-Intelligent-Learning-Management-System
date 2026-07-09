import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'mechanical-focus inline-flex items-center justify-center gap-2 border text-sm font-medium uppercase tracking-[0.08em] transition duration-200 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'border-accent bg-accent px-4 py-2.5 text-background hover:bg-background hover:text-accent',
        secondary: 'border-border-strong bg-panel px-4 py-2.5 text-text-primary hover:border-accent hover:text-accent',
        ghost: 'border-transparent bg-transparent px-3 py-2 text-text-secondary hover:text-accent',
        danger: 'border-danger/50 bg-danger/10 px-4 py-2.5 text-danger hover:border-danger',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
