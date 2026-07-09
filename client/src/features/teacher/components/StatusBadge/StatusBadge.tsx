import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SubjectStatus } from '../../types/teacher.types'

const statusClass: Record<SubjectStatus, string> = {
  Draft: 'border-text-muted/40 bg-panel text-text-secondary',
  Processing: 'border-accent/50 bg-accent-muted text-accent',
  Ready: 'border-accent/70 bg-accent/10 text-accent',
  Published: 'border-success/50 bg-success/10 text-success',
  Failed: 'border-danger/50 bg-danger/10 text-danger',
}

export default function StatusBadge({ status }: { status: SubjectStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em]',
        statusClass[status],
      )}
    >
      {status === 'Processing' ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="h-1.5 w-1.5 bg-current" />}
      {status}
    </span>
  )
}
