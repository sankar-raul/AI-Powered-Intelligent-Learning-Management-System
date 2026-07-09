import { useAuth } from '@/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Flame,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Brain,
  CalendarDays,
  Target
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { user } = useAuth()

  // Custom heatmap contribution grid (simulated study logs)
  const days = Array.from({ length: 98 }, (_, i) => {
    // Generate values representing study hours (0 to 4)
    const val = [0, 1, 3, 0, 4, 2, 0, 1, 0, 3, 2, 0, 1, 4, 0, 0, 3, 2, 1][i % 19]
    return { day: i, val }
  })

  const mockContinuingSubjects = [
    {
      id: 'sub-machine-learning',
      name: 'Machine Learning Fundamentals',
      completedTopics: 6,
      totalTopics: 10,
      lastTopicName: 'Gradient Descent Optimization',
      lastTopicId: 'topic-gradient-descent',
      progress: 60
    },
    {
      id: 'sub-operating-systems',
      name: 'Advanced Operating Systems',
      completedTopics: 4,
      totalTopics: 8,
      lastTopicName: 'Virtual Memory & Paging',
      lastTopicId: 'topic-paging',
      progress: 50
    }
  ]

  const heatmapColors = {
    0: 'bg-border/20',
    1: 'bg-accent/15 border border-accent/10',
    2: 'bg-accent/35 border border-accent/20',
    3: 'bg-accent/60 border border-accent/40',
    4: 'bg-accent border border-accent',
  }

  return (
    <div className="grid gap-8">
      {/* Console Welcome Banner */}
      <section className="corner-frame border border-border bg-panel p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Student Workspace</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <h1 className="font-display text-4xl font-semibold uppercase leading-none tracking-normal md:text-6xl">
              Workspace terminal
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-text-secondary">
              Keep building your learning streak. Access roadmaps, test comprehension with adaptive MCQs, and query notes in real-time.
            </p>
          </div>
          <div className="border border-border/60 bg-background/50 p-4 font-mono text-[10px] uppercase text-text-secondary">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-accent" /> DAILY TARGET:</span>
              <span className="text-accent font-bold">2/3 TOPICS</span>
            </div>
            <Progress value={66} className="h-1.5" />
            <span className="block mt-2 text-[9px] text-text-muted text-right">Preserve streak in 45m of study</span>
          </div>
        </div>
      </section>

      {/* Gamified Core Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Learning Streak</span>
            <span className="mt-1 block font-display text-3xl font-bold text-warning">{user?.streak ?? 7} Days</span>
          </div>
          <Flame className="h-8 w-8 text-warning" />
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Profile Level</span>
            <span className="mt-1 block font-display text-3xl font-bold text-accent">Level {user?.level ?? 12}</span>
          </div>
          <Zap className="h-8 w-8 text-accent animate-pulse" />
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Accumulated Score</span>
            <span className="mt-1 block font-display text-3xl font-bold text-text-primary">{user?.xp ?? 2450} XP</span>
          </div>
          <Award className="h-8 w-8 text-text-secondary" />
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Active Subjects</span>
            <span className="mt-1 block font-display text-3xl font-bold text-text-primary">2 Enrolled</span>
          </div>
          <BookOpen className="h-8 w-8 text-text-secondary" />
        </Card>
      </section>

      {/* Continue Learning Nodes */}
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-4">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-text-primary flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            Continue Learning
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mockContinuingSubjects.map((sub) => (
              <Card key={sub.id} className="flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">CURRICULUM ENROLLED</span>
                  <h3 className="font-display text-lg font-bold text-text-primary uppercase mt-1 leading-snug">
                    {sub.name}
                  </h3>
                  <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
                    <span>Topic Progress</span>
                    <span>{sub.completedTopics}/{sub.totalTopics} Done</span>
                  </div>
                  <Progress value={sub.progress} className="mt-2 h-1.5" />
                  <p className="mt-3 text-xs text-text-muted">
                    Next: <span className="text-text-secondary font-medium">{sub.lastTopicName}</span>
                  </p>
                </div>
                <Link
                  to={`/student/subjects/${sub.id}`}
                  className="mt-6 border border-border bg-background py-2 text-center text-xs font-mono uppercase tracking-wider text-accent hover:bg-accent hover:text-background transition flex items-center justify-center gap-1.5"
                >
                  RESUME TREE
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="grid gap-4">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-text-primary flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            AI Suggestions
          </h2>
          <div className="border border-border bg-panel p-5 flex flex-col gap-4">
            <div className="flex gap-3 border-b border-border pb-4">
              <span className="bg-accent/10 border border-accent/20 p-2 text-accent h-max">
                <Zap className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-xs font-mono uppercase text-text-primary">Struggling with Backpropagation?</h4>
                <p className="mt-1 text-xs text-text-secondary">AI recommends taking the review quiz on Neural Networks unit topic 2.</p>
                <Link to="/student/subjects/sub-machine-learning" className="mt-2 text-[10px] font-mono uppercase tracking-wider text-accent inline-flex items-center gap-1 hover:underline">
                  Launch review <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="bg-accent/10 border border-accent/20 p-2 text-accent h-max">
                <TrendingUp className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-xs font-mono uppercase text-text-primary">Boost Score Projection</h4>
                <p className="mt-1 text-xs text-text-secondary">Finish study hours for Operating Systems to jump from level 12 to 13.</p>
                <Link to="/student/progress" className="mt-2 text-[10px] font-mono uppercase tracking-wider text-accent inline-flex items-center gap-1 hover:underline">
                  Open telemetry <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution Heatmap */}
      <section className="border border-border bg-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-accent" />
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary">Learning Log Heatmap</h3>
          </div>
          <span className="font-mono text-xs text-text-secondary">Streak continuity visualization</span>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[700px] justify-between">
            {/* Simple Grid Representation */}
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {days.map((d) => (
                <div
                  key={d.day}
                  className={`h-3 w-3 ${heatmapColors[d.val as keyof typeof heatmapColors] || 'bg-border/20'}`}
                  title={`Day ${d.day}: ${d.val} study hours logged`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2 text-[10px] font-mono text-text-muted uppercase tracking-wider">
          <span>Less</span>
          <div className="h-3 w-3 bg-border/20" />
          <div className="h-3 w-3 bg-accent/15" />
          <div className="h-3 w-3 bg-accent/35" />
          <div className="h-3 w-3 bg-accent/60" />
          <div className="h-3 w-3 bg-accent" />
          <span>More</span>
        </div>
      </section>
    </div>
  )
}
