import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  LogOut,
  PlusSquare,
  Settings,
  UserCircle,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Subjects', href: '/teacher/subjects', icon: BookOpen },
  { label: 'Create Subject', href: '/teacher/subjects/create', icon: PlusSquare },
  { label: 'Analytics', href: '/teacher/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/teacher/settings', icon: Settings },
  { label: 'Profile', href: '/teacher/settings', icon: UserCircle },
]

export default function TeacherLayout() {
  return (
    <div className="min-h-svh bg-background text-text-primary">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background/95 lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-6 py-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Teacher OS</p>
            <h1 className="mt-3 font-display text-2xl font-semibold uppercase leading-none tracking-normal">
              AI Learning Platform
            </h1>
          </div>
          <nav className="grid gap-1 px-3 py-5">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 border border-transparent px-3 py-3 text-sm uppercase tracking-[0.08em] text-text-secondary transition',
                    isActive
                      ? 'border-border-strong bg-panel text-text-primary'
                      : 'hover:border-border hover:bg-surface hover:text-accent',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto border-t border-border p-4">
            <button className="mechanical-focus flex w-full items-center gap-3 border border-border bg-panel px-3 py-3 text-left text-sm uppercase tracking-[0.08em] text-text-secondary transition hover:border-danger hover:text-danger">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">Neural curriculum control</p>
              <p className="mt-1 text-sm text-text-secondary">Create, verify, publish, and monitor AI-generated learning systems.</p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <div className="h-2 w-2 bg-accent" />
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Pinecone online</span>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.slice(0, 5).map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex min-w-max items-center gap-2 border px-3 py-2 text-xs uppercase tracking-[0.08em]',
                    isActive ? 'border-accent bg-accent text-background' : 'border-border bg-panel text-text-secondary',
                  )
                }
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
