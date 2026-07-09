import { useAuth } from '@/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Flame,
  Award,
  CheckCircle,
  Trophy,
  Activity,
  Calendar,
  Lock
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  desc: string
  xpReward: number
  unlocked: boolean
  icon: string
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1', title: '🔥 7 Day Study Streak', desc: 'Maintained activity commits for seven consecutive calendar days.', xpReward: 150, unlocked: true, icon: '🔥' },
  { id: 'ach2', title: '⚡ Fast Learner', desc: 'Completed one full unit topic in less than 30 estimated minutes.', xpReward: 100, unlocked: true, icon: '⚡' },
  { id: 'ach3', title: '📖 Topic Master', desc: 'Achieved 100% completion scores on any major topic roadmap.', xpReward: 200, unlocked: false, icon: '📖' },
  { id: 'ach4', title: '🎯 Quiz Champion', desc: 'Scored 100% accuracy on three consecutive checkpoint quizzes.', xpReward: 300, unlocked: true, icon: '🎯' },
  { id: 'ach5', title: '🧠 AI Explorer', desc: 'Asked the AI coprocessor 20+ query questions about reference syllabus logs.', xpReward: 100, unlocked: true, icon: '🧠' },
  { id: 'ach6', title: '🚀 Consistency Award', desc: 'Completed all daily study targets for one full week.', xpReward: 250, unlocked: false, icon: '🚀' }
]

export default function ProgressPage() {
  const { user } = useAuth()

  // SVG Chart Mock Data coordinates
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const studyHours = [2, 1.5, 3.5, 4, 1.8, 2.5, 3] // heights for coordinates

  return (
    <div className="grid gap-8">
      {/* Title Header */}
      <section className="corner-frame border border-border bg-panel p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Student Progress Telemetry</p>
        <h1 className="mt-3 font-display text-4xl font-semibold uppercase leading-none tracking-normal md:text-6xl">
          Progression analytics console
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-text-secondary">
          Track learning efficiency indexes, streak parameters, and unlocked achievement modules evaluated by your AI supervisor core.
        </p>
      </section>

      {/* Level Ladder Stats */}
      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-border bg-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
              <span className="font-mono text-xs text-text-primary uppercase tracking-wider">Active Level Pipeline</span>
              <span className="font-mono text-[10px] text-accent">LVL {user?.level ?? 12} &gt; LVL {(user?.level ?? 12) + 1}</span>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs text-text-secondary mb-2 font-mono">
              <span>Accumulated Experience</span>
              <span>{user?.xp ?? 2450} / 3000 XP</span>
            </div>
            <Progress value={81} className="h-2.5" />
            <p className="mt-3 text-xs text-text-muted leading-relaxed">
              Earn <span className="text-text-primary font-mono">550 XP</span> more by answering topic quizzes to rank up.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-5 mt-6 text-center">
            <div>
              <span className="block font-mono text-[9px] text-text-muted uppercase leading-none mb-1">Study Hours</span>
              <span className="font-display text-2xl font-bold text-text-primary">18.3h</span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-text-muted uppercase leading-none mb-1">Quizzes Solved</span>
              <span className="font-display text-2xl font-bold text-text-primary">5 Checkpoints</span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-text-muted uppercase leading-none mb-1">Avg Accuracy</span>
              <span className="font-display text-2xl font-bold text-accent">90%</span>
            </div>
          </div>
        </div>

        {/* Calendar details */}
        <div className="border border-border bg-panel p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <Calendar className="h-5 w-5 text-accent" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-text-primary">Consistency Target logs</h3>
          </div>

          <div className="grid gap-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <span className="text-text-secondary">DAILY STUDY TARGET:</span>
              <span className="text-text-primary">45 Minutes</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <span className="text-text-secondary">ACTIVE LEARNING STREAK:</span>
              <span className="text-warning flex items-center gap-1 font-bold">
                <Flame className="h-4 w-4" /> {user?.streak ?? 7} DAYS
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">TOTAL ACHIEVEMENTS:</span>
              <span className="text-accent font-bold">4 / 6 Unlocked</span>
            </div>
          </div>

          <div className="mt-6 border border-border bg-background p-4 flex gap-3 text-xs leading-relaxed">
            <Trophy className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <p className="text-text-secondary">
              Study for at least 15 more minutes today to safeguard your active 7-day study streak from expiration.
            </p>
          </div>
        </div>
      </section>

      {/* SVG Study Time Analytics Chart */}
      <section className="border border-border bg-panel p-5">
        <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
          <Activity className="h-5 w-5 text-accent" />
          <h3 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary">Weekly Efficiency Logs</h3>
        </div>

        <div className="relative h-60 w-full">
          {/* Chart Y Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] font-mono text-text-muted">
            <div className="border-b border-border w-full pb-1 text-right">4.0h</div>
            <div className="border-b border-border w-full pb-1 text-right">3.0h</div>
            <div className="border-b border-border w-full pb-1 text-right">2.0h</div>
            <div className="border-b border-border w-full pb-1 text-right">1.0h</div>
            <div className="w-full text-right">0.0h</div>
          </div>

          {/* SVG representation of Bar graphs */}
          <div className="absolute inset-x-8 bottom-6 top-4 flex items-end justify-around">
            {studyHours.map((hours, idx) => {
              const heightPercent = (hours / 4) * 100

              return (
                <div key={idx} className="flex flex-col items-center gap-2 w-12 group cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background border border-border px-2 py-1 absolute -top-5 font-mono text-[9px] uppercase tracking-wider text-accent pointer-events-none">
                    {hours} Hours
                  </div>
                  
                  {/* Glowing Bar */}
                  <div
                    className="w-8 bg-accent/80 hover:bg-accent border border-accent/20 transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  
                  <span className="font-mono text-[10px] text-text-secondary">
                    {weekDays[idx]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Professional Gamification Achievements Grid */}
      <section className="grid gap-4">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-text-primary flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          Unlocked Academics badges
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((ach) => (
            <Card
              key={ach.id}
              className={`flex gap-4 relative overflow-hidden transition ${
                ach.unlocked ? 'border-border bg-panel' : 'border-border/30 bg-panel/30 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div className="text-3xl shrink-0 p-3 bg-background border border-border flex items-center justify-center h-16 w-16 select-none">
                {ach.unlocked ? ach.icon : <Lock className="h-5 w-5 text-text-muted" />}
              </div>

              {/* Badge Text */}
              <div className="grid gap-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase text-text-primary leading-none">
                    {ach.title}
                  </h4>
                  {ach.unlocked && <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />}
                </div>
                <p className="text-[10px] text-text-secondary leading-relaxed mt-1">
                  {ach.desc}
                </p>
                <span className="font-mono text-[9px] text-text-muted uppercase mt-1">
                  Reward: <span className="text-accent">{ach.xpReward} XP</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
