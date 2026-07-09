import { createContext, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, AlertTriangle, Info, ShieldAlert } from 'lucide-react'

type ToastType = 'info' | 'success' | 'warning' | 'danger'

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = ({ title, description, type, duration = 4000 }: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((current) => [...current, { id, title, description, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = {
              success: CheckCircle2,
              info: Info,
              warning: AlertTriangle,
              danger: ShieldAlert,
            }[t.type]

            const typeColor = {
              success: 'border-success/30 bg-panel text-success',
              info: 'border-accent/30 bg-panel text-accent',
              warning: 'border-warning/30 bg-panel text-warning',
              danger: 'border-danger/30 bg-panel text-danger',
            }[t.type]

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex w-full items-start gap-3 border p-4 shadow-xl corner-frame ${typeColor}`}
              >
                <span className="mt-0.5"><Icon className="h-4 w-4" /></span>
                <div className="grid flex-1 gap-1">
                  <span className="font-display text-sm font-semibold uppercase tracking-wide text-text-primary">
                    {t.title}
                  </span>
                  {t.description && (
                    <span className="text-xs text-text-secondary leading-relaxed">
                      {t.description}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-text-muted hover:text-text-primary transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
