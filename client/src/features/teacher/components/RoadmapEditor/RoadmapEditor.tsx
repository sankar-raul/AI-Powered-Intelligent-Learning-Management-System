import { ChevronDown, GripVertical, Plus, Save, Send, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { RoadmapTopic, RoadmapUnit } from '../../types/teacher.types'

export default function RoadmapEditor({
  initialRoadmap,
  onSave,
}: {
  initialRoadmap: RoadmapUnit[]
  onSave: (roadmap: RoadmapUnit[]) => void
}) {
  const [roadmap, setRoadmap] = useState(initialRoadmap)

  const updateUnit = (unitId: string, patch: Partial<RoadmapUnit>) => {
    setRoadmap((current) => current.map((unit) => (unit.id === unitId ? { ...unit, ...patch } : unit)))
  }

  const addUnit = () => {
    setRoadmap((current) => [
      ...current,
      {
        id: `unit-${Date.now()}`,
        title: 'New Unit',
        description: 'Describe the learning outcome for this unit.',
        estimatedTime: '2h',
        difficulty: 'Foundation',
        topics: [],
      },
    ])
  }

  const deleteUnit = (unitId: string) => setRoadmap((current) => current.filter((unit) => unit.id !== unitId))

  const moveUnit = (unitId: string, direction: -1 | 1) => {
    setRoadmap((current) => {
      const index = current.findIndex((unit) => unit.id === unitId)
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      const [unit] = next.splice(index, 1)
      next.splice(target, 0, unit)
      return next
    })
  }

  const updateTopic = (unitId: string, topicId: string, patch: Partial<RoadmapTopic>) => {
    setRoadmap((current) =>
      current.map((unit) =>
        unit.id === unitId
          ? { ...unit, topics: unit.topics.map((topic) => (topic.id === topicId ? { ...topic, ...patch } : topic)) }
          : unit,
      ),
    )
  }

  const addTopic = (unitId: string) => {
    setRoadmap((current) =>
      current.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              topics: [
                ...unit.topics,
                {
                  id: `topic-${Date.now()}`,
                  title: 'New Topic',
                  difficulty: 'Foundation',
                  estimatedTime: '45m',
                  description: 'Add the AI-assisted topic brief.',
                },
              ],
            }
          : unit,
      ),
    )
  }

  const deleteTopic = (unitId: string, topicId: string) => {
    setRoadmap((current) =>
      current.map((unit) =>
        unit.id === unitId ? { ...unit, topics: unit.topics.filter((topic) => topic.id !== topicId) } : unit,
      ),
    )
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">AI generated roadmap</p>
          <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-normal">Review and Publish</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={addUnit}>
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
          <Button type="button" variant="secondary" onClick={() => onSave(roadmap)}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button type="button" variant="primary">
            <Send className="h-4 w-4" />
            Publish Roadmap
          </Button>
        </div>
      </div>

      {roadmap.map((unit, index) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          index={index}
          canMoveUp={index > 0}
          canMoveDown={index < roadmap.length - 1}
          onMove={(direction) => moveUnit(unit.id, direction)}
          onUpdate={(patch) => updateUnit(unit.id, patch)}
          onDelete={() => deleteUnit(unit.id)}
          onAddTopic={() => addTopic(unit.id)}
          onUpdateTopic={(topicId, patch) => updateTopic(unit.id, topicId, patch)}
          onDeleteTopic={(topicId) => deleteTopic(unit.id, topicId)}
        />
      ))}
    </section>
  )
}

function UnitCard({
  unit,
  index,
  canMoveUp,
  canMoveDown,
  onMove,
  onUpdate,
  onDelete,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
}: {
  unit: RoadmapUnit
  index: number
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: -1 | 1) => void
  onUpdate: (patch: Partial<RoadmapUnit>) => void
  onDelete: () => void
  onAddTopic: () => void
  onUpdateTopic: (topicId: string, patch: Partial<RoadmapTopic>) => void
  onDeleteTopic: (topicId: string) => void
}) {
  const [open, setOpen] = useState(index === 0)

  return (
    <motion.article layout className="tech-panel">
      <button
        type="button"
        className="mechanical-focus flex w-full items-center justify-between gap-4 border-b border-border px-5 py-4 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <div className="flex items-center gap-4">
          <GripVertical className="h-5 w-5 text-text-muted" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">Unit {String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 font-display text-xl font-semibold uppercase tracking-normal">{unit.title}</h3>
          </div>
        </div>
        <ChevronDown className={cn('h-5 w-5 transition', open && 'rotate-180 text-accent')} />
      </button>

      {open ? (
        <div className="grid gap-4 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={unit.title} onChange={(event) => onUpdate({ title: event.target.value })} aria-label="Unit title" />
            <Input value={unit.estimatedTime} onChange={(event) => onUpdate({ estimatedTime: event.target.value })} aria-label="Estimated study time" />
          </div>
          <Textarea value={unit.description} onChange={(event) => onUpdate({ description: event.target.value })} aria-label="Unit description" />

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" disabled={!canMoveUp} onClick={() => onMove(-1)}>
              Move Up
            </Button>
            <Button type="button" size="sm" variant="secondary" disabled={!canMoveDown} onClick={() => onMove(1)}>
              Move Down
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={onAddTopic}>
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
            <Button type="button" size="sm" variant="danger" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Delete Unit
            </Button>
          </div>

          <div className="grid gap-3">
            {unit.topics.map((topic) => (
              <div key={topic.id} className="border border-border bg-background p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_140px_120px_auto]">
                  <Input value={topic.title} onChange={(event) => onUpdateTopic(topic.id, { title: event.target.value })} aria-label="Topic title" />
                  <Input value={topic.estimatedTime} onChange={(event) => onUpdateTopic(topic.id, { estimatedTime: event.target.value })} aria-label="Topic time" />
                  <Input value={topic.difficulty} onChange={(event) => onUpdateTopic(topic.id, { difficulty: event.target.value as RoadmapTopic['difficulty'] })} aria-label="Topic difficulty" />
                  <Button type="button" size="icon" variant="danger" onClick={() => onDeleteTopic(topic.id)} aria-label="Delete topic">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea className="mt-3 min-h-20" value={topic.description} onChange={(event) => onUpdateTopic(topic.id, { description: event.target.value })} aria-label="Topic description" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </motion.article>
  )
}
