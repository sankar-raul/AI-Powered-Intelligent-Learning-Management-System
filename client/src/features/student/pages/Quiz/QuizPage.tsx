import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/toast'
import { get } from '@/api/apiMethod'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  BrainCircuit,
  Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Question {
  id: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

const QUIZZES: Record<string, { title: string; questions: Question[] }> = {
  'topic-gradient-descent': {
    title: 'Gradient Descent Optimization Quiz',
    questions: [
      {
        id: 'q1',
        question: 'If the learning rate parameter (alpha) is configured excessively high, what is the expected outcome of the optimization parameter convergence?',
        options: [
          'The parameters will converge to the local minimum faster.',
          'The cost function will overshoot the minimum and diverge.',
          'The gradient updates will automatically freeze and stay constant.',
          'The weights will scale down to exactly zero in the first step.'
        ],
        answerIndex: 1,
        explanation: 'An excessively large learning rate causes updates to make steps that overshoot the target minimum, causing the objective function cost value to oscillate and diverge upward.'
      },
      {
        id: 'q2',
        question: 'Which variant of Gradient Descent computes the parameter gradients across the entire training dataset in a single step?',
        options: [
          'Stochastic Gradient Descent (SGD)',
          'Mini-Batch Gradient Descent',
          'Batch Gradient Descent',
          'Nesterov Accelerated Gradient'
        ],
        answerIndex: 2,
        explanation: 'Batch Gradient Descent computes gradients for the entire dataset before making a parameter update, which guarantees smooth convergence path lines but is highly resource intensive.'
      },
      {
        id: 'q3',
        question: 'What mathematical entity defines the direction of steepest cost minimization?',
        options: [
          'The positive gradient vector',
          'The negative gradient vector',
          'The Hessian matrix determinant',
          'The Euclidean distance norm'
        ],
        answerIndex: 1,
        explanation: 'The negative gradient points in the direction of steepest descent, driving parameter iterations directly towards local objective minimum values.'
      }
    ]
  },
  'topic-paging': {
    title: 'TLB Translation cache Quiz',
    questions: [
      {
        id: 'q1',
        question: 'What is a Translation Lookaside Buffer (TLB)?',
        options: [
          'A system RAM buffer that queues storage logs.',
          'A fast hardware memory cache that stores recent virtual-to-physical address mappings.',
          'A compiler optimization step that swaps page boundaries.',
          'An operating system task registry that manages thread schedules.'
        ],
        answerIndex: 1,
        explanation: 'The TLB is a dedicated MMU hardware cache. By storing translation registers, it avoids checking slow RAM page table pages on CPU cycles.'
      },
      {
        id: 'q2',
        question: 'What penalty is incurred when a TLB lookup fails to find a page entry translation mapping (TLB Miss)?',
        options: [
          'The kernel forces a system restart page fault error.',
          'The MMU must walk the multi-level page tables in RAM, incurring slow memory access cycles.',
          'The instruction pointer jumps backwards to recompile.',
          'The page frame is instantly paged out to secondary disk swap space.'
        ],
        answerIndex: 1,
        explanation: 'When a TLB lookup misses, the hardware MMU must perform page table lookups across physical RAM indices, taking 10-100 times longer than cache hits.'
      }
    ]
  }
}

export default function QuizPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>()
  const { toast } = useToast()

  const [quizData, setQuizData] = useState<{ title: string; questions: Question[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [confidenceRatings, setConfidenceRatings] = useState<Record<number, 'Low' | 'Medium' | 'High'>>({})
  const [submitted, setSubmitted] = useState(false)
  const [timer, setTimer] = useState(180) // 3 minutes for live generated quizzes
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    let active = true
    let pollInterval: NodeJS.Timeout

    async function fetchQuiz() {
      if (!subjectId || !topicId) return
      try {
        const res = await get(`/student/subjects/${subjectId}/topics/${topicId}/quiz`)
        if (!active) return

        if (res.generating) {
          setGenerating(true)
          // Retry in 4 seconds
          pollInterval = setTimeout(fetchQuiz, 4000)
        } else if (res.quiz) {
          const mapped = res.quiz.questions.map((q: any, idx: number) => {
            const ansIdx = q.options.indexOf(q.answer)
            return {
              id: q._id || `q-${idx}`,
              question: q.question,
              options: q.options,
              answerIndex: ansIdx !== -1 ? ansIdx : 0,
              explanation: q.explanation
            }
          })
          setQuizData({
            title: res.quiz.title,
            questions: mapped
          })
          setGenerating(false)
          setLoading(false)
        } else {
          throw new Error("No quiz data returned")
        }
      } catch (err) {
        console.warn("Failed to load live quiz from backend. Falling back to local static mock quiz:", err)
        if (!active) return
        const fallback = QUIZZES[topicId || 'topic-gradient-descent'] || QUIZZES['topic-gradient-descent']
        setQuizData(fallback)
        setGenerating(false)
        setLoading(false)
      }
    }

    fetchQuiz()
    return () => {
      active = false
      if (pollInterval) clearTimeout(pollInterval)
    }
  }, [subjectId, topicId])

  if (loading || !quizData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 py-24 text-center corner-frame border border-border bg-panel">
        <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
        <p className="font-mono text-xs uppercase tracking-wider text-text-primary">
          {generating ? "AI Compiler is synthesizing checkpoint questions..." : "Initializing secure assessment socket..."}
        </p>
        {generating && (
          <p className="text-[10px] text-text-muted mt-2 uppercase tracking-wide">
            This might take up to 10 seconds. Please do not close the terminal.
          </p>
        )}
      </div>
    )
  }

  // Countdown timer logic
  useEffect(() => {
    if (submitted) return
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval)
          handleSubmitQuiz()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [submitted])

  const handleSelectOption = (optIdx: number) => {
    if (submitted) return
    setSelectedAnswers((current) => ({
      ...current,
      [activeQuestion]: optIdx
    }))
    // Default confidence value to High if not yet specified
    if (!confidenceRatings[activeQuestion]) {
      setConfidenceRatings((current) => ({
        ...current,
        [activeQuestion]: 'High'
      }))
    }
  }

  const handleSetConfidence = (rating: 'Low' | 'Medium' | 'High') => {
    if (submitted) return
    setConfidenceRatings((current) => ({
      ...current,
      [activeQuestion]: rating
    }))
  }

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < quizData.questions.length) {
      toast({
        title: 'Quiz Incomplete',
        description: 'Complete all MCQ options before compiling responses.',
        type: 'warning'
      })
      return
    }
    setSubmitted(true)
    // award mock XP (e.g. 50 XP base, plus 20 XP for each correct, max 110 XP)
    const correctCount = calculateCorrectCount()
    const xpEarned = correctCount * 30 + 20
    toast({
      title: 'MCQ Compilation Finished',
      description: `Evaluation: ${correctCount}/${quizData.questions.length} Correct. +${xpEarned} XP logged.`,
      type: 'success'
    })
  }

  const calculateCorrectCount = () => {
    let correct = 0
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        correct++
      }
    })
    return correct
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`
  }

  const correctCount = calculateCorrectCount()
  const successRate = Math.round((correctCount / quizData.questions.length) * 100)

  // Render score card if submitted and quiz finalized
  if (submitted && !showExplanation) {
    return (
      <div className="max-w-2xl mx-auto grid gap-8">
        <section className="corner-frame border border-border bg-panel p-6 md:p-8 text-center flex flex-col items-center justify-center">
          <div className="bg-accent/10 border border-accent/20 p-4 text-accent w-max rounded-full mb-4">
            <Award className="h-10 w-10 animate-bounce" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Assessment Complete</p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-normal mt-3 text-text-primary">
            Score compilation summary
          </h1>
          <p className="mt-2 text-xs text-text-secondary">
            Your results have been parsed and committed to your progress dashboard logs.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8 w-full border-t border-b border-border py-6 my-2">
            <div>
              <span className="block font-mono text-[9px] uppercase text-text-muted">Accuracy Score</span>
              <span className="font-display text-3xl font-bold text-accent">{successRate}%</span>
            </div>
            <div>
              <span className="block font-mono text-[9px] uppercase text-text-muted">Correct Answers</span>
              <span className="font-display text-3xl font-bold text-text-primary">{correctCount} / {quizData.questions.length}</span>
            </div>
            <div>
              <span className="block font-mono text-[9px] uppercase text-text-muted">XP Rewards Gained</span>
              <span className="font-display text-3xl font-bold text-success">+{correctCount * 30 + 20} XP</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
            <Button onClick={() => setShowExplanation(true)} className="flex-1">
              REVIEW EXPLANATIONS
            </Button>
            <Button asChild variant="primary" className="flex-1">
              <Link to={`/student/subjects/${subjectId || 'sub-machine-learning'}`}>
                RETURN TO ROADMAP <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto grid gap-6">
      {/* Back navigation & timer bar */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={`/student/subjects/${subjectId || 'sub-machine-learning'}/topic/${topicId || 'topic-gradient-descent'}`}
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:text-accent transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Quit quiz
        </Link>

        <div className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-xs uppercase ${
          timer < 30 ? 'border-danger/30 bg-danger/5 text-danger animate-pulse' : 'border-border bg-panel text-text-primary'
        }`}>
          <Clock className="h-4 w-4" />
          <span>Timer: {formatTime(timer)}</span>
        </div>
      </section>

      {/* Main quiz board */}
      <section className="grid gap-4">
        {/* Progress Header */}
        <div className="border border-border bg-panel p-4 flex items-center justify-between text-xs font-mono">
          <span className="uppercase text-text-secondary">Checkpoint Assessment</span>
          <span className="text-accent">Question {activeQuestion + 1} of {quizData.questions.length}</span>
        </div>
        <Progress value={((activeQuestion + 1) / quizData.questions.length) * 100} className="h-1.5" />

        {/* Question Panel */}
        <Card className="p-6 md:p-8">
          <h2 className="text-base md:text-lg font-display font-medium text-text-primary leading-relaxed">
            {quizData.questions[activeQuestion].question}
          </h2>

          {/* Options list */}
          <div className="grid gap-3 mt-6">
            {quizData.questions[activeQuestion].options.map((opt, idx) => {
              const isSelected = selectedAnswers[activeQuestion] === idx
              const isCorrectAnswer = quizData.questions[activeQuestion].answerIndex === idx
              
              let borderStyle = 'border-border hover:border-accent/40 bg-background text-text-secondary'
              if (isSelected) {
                borderStyle = 'border-accent bg-accent/5 text-text-primary'
              }
              if (showExplanation) {
                if (isCorrectAnswer) {
                  borderStyle = 'border-success bg-success/5 text-success font-semibold'
                } else if (isSelected) {
                  borderStyle = 'border-danger bg-danger/5 text-danger'
                } else {
                  borderStyle = 'border-border/30 bg-background/20 text-text-muted'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`text-left p-4 text-xs transition duration-200 border flex items-start gap-3 ${borderStyle}`}
                  disabled={showExplanation}
                >
                  <span className="font-mono text-text-muted mt-0.5">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Confidence Slider rating */}
          {!showExplanation && (
            <div className="mt-8 border-t border-border pt-5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Confidence Coefficient:</span>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSetConfidence(r)}
                    className={`border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition ${
                      confidenceRatings[activeQuestion] === r
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-border bg-background text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Explanation panel */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border border-border bg-background p-4 flex gap-3 text-xs leading-relaxed"
            >
              <BrainCircuit className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider block mb-1">AI Explanation logs</span>
                <p className="text-text-secondary">{quizData.questions[activeQuestion].explanation}</p>
              </div>
            </motion.div>
          )}
        </Card>
      </section>

      {/* Navigation panel */}
      <section className="flex justify-between items-center mt-2">
        <Button
          variant="secondary"
          onClick={() => setActiveQuestion((q) => Math.max(q - 1, 0))}
          disabled={activeQuestion === 0}
        >
          Previous
        </Button>

        {showExplanation ? (
          activeQuestion < quizData.questions.length - 1 ? (
            <Button onClick={() => setActiveQuestion((q) => q + 1)}>
              Next Question
            </Button>
          ) : (
            <Button asChild variant="primary">
              <Link to={`/student/subjects/${subjectId || 'sub-machine-learning'}`}>
                CLOSE REVIEW <CheckCircle2 className="h-4 w-4" />
              </Link>
            </Button>
          )
        ) : activeQuestion < quizData.questions.length - 1 ? (
          <Button onClick={() => setActiveQuestion((q) => q + 1)}>
            Next Question
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmitQuiz} className="px-6">
            COMPILE RESULTS
          </Button>
        )}
      </section>
    </div>
  )
}
