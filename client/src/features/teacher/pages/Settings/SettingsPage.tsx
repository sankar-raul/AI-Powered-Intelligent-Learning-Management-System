import { Bell, Lock, Save, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldLabel, Input } from '@/components/ui/input'

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Settings</p>
        <h1 className="mt-3 font-display text-5xl font-semibold uppercase leading-none tracking-normal">Teacher command profile</h1>
        <p className="mt-4 max-w-3xl text-sm text-text-secondary">
          Manage profile identity, notification policy, and platform preferences for AI-generated subject operations.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="tech-panel p-5">
          <div className="flex items-center gap-3">
            <UserCircle className="h-5 w-5 text-accent" />
            <h2 className="font-display text-2xl font-semibold uppercase tracking-normal">Profile</h2>
          </div>
          <div className="mt-5 grid gap-4">
            <FieldLabel label="Name">
              <Input defaultValue="Dr. Teacher Operator" />
            </FieldLabel>
            <FieldLabel label="Email">
              <Input defaultValue="teacher@college.edu" />
            </FieldLabel>
            <FieldLabel label="Department">
              <Input defaultValue="Computer Science" />
            </FieldLabel>
            <Button type="button" variant="primary">
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </div>

        <div className="tech-panel p-5">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-accent" />
            <h2 className="font-display text-2xl font-semibold uppercase tracking-normal">System Preferences</h2>
          </div>
          <div className="mt-5 grid gap-3">
            <Toggle label="Notify when AI roadmap is ready" checked />
            <Toggle label="Notify when processing fails" checked />
            <Toggle label="Allow students to enroll after publish" checked />
            <Toggle label="Auto-regenerate weekly quizzes" />
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <Button type="button" variant="secondary">
              <Lock className="h-4 w-4" />
              Security Settings
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function Toggle({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 border border-border bg-background p-4 text-sm text-text-primary">
      <span>{label}</span>
      <input className="h-5 w-5 accent-[#C8FF3D]" type="checkbox" defaultChecked={checked} />
    </label>
  )
}
