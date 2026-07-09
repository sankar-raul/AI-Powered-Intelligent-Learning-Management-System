import { ArrowRight, BarChart3, PlusSquare, UploadCloud } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ProcessingTimeline from '../../components/ProcessingTimeline/ProcessingTimeline'
import StatisticsCard from '../../components/StatisticsCard/StatisticsCard'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import { useTeacherDashboard } from '../../hooks/useTeacherQueries'

export default function DashboardPage() {
  const { data, isLoading } = useTeacherDashboard()

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  return (
    <div className="grid gap-8">
      <section className="corner-frame border border-border bg-panel p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Teacher Dashboard</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <h1 className="font-display text-5xl font-semibold uppercase leading-none tracking-normal md:text-7xl">
              Curriculum intelligence console
            </h1>
            <p className="mt-5 max-w-3xl text-base text-text-secondary">
              Create subjects, upload source material, review AI-generated learning roadmaps, publish, and monitor student outcomes from one engineered workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button asChild variant="primary">
              <Link to="/teacher/subjects/create">
                <PlusSquare className="h-4 w-4" />
                Create Subject
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/teacher/analytics">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <StatisticsCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Recent Uploads" icon={<UploadCloud className="h-4 w-4" />}>
          {data.recentUploads.map((upload) => (
            <div key={upload.id} className="grid grid-cols-[1fr_auto] gap-3 border-b border-border py-4 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-text-primary">{upload.fileName}</p>
                <p className="mt-1 text-xs text-text-secondary">{upload.subject} / {upload.type}</p>
              </div>
              <div className="text-right font-mono text-xs text-text-muted">
                <p>{upload.size}</p>
                <p className="mt-1">{upload.uploadedAt}</p>
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Recent AI Jobs" icon={<ArrowRight className="h-4 w-4" />}>
          {data.recentAiJobs.map((job) => (
            <div key={job.id} className="grid gap-3 border-b border-border py-4 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{job.subject}</p>
                  <p className="mt-1 text-xs text-text-secondary">{job.task}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>
              <div className="h-2 border border-border bg-background">
                <div className={job.progress > 90 ? 'h-full w-full bg-accent' : 'h-full w-8/12 bg-accent'} />
              </div>
            </div>
          ))}
        </Panel>
      </section>

      <ProcessingTimeline />
    </div>
  )
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="tech-panel p-5">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <span className="text-accent">{icon}</span>
        <h2 className="font-display text-2xl font-semibold uppercase tracking-normal">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-64 animate-pulse border border-border bg-panel" />
      <div className="grid gap-4 md:grid-cols-4">
        <div className="h-40 animate-pulse border border-border bg-panel" />
        <div className="h-40 animate-pulse border border-border bg-panel" />
        <div className="h-40 animate-pulse border border-border bg-panel" />
        <div className="h-40 animate-pulse border border-border bg-panel" />
      </div>
    </div>
  )
}
