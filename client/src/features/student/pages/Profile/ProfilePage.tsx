import { useState } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Input, FieldLabel } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { User, Database, Settings } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [name, setName] = useState(user?.name || 'Alex Mercer')
  const [email, setEmail] = useState(user?.email || 'alex@university.edu')
  const [tlbBypass, setTlbBypass] = useState(true)
  const [notifRoadmap, setNotifRoadmap] = useState(true)
  const [notifStreak, setNotifStreak] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: 'Profile Saved',
        description: 'Your operator account metadata has been updated successfully.',
        type: 'success'
      })
    }, 600)
  }

  return (
    <div className="grid gap-8">
      {/* Title Header */}
      <section className="corner-frame border border-border bg-panel p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Operator Profile Settings</p>
        <h1 className="mt-3 font-display text-4xl font-semibold uppercase leading-none tracking-normal md:text-6xl">
          Workspace credentials
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-text-secondary">
          Configure security tokens, update notification endpoints, and audit active model vector databases connected to your learning environment.
        </p>
      </section>

      {/* Main Configurations Sections */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="border border-border bg-panel p-5 md:p-6 grid gap-5">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <User className="h-5 w-5 text-accent" />
            <h3 className="font-display text-lg font-bold uppercase tracking-wide text-text-primary">
              Identity parameters
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label="Operator Name">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FieldLabel>
            <FieldLabel label="Identity Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />
            </FieldLabel>
          </div>

          <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
            <span className="font-mono text-[10px] text-text-muted uppercase">SYSTEM: SECURE AUTHENTICATED SHA-256</span>
            <Button type="submit" variant="primary" className="px-6" disabled={loading}>
              {loading ? 'SAVING...' : 'SAVE CONFIGURATION'}
            </Button>
          </div>
        </form>

        {/* AI & Pipeline Settings */}
        <div className="border border-border bg-panel p-5 md:p-6 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
              <Settings className="h-5 w-5 text-accent" />
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-text-primary">
                Coprocessor Tuning
              </h3>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-3">
                <div>
                  <span className="block text-xs font-semibold text-text-primary font-mono uppercase">AI Roadmap Alerts</span>
                  <span className="block text-[10px] text-text-secondary leading-relaxed mt-0.5">
                    Receive active notifications when syllabus PDF parsing is fully compiled.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifRoadmap}
                  onChange={(e) => setNotifRoadmap(e.target.checked)}
                  className="mt-1 accent-accent"
                />
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-3">
                <div>
                  <span className="block text-xs font-semibold text-text-primary font-mono uppercase">Streak Guard reminder</span>
                  <span className="block text-[10px] text-text-secondary leading-relaxed mt-0.5">
                    Trigger toast prompts 30 minutes before daily targets expire.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifStreak}
                  onChange={(e) => setNotifStreak(e.target.checked)}
                  className="mt-1 accent-accent"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="block text-xs font-semibold text-text-primary font-mono uppercase">Pinecone Cache Warmups</span>
                  <span className="block text-[10px] text-text-secondary leading-relaxed mt-0.5">
                    Pre-warm vector indices when clicking on unit folders to minimize lookup times.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={tlbBypass}
                  onChange={(e) => setTlbBypass(e.target.checked)}
                  className="mt-1 accent-accent"
                />
              </div>
            </div>
          </div>

          <div className="border border-border bg-background p-4 flex gap-3 text-xs leading-relaxed font-mono">
            <Database className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-text-muted uppercase leading-none mb-1">Index Pipeline Status</span>
              <span className="text-accent text-[10px] font-bold">143 Index nodes / 2 subjects online</span>
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}
