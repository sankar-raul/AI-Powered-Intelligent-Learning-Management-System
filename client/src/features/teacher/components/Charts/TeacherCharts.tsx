import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ActivityPoint, ChartPoint } from '../../types/teacher.types'

export function MetricBarChart({ title, data }: { title: string; data: ChartPoint[] }) {
  return (
    <section className="tech-panel p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{title}</p>
      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#222222" vertical={false} />
            <XAxis dataKey="name" stroke="#666666" tickLine={false} axisLine={false} />
            <YAxis stroke="#666666" tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#C8FF3D" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export function ActivityLineChart({ data }: { data: ActivityPoint[] }) {
  return (
    <section className="tech-panel p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Student Activity</p>
      <div className="mt-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#222222" vertical={false} />
            <XAxis dataKey="day" stroke="#666666" tickLine={false} axisLine={false} />
            <YAxis stroke="#666666" tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="active" stroke="#C8FF3D" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="completed" stroke="#9A9A9A" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
