import { ActivityLineChart, MetricBarChart } from '../../components/Charts/TeacherCharts'
import { useTeacherAnalytics } from '../../hooks/useTeacherQueries'

export default function TeacherAnalyticsPage() {
  const { data, isLoading } = useTeacherAnalytics()

  if (isLoading || !data) {
    return <div className="h-96 animate-pulse border border-border bg-panel" />
  }

  return (
    <div className="grid gap-6">
      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Analytics</p>
        <h1 className="mt-3 font-display text-5xl font-semibold uppercase leading-none tracking-normal">
          Learning intelligence
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-text-secondary">
          Monitor completion, quiz performance, difficult topics, AI question demand, student activity, and learning progress.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <MetricBarChart title="Subject Completion" data={data.completionData} />
        <MetricBarChart title="Average Quiz Score" data={data.quizScoreData} />
        <MetricBarChart title="Most Difficult Topics" data={data.difficultTopics} />
        <ActivityLineChart data={data.studentActivity} />
      </section>

      <section className="tech-panel p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Most Asked AI Questions</p>
        <div className="mt-5 grid gap-3">
          {data.aiQuestions.map((question, index) => (
            <div key={question} className="grid gap-3 border border-border bg-background p-4 md:grid-cols-[64px_1fr]">
              <span className="font-mono text-xs text-text-muted">Q{String(index + 1).padStart(2, '0')}</span>
              <p className="text-sm text-text-primary">{question}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
