import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import type { StudentProgress } from '../../types/teacher.types'

export default function StudentTable({ students }: { students: StudentProgress[] }) {
  const [query, setQuery] = useState('')
  const filteredStudents = useMemo(
    () =>
      students
        .filter((student) => `${student.name} ${student.email}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => b.progress - a.progress),
    [query, students],
  )

  return (
    <section className="tech-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Enrollment matrix</p>
          <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-normal">Students</h2>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
          <Input className="pl-9" placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-text-muted">
            <tr>
              <th className="border-b border-border px-4 py-3 font-medium">Student</th>
              <th className="border-b border-border px-4 py-3 font-medium">Progress</th>
              <th className="border-b border-border px-4 py-3 font-medium">Quiz Score</th>
              <th className="border-b border-border px-4 py-3 font-medium">Completion</th>
              <th className="border-b border-border px-4 py-3 font-medium">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="transition hover:bg-surface">
                <td className="border-b border-border px-4 py-4">
                  <p className="font-medium text-text-primary">{student.name}</p>
                  <p className="text-xs text-text-muted">{student.email}</p>
                </td>
                <td className="border-b border-border px-4 py-4 font-mono text-accent">{student.progress}%</td>
                <td className="border-b border-border px-4 py-4 font-mono">{student.quizScore}%</td>
                <td className="border-b border-border px-4 py-4 font-mono">{student.completion}%</td>
                <td className="border-b border-border px-4 py-4 text-text-secondary">{student.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
