import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Trophy,
  User,
  LogOut,
  Bell,
  Cpu,
  Flame,
  X,
  Menu
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

const navItems = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Explore', href: '/student/explore', icon: Compass },
  { label: 'My Subjects', href: '/student/subjects', icon: BookOpen },
  { label: 'Progress & Stats', href: '/student/progress', icon: Trophy },
  { label: 'Profile', href: '/student/profile', icon: User },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    toast({
      title: 'Session Terminated',
      description: 'The secure client session has been closed.',
      type: 'info'
    })
    navigate('/login')
  }

  // Dummy notifications list
  const notifications = [
    { id: '1', title: 'Roadmap Generated', text: 'AI completed roadmap compilation for Machine Learning.', time: '10m ago' },
    { id: '2', title: 'Quiz Available', text: 'Topic 3 checkpoint quiz is now unlocked.', time: '1h ago' },
    { id: '3', title: 'Consistency Check', text: 'Maintain your 7-day study streak today.', time: '3h ago' }
  ]

  return (
    <div className="min-h-svh bg-background text-text-primary">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background/95 lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-6 py-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Student OS</p>
            <h1 className="mt-3 font-display text-2xl font-semibold uppercase leading-none tracking-normal">
              AI Learning Platform
            </h1>
          </div>
          
          <div className="px-6 py-4 border-b border-border bg-panel/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-warning animate-pulse" />
              <div>
                <span className="block font-mono text-[10px] uppercase text-text-secondary leading-none">STREAK</span>
                <span className="font-display text-sm font-bold text-warning">{user?.streak ?? 7} DAYS</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-mono text-[9px] uppercase text-text-muted leading-none">LVL {user?.level ?? 12}</span>
              <span className="font-mono text-[10px] font-bold text-accent">{user?.xp ?? 2450} XP</span>
            </div>
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
            <button
              onClick={handleLogout}
              className="mechanical-focus flex w-full items-center gap-3 border border-border bg-panel px-3 py-3 text-left text-sm uppercase tracking-[0.08em] text-text-secondary transition hover:border-danger hover:text-danger"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">Academic Sandbox Kernel</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-text-secondary">Welcome back,</span>
                <span className="text-xs font-bold text-text-primary">{user?.name ?? 'Alex Mercer'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative border border-border bg-panel p-2.5 hover:border-accent hover:text-accent transition"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-accent border border-background rounded-full" />
              </button>

              <div className="hidden items-center gap-3 md:flex">
                <Cpu className="h-4 w-4 text-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">LLM PIPELINE COMPILING</span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="border border-border bg-panel p-2.5 hover:border-accent hover:text-accent transition lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile responsive slide menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-background p-6 lg:hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <span className="font-mono text-xs text-accent">Student Navigation</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="grid gap-3">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 border p-3 text-sm uppercase tracking-[0.08em]',
                          isActive ? 'border-accent bg-accent text-background' : 'border-border bg-panel text-text-secondary',
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="flex w-full items-center justify-center gap-3 border border-danger/50 bg-danger/10 p-3 text-sm uppercase tracking-[0.08em] text-danger"
              >
                <LogOut className="h-4 w-4" />
                Logout Session
              </button>
            </div>
          )}
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </main>
      </div>

      {/* Notifications Drawer/Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification logs</DialogTitle>
            <DialogDescription>
              Real-time activity messages generated by the core learning compile processor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {notifications.map((n) => (
              <div key={n.id} className="border border-border bg-panel p-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">{n.title}</span>
                  <span className="font-mono text-[9px] text-text-muted">{n.time}</span>
                </div>
                <p className="text-xs text-text-secondary">{n.text}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
