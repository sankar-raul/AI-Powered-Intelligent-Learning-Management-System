import { Check, Loader2, RadioTower } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const steps = [
  'Uploading',
  'Extracting Text',
  'Generating Roadmap',
  'Chunking Notes',
  'Generating AI Summary',
  'Generating Quizzes',
  'Generating Flashcards',
  'Uploading to Pinecone',
  'Publishing',
]

export default function ProcessingTimeline() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => (current >= steps.length - 1 ? current : current + 1))
    }, 950)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="grid gap-6">
      <div className="corner-frame tech-panel p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">Realtime subject pipeline</p>
            <h2 className="mt-3 font-display text-4xl font-semibold uppercase tracking-normal">Background Processing</h2>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary">
              The AI worker is extracting learning structure, chunking documents, generating assessments, and preparing semantic retrieval.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-border bg-background px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
            <RadioTower className="h-4 w-4" />
            Live updates
          </div>
        </div>
      </div>

      <div className="tech-panel p-6">
        <div className="relative grid gap-4">
          {steps.map((step, index) => {
            const complete = index < activeStep
            const active = index === activeStep

            return (
              <motion.div
                key={step}
                className={cn(
                  'grid grid-cols-[32px_1fr_auto] items-center gap-4 border border-border bg-background px-4 py-4',
                  active && 'border-accent bg-accent/5',
                  complete && 'border-border-strong',
                )}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className={cn('flex h-8 w-8 items-center justify-center border', active ? 'border-accent text-accent' : 'border-border text-text-muted')}>
                  {complete ? <Check className="h-4 w-4 text-success" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : index + 1}
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-primary">{step}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {complete ? 'Completed' : active ? 'Processing node active' : 'Queued'}
                  </p>
                </div>
                <span className="font-mono text-xs text-text-muted">{complete ? '100%' : active ? 'LIVE' : 'WAIT'}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
