import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  CheckCircle,
  Play,
  Award
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Topic {
  id: string
  title: string
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  completed: boolean
  quizStatus: 'NotStarted' | 'Passed' | 'Failed'
  summary: string
}

interface Unit {
  id: string
  title: string
  description: string
  estimatedTime: string
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced'
  topics: Topic[]
}

const MOCK_ROADMAPS: Record<string, { subjectName: string; units: Unit[] }> = {
  'sub-machine-learning': {
    subjectName: 'Machine Learning Fundamentals',
    units: [
      {
        id: 'unit-1',
        title: 'Unit 1: Linear Optimization Foundations',
        description: 'Core concepts of multivariate cost functions and gradient step calculations.',
        estimatedTime: '3h 30m',
        difficulty: 'Foundation',
        topics: [
          {
            id: 'topic-linear-regression',
            title: '1.1 Linear Regression Models',
            difficulty: 'Foundation',
            estimatedTime: '45m',
            completed: true,
            quizStatus: 'Passed',
            summary: 'Fits a linear relationship between input vector features and scalar target response variables.'
          },
          {
            id: 'topic-gradient-descent',
            title: '1.2 Gradient Descent Optimization',
            difficulty: 'Intermediate',
            estimatedTime: '60m',
            completed: true,
            quizStatus: 'Passed',
            summary: 'Updates weight vectors iteratively in the direction of steepest cost minimization using derivative gradients.'
          }
        ]
      },
      {
        id: 'unit-2',
        title: 'Unit 2: Supervised Classification Networks',
        description: 'Non-linear boundaries, activation functions, and backpropagation models.',
        estimatedTime: '5h 15m',
        difficulty: 'Intermediate',
        topics: [
          {
            id: 'topic-logistic-regression',
            title: '2.1 Logistic Regression & Softmax',
            difficulty: 'Intermediate',
            estimatedTime: '50m',
            completed: true,
            quizStatus: 'Passed',
            summary: 'Converts real valued logits into probabilities using the sigmoid sigmoid or softmax functions.'
          },
          {
            id: 'topic-backpropagation',
            title: '2.2 Neural Network Backpropagation',
            difficulty: 'Advanced',
            estimatedTime: '80m',
            completed: false,
            quizStatus: 'NotStarted',
            summary: 'Propagates prediction error gradients backwards using chain rule differentiation to adjust bias weight nodes.'
          }
        ]
      },
      {
        id: 'unit-3',
        title: 'Unit 3: Validation, Generalization, and Regularization',
        description: 'Preventing overfitting using weight penalties, dropouts, and validation sets.',
        estimatedTime: '4h 00m',
        difficulty: 'Intermediate',
        topics: [
          {
            id: 'topic-overfitting',
            title: '3.1 Overfitting & Underfitting Vectors',
            difficulty: 'Foundation',
            estimatedTime: '40m',
            completed: false,
            quizStatus: 'NotStarted',
            summary: 'High bias versus high variance tradeoffs in general statistical learning estimators.'
          },
          {
            id: 'topic-l1-l2-regularization',
            title: '3.2 Ridge and Lasso Penalties',
            difficulty: 'Advanced',
            estimatedTime: '55m',
            completed: false,
            quizStatus: 'NotStarted',
            summary: 'Constraining weight magnitudes using L1 absolute value or L2 squared Euclidean norm thresholds.'
          }
        ]
      }
    ]
  },
  'sub-operating-systems': {
    subjectName: 'Advanced Operating Systems',
    units: [
      {
        id: 'unit-os-1',
        title: 'Unit 1: Memory Virtualization Models',
        description: 'How hardware mapping and kernel registers establish discrete sandbox page offsets.',
        estimatedTime: '4h 20m',
        difficulty: 'Advanced',
        topics: [
          {
            id: 'topic-virtual-memory',
            title: '1.1 Address Space Segments',
            difficulty: 'Intermediate',
            estimatedTime: '45m',
            completed: true,
            quizStatus: 'Passed',
            summary: 'Maps virtual space program stacks to fragmented blocks in physical RAM chips using registers.'
          },
          {
            id: 'topic-paging',
            title: '1.2 Translation Lookaside Buffer',
            difficulty: 'Advanced',
            estimatedTime: '70m',
            completed: true,
            quizStatus: 'Passed',
            summary: 'Hardware translation cache speeds up mapping processes by reducing page table read requirements.'
          }
        ]
      },
      {
        id: 'unit-os-2',
        title: 'Unit 2: Threading & Scheduling algorithms',
        description: 'Multi-core resource multiplexing, context swaps, and lock protocols.',
        estimatedTime: '6h 10m',
        difficulty: 'Advanced',
        topics: [
          {
            id: 'topic-threads',
            title: '2.1 Process vs Thread Contexts',
            difficulty: 'Foundation',
            estimatedTime: '30m',
            completed: false,
            quizStatus: 'NotStarted',
            summary: 'Threads share general memory address contexts, processes run inside secure isolated memory boundaries.'
          },
          {
            id: 'topic-mutex-semaphore',
            title: '2.2 Synchronization Semaphores',
            difficulty: 'Advanced',
            estimatedTime: '90m',
            completed: false,
            quizStatus: 'NotStarted',
            summary: 'Atomic test-and-set loops ensure isolated access blocks avoiding race conditions on shared registers.'
          }
        ]
      }
    ]
  }
}

export default function StudentSubjectDetails() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const roadmapData = MOCK_ROADMAPS[subjectId || 'sub-machine-learning'] || MOCK_ROADMAPS['sub-machine-learning']
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'unit-1': true,
    'unit-os-1': true,
  })

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((current) => ({
      ...current,
      [unitId]: !current[unitId],
    }))
  }

  // Calculate completion percentage
  const totalTopics = roadmapData.units.reduce((acc, unit) => acc + unit.topics.length, 0)
  const completedTopicsCount = roadmapData.units.reduce(
    (acc, unit) => acc + unit.topics.filter((t) => t.completed).length,
    0
  )
  const completionPercentage = Math.round((completedTopicsCount / totalTopics) * 100)

  return (
    <div className="grid gap-8">
      {/* Navigation & Header */}
      <section className="flex items-center gap-3">
        <Link to="/student/dashboard" className="border border-border bg-panel p-2.5 hover:border-accent hover:text-accent transition">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="font-mono text-xs uppercase tracking-widest text-text-muted">
          Subject Details / Roadmap
        </div>
      </section>

      {/* Hero Header */}
      <section className="corner-frame border border-border bg-panel p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Interactive Timeline</span>
          <span className="font-mono text-xs text-text-secondary uppercase">PIPELINE COMPILED</span>
        </div>
        <h1 className="font-display text-3xl font-semibold uppercase leading-none tracking-normal md:text-5xl">
          {roadmapData.subjectName}
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-[1.5fr_0.5fr] md:items-end">
          <div>
            <p className="text-sm text-text-secondary">
              Expand the units below to review study notes, chat semantically with reference materials, and solve MCQs.
            </p>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono text-text-secondary mb-2">
              <span>Roadmap Completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>
      </section>

      {/* Vertical Timeline Units List */}
      <section className="grid gap-6">
        {roadmapData.units.map((unit) => {
          const isExpanded = !!expandedUnits[unit.id]

          return (
            <div key={unit.id} className="border border-border bg-panel">
              {/* Unit Header Bar */}
              <button
                onClick={() => toggleUnit(unit.id)}
                className="flex w-full items-center justify-between p-5 text-left border-b border-transparent data-[expanded=true]:border-border transition"
                data-expanded={isExpanded}
              >
                <div className="grid gap-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
                    {unit.difficulty} / {unit.estimatedTime}
                  </span>
                  <h3 className="font-display text-lg font-bold uppercase text-text-primary">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-text-secondary">{unit.description}</p>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
              </button>

              {/* Topics Sub-list */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-border bg-background/50">
                      {unit.topics.map((topic) => {
                        // Find first incomplete topic to "glow" or current active
                        const isCurrentActive = !topic.completed

                        return (
                          <div
                            key={topic.id}
                            className={`p-5 grid gap-4 md:grid-cols-[1fr_220px] md:items-center transition duration-200 ${
                              isCurrentActive ? 'border-l-2 border-accent bg-accent/2' : ''
                            }`}
                          >
                            <div className="grid gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`h-1.5 w-1.5 rounded-full ${topic.completed ? 'bg-success' : 'bg-accent animate-pulse'}`} />
                                <span className="font-display text-sm font-semibold text-text-primary uppercase tracking-wide">
                                  {topic.title}
                                </span>
                                {topic.completed && <CheckCircle className="h-3.5 w-3.5 text-success inline" />}
                              </div>
                              <p className="text-xs text-text-secondary">{topic.summary}</p>
                              <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted mt-2">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {topic.estimatedTime}</span>
                                <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {topic.difficulty}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end">
                              {topic.completed ? (
                                <span className="inline-flex items-center gap-1.5 border border-success/20 bg-success/5 px-3 py-2 text-xs font-mono uppercase tracking-wider text-success">
                                  <Award className="h-3.5 w-3.5" /> Passed
                                </span>
                              ) : null}
                              <Button asChild variant={isCurrentActive ? 'primary' : 'secondary'} size="sm" className="px-5">
                                <Link to={`/student/subjects/${subjectId || 'sub-machine-learning'}/topic/${topic.id}`}>
                                  {topic.completed ? 'REVIEW' : 'START STUDY'}
                                  <Play className="h-3.5 w-3.5 ml-1.5 fill-current" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </section>
    </div>
  )
}
