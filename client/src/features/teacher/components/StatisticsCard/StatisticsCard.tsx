import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import type { DashboardMetric } from '../../types/teacher.types'

export default function StatisticsCard({ metric }: { metric: DashboardMetric }) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 90, damping: 22 })
  const display = useTransform(springValue, (value) => Math.round(value).toLocaleString())

  useEffect(() => {
    motionValue.set(metric.value)
  }, [metric.value, motionValue])

  return (
    <motion.article
      className="corner-frame tech-panel p-5 transition hover:-translate-y-1 hover:border-border-strong"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">{metric.label}</p>
          <motion.p className="mt-5 font-display text-5xl font-semibold leading-none tracking-normal text-text-primary">
            {display}
          </motion.p>
        </div>
        <div className="border border-border bg-background p-2 text-accent">
          <metric.icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 border-t border-border pt-3 text-sm text-text-secondary">{metric.delta}</p>
    </motion.article>
  )
}
