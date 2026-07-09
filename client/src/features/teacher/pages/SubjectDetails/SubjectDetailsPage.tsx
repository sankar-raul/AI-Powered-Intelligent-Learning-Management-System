import { Archive, BrainCircuit, RefreshCw, Settings, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FieldLabel, Input, Textarea } from '@/components/ui/input'
import { ActivityLineChart, MetricBarChart } from '../../components/Charts/TeacherCharts'
import DocumentCard from '../../components/DocumentCard/DocumentCard'
import RoadmapEditor from '../../components/RoadmapEditor/RoadmapEditor'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import StudentTable from '../../components/StudentTable/StudentTable'
import { completionData, difficultTopics, quizScoreData, studentActivity } from '../../api/teacher.fixtures'
import { useSaveRoadmap, useSubjectWorkspace, useTeacherSubject } from '../../hooks/useTeacherQueries'

const tabs = ['Overview', 'Roadmap', 'Documents', 'Students', 'Analytics', 'Settings'] as const
type Tab = (typeof tabs)[number]

export default function SubjectDetailsPage() {
  const { subjectId } = useParams()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const { data: subject, isLoading: subjectLoading } = useTeacherSubject(subjectId)
  const { data: workspace, isLoading: workspaceLoading } = useSubjectWorkspace(subjectId)
  const saveRoadmap = useSaveRoadmap(subjectId)

  if (subjectLoading || workspaceLoading || !subject || !workspace) {
    return <div className="h-96 animate-pulse border border-border bg-panel" />
  }

  return (
    <div className="grid gap-6">
      <section className="corner-frame border border-border bg-panel p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={subject.status} />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">{subject.department}</span>
            </div>
            <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-none tracking-normal">{subject.name}</h1>
            <p className="mt-4 max-w-3xl text-sm text-text-secondary">{subject.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Kpi label="Students" value={subject.studentsEnrolled.toString()} />
            <Kpi label="Progress" value={`${subject.progress}%`} />
            <Kpi label="Updated" value={subject.lastUpdated} />
          </div>
        </div>
      </section>

      <nav className="flex overflow-x-auto border border-border bg-panel">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'min-w-max border-r border-border bg-accent px-4 py-3 text-sm font-medium uppercase tracking-[0.08em] text-background' : 'min-w-max border-r border-border px-4 py-3 text-sm uppercase tracking-[0.08em] text-text-secondary transition hover:text-accent'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'Overview' ? (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="tech-panel p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">AI subject state</p>
            <div className="mt-5 grid gap-3">
              <Kpi label="Roadmap Units" value={workspace.roadmap.length.toString()} />
              <Kpi label="Documents Indexed" value={workspace.documents.length.toString()} />
              <Kpi label="Students Enrolled" value={workspace.students.length.toString()} />
            </div>
          </div>
          <RoadmapEditor initialRoadmap={workspace.roadmap.slice(0, 1)} onSave={(roadmap) => saveRoadmap.mutate(roadmap)} />
        </section>
      ) : null}

      {activeTab === 'Roadmap' ? (
        <RoadmapEditor initialRoadmap={workspace.roadmap} onSave={(roadmap) => saveRoadmap.mutate(roadmap)} />
      ) : null}

      {activeTab === 'Documents' ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workspace.documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </section>
      ) : null}

      {activeTab === 'Students' ? <StudentTable students={workspace.students} /> : null}

      {activeTab === 'Analytics' ? (
        <section className="grid gap-5 lg:grid-cols-2">
          <MetricBarChart title="Subject Completion" data={completionData} />
          <MetricBarChart title="Average Quiz Score" data={quizScoreData} />
          <MetricBarChart title="Most Difficult Topics" data={difficultTopics} />
          <ActivityLineChart data={studentActivity} />
        </section>
      ) : null}

      {activeTab === 'Settings' ? <SubjectSettings subjectName={subject.name} /> : null}
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold uppercase tracking-normal text-text-primary">{value}</p>
    </div>
  )
}

function SubjectSettings({ subjectName }: { subjectName: string }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="tech-panel p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Edit Subject</p>
        <div className="mt-5 grid gap-4">
          <FieldLabel label="Subject Name">
            <Input defaultValue={subjectName} />
          </FieldLabel>
          <FieldLabel label="Description">
            <Textarea defaultValue="Tune the subject identity, regenerate AI artifacts, or archive this learning system." />
          </FieldLabel>
          <Button type="button" variant="primary">
            <Settings className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
      <div className="tech-panel p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">AI Operations</p>
        <div className="mt-5 grid gap-2">
          <Action icon={<RefreshCw className="h-4 w-4" />} label="Regenerate Roadmap" />
          <Action icon={<RefreshCw className="h-4 w-4" />} label="Regenerate Quiz" />
          <Action icon={<BrainCircuit className="h-4 w-4" />} label="Regenerate Summary" />
          <Action icon={<BrainCircuit className="h-4 w-4" />} label="Regenerate Flashcards" />
          <Action icon={<Archive className="h-4 w-4" />} label="Archive Subject" />
          <Button type="button" variant="danger">
            <Trash2 className="h-4 w-4" />
            Delete Subject
          </Button>
        </div>
      </div>
    </section>
  )
}

function Action({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Button type="button" variant="secondary">
      {icon}
      {label}
    </Button>
  )
}
