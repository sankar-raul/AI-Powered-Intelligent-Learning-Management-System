import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { Search, Compass, BookOpen, User, ArrowRight } from 'lucide-react'

interface ExploreSubject {
  id: string
  name: string
  description: string
  department: string
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced'
  studentsEnrolled: number
  unitsCount: number
  enrolled?: boolean
}

// Initial mock data matching schema types
const INITIAL_EXPLORE_SUBJECTS: ExploreSubject[] = [
  {
    id: 'sub-machine-learning',
    name: 'Machine Learning Fundamentals',
    description: 'Explore neural network topologies, gradient descent mechanics, and supervised optimization algorithms.',
    department: 'Computer Science',
    difficulty: 'Intermediate',
    studentsEnrolled: 148,
    unitsCount: 5,
    enrolled: true
  },
  {
    id: 'sub-operating-systems',
    name: 'Advanced Operating Systems',
    description: 'Learn virtual memory architecture, page replacement logic, cache mapping systems, and CPU scheduling.',
    department: 'Computer Science',
    difficulty: 'Advanced',
    studentsEnrolled: 84,
    unitsCount: 4,
    enrolled: true
  },
  {
    id: 'sub-database-systems',
    name: 'Distributed Database Systems',
    description: 'Study 2-Phase Locking (2PL), consensus protocols, replication logs, index sharding, and transaction processing.',
    department: 'Information Technology',
    difficulty: 'Advanced',
    studentsEnrolled: 210,
    unitsCount: 6,
    enrolled: false
  },
  {
    id: 'sub-discrete-math',
    name: 'Discrete Mathematics',
    description: 'Understand predicate logic, graph networking algorithms, combinatorics, set theory, and induction proof designs.',
    department: 'Mathematics',
    difficulty: 'Foundation',
    studentsEnrolled: 340,
    unitsCount: 4,
    enrolled: false
  }
]

export default function ExploreSubjects() {
  const { toast } = useToast()
  const [subjects, setSubjects] = useState<ExploreSubject[]>(INITIAL_EXPLORE_SUBJECTS)
  const [search, setSearch] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL')

  const handleEnroll = (subjectId: string) => {
    setSubjects((current) =>
      current.map((sub) => {
        if (sub.id === subjectId) {
          toast({
            title: 'Subject Enrolled',
            description: `Successfully established learning node for ${sub.name}.`,
            type: 'success'
          })
          return { ...sub, enrolled: true, studentsEnrolled: sub.studentsEnrolled + 1 }
        }
        return sub
      })
    )
  }

  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase()) || sub.description.toLowerCase().includes(search.toLowerCase())
    const matchesDiff = filterDifficulty === 'ALL' || sub.difficulty.toUpperCase() === filterDifficulty
    return matchesSearch && matchesDiff
  })

  return (
    <div className="grid gap-8">
      {/* Title Header Banner */}
      <section className="corner-frame border border-border bg-panel p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Curriculum Explore</p>
        <h1 className="mt-3 font-display text-4xl font-semibold uppercase leading-none tracking-normal md:text-6xl">
          Ingested subjects registry
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-text-secondary">
          Browse academic courses compiled by department teachers. Enroll to spin up your personalized AI tutor, study logs, roadmaps, and topic quizzes.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <section className="grid gap-4 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search indexing keywords (e.g. paging, gradient descent, locking)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mechanical-focus h-11 w-full border border-border bg-panel pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted transition focus:border-accent"
          />
        </div>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="mechanical-focus h-11 border border-border bg-panel px-3 font-mono text-xs uppercase tracking-wider text-text-primary transition focus:border-accent"
        >
          <option value="ALL">All Levels</option>
          <option value="FOUNDATION">Foundation</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </section>

      {/* Catalog Grid */}
      <section className="grid gap-6 md:grid-cols-2">
        {filteredSubjects.map((sub) => (
          <Card key={sub.id} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-0.5">
                  {sub.difficulty}
                </span>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                  {sub.department}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary">
                {sub.name}
              </h3>
              <p className="mt-3 text-xs text-text-secondary leading-relaxed">
                {sub.description}
              </p>

              <div className="mt-6 flex gap-4 text-xs font-mono text-text-muted">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {sub.studentsEnrolled} Active</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {sub.unitsCount} AI Units</span>
              </div>
            </div>

            <div className="mt-8">
              {sub.enrolled ? (
                <div className="flex gap-2">
                  <Button disabled className="flex-1 text-center bg-border/20 text-text-muted">
                    ALREADY ENROLLED
                  </Button>
                  <Button asChild variant="primary" className="px-4">
                    <a href={`/student/subjects/${sub.id}`}>
                      STUDY <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
                <Button onClick={() => handleEnroll(sub.id)} variant="secondary" className="w-full justify-between">
                  ENROLL IN SUBJECT
                  <Compass className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}
