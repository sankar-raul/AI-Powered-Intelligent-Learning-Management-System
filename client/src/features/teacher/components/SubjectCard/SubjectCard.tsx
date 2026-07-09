import { BarChart3, Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import StatusBadge from '../StatusBadge/StatusBadge'
import type { TeacherSubject, ViewMode } from '../../types/teacher.types'

export default function SubjectCard({ subject, viewMode }: { subject: TeacherSubject; viewMode: ViewMode }) {
  const progressClass = getProgressClass(subject.progress)

  return (
    <article
      className={cn(
        'tech-panel group p-5 transition hover:-translate-y-1 hover:border-border-strong',
        viewMode === 'list' && 'grid gap-5 md:grid-cols-[1.4fr_0.8fr_0.7fr_auto]',
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={subject.status} />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">{subject.semester}</span>
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold uppercase tracking-normal text-text-primary">{subject.name}</h3>
        <p className="mt-2 text-sm text-text-secondary">{subject.description}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
        <Meta label="Department" value={subject.department} />
        <Meta label="Students" value={subject.studentsEnrolled.toString()} />
        <Meta label="Updated" value={subject.lastUpdated} />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
          <span>Progress</span>
          <span>{subject.progress}%</span>
        </div>
        <div className="mt-2 h-2 border border-border bg-background">
          <div className={cn('h-full bg-accent transition-all', progressClass)} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="primary">
          <Link to={`/teacher/subjects/${subject.id}`}>
            <Eye className="h-4 w-4" />
            View
          </Link>
        </Button>
        <Button size="icon" variant="secondary" aria-label={`Edit ${subject.name}`}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" aria-label={`Open analytics for ${subject.name}`}>
          <BarChart3 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="danger" aria-label={`Delete ${subject.name}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  )
}

function getProgressClass(progress: number) {
  if (progress >= 100) return 'w-full'
  if (progress >= 90) return 'w-11/12'
  if (progress >= 80) return 'w-10/12'
  if (progress >= 70) return 'w-9/12'
  if (progress >= 60) return 'w-8/12'
  if (progress >= 50) return 'w-7/12'
  if (progress >= 40) return 'w-5/12'
  if (progress >= 30) return 'w-4/12'
  if (progress >= 20) return 'w-3/12'
  if (progress >= 10) return 'w-2/12'
  return 'w-1/12'
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">{label}</p>
      <p className="mt-1 truncate text-sm text-text-primary">{value}</p>
    </div>
  )
}
