import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string | ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
  const [active, setActive] = useState(false)

  const showTip = () => {
    setActive(true)
  }

  const hideTip = () => {
    setActive(false)
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onFocus={showTip}
      onBlur={hideTip}
    >
      {children}
      {active && (
        <div
          className={cn(
            'absolute z-50 whitespace-nowrap border border-border bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-primary shadow-lg transition-opacity duration-200',
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
