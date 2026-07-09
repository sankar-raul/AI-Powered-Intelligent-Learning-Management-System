import { Grid2X2, List, PlusSquare, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import SubjectCard from '../../components/SubjectCard/SubjectCard'
import { useTeacherSubjects } from '../../hooks/useTeacherQueries'
import type { SubjectStatus, ViewMode } from '../../types/teacher.types'

const statuses: Array<'All' | SubjectStatus> = ['All', 'Draft', 'Processing', 'Ready', 'Published', 'Failed']
const pageSize = 4

export default function SubjectsPage() {
  const { data = [], isLoading } = useTeacherSubjects()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | SubjectStatus>('All')
  const [sort, setSort] = useState('updated')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [page, setPage] = useState(1)

  const filteredSubjects = useMemo(() => {
    const normalized = query.toLowerCase()
    return data
      .filter((subject) => `${subject.name} ${subject.department}`.toLowerCase().includes(normalized))
      .filter((subject) => (status === 'All' ? true : subject.status === status))
      .sort((a, b) => {
        if (sort === 'students') return b.studentsEnrolled - a.studentsEnrolled
        if (sort === 'progress') return b.progress - a.progress
        return b.lastUpdated.localeCompare(a.lastUpdated)
      })
  }, [data, query, sort, status])

  const pageCount = Math.max(Math.ceil(filteredSubjects.length / pageSize), 1)
  const paginatedSubjects = filteredSubjects.slice((page - 1) * pageSize, page * pageSize)

  if (isLoading) {
    return <div className="h-96 animate-pulse border border-border bg-panel" />
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Teacher Subjects</p>
          <h1 className="mt-3 font-display text-5xl font-semibold uppercase leading-none tracking-normal">Subject Management</h1>
        </div>
        <Button asChild variant="primary">
          <Link to="/teacher/subjects/create">
            <PlusSquare className="h-4 w-4" />
            Create Subject
          </Link>
        </Button>
      </section>

      <section className="tech-panel grid gap-3 p-4 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
          <Input className="pl-9" placeholder="Search by subject or department" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <select className="mechanical-focus h-11 border border-border bg-background px-3 text-sm text-text-primary" value={status} onChange={(event) => setStatus(event.target.value as 'All' | SubjectStatus)}>
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className="mechanical-focus h-11 border border-border bg-background px-3 text-sm text-text-primary" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="updated">Last Updated</option>
          <option value="students">Students</option>
          <option value="progress">Progress</option>
        </select>
        <div className="flex border border-border">
          <button type="button" className={cn('mechanical-focus h-11 w-11 border-r border-border', viewMode === 'grid' && 'bg-accent text-background')} onClick={() => setViewMode('grid')} aria-label="Grid view">
            <Grid2X2 className="mx-auto h-4 w-4" />
          </button>
          <button type="button" className={cn('mechanical-focus h-11 w-11', viewMode === 'list' && 'bg-accent text-background')} onClick={() => setViewMode('list')} aria-label="List view">
            <List className="mx-auto h-4 w-4" />
          </button>
        </div>
      </section>

      <section className={cn('grid gap-4', viewMode === 'grid' ? 'lg:grid-cols-2' : 'grid-cols-1')}>
        {paginatedSubjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} viewMode={viewMode} />
        ))}
      </section>

      <div className="flex items-center justify-between border border-border bg-panel px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
          Page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Button type="button" size="sm" variant="secondary" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
