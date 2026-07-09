import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Input, FieldLabel } from '@/components/ui/input'
import { Terminal, Shield, ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('System identity parameter (email) is required.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await login(email, role)
      if (role === 'teacher') {
        navigate('/teacher/dashboard')
      } else {
        navigate('/student/dashboard')
      }
    } catch (err) {
      setError('Console initialization rejected. Check authentication services.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(200,255,61,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(200,255,61,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md border border-border bg-panel p-8 corner-frame relative"
      >
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-primary">Console Login</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">ILMS SECURE PROTOCOL</span>
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary">
            AI learning operating system
          </h1>
          <p className="mt-2 text-xs text-text-secondary">
            Provide system credentials to establish secure workspace socket
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-text-muted">Target Interface</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`border px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition ${
                  role === 'student'
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-border bg-background text-text-secondary hover:text-text-primary'
                }`}
              >
                Student Console
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`border px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition ${
                  role === 'teacher'
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-border bg-background text-text-secondary hover:text-text-primary'
                }`}
              >
                Teacher Console
              </button>
            </div>
          </div>

          <FieldLabel label="Console Identity (Email)" error={error}>
            <Input
              type="email"
              placeholder="operator@ilms.academy"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              required
              disabled={loading}
              className="font-mono"
            />
          </FieldLabel>

          <Button type="submit" variant="primary" disabled={loading} className="mt-2 w-full justify-between">
            {loading ? (
              <>
                INITIALIZING SOCKET...
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                ESTABLISH CONNECTION
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 border-t border-border pt-4 text-[10px] font-mono text-text-muted uppercase tracking-wider">
          <Shield className="h-3 w-3 text-accent" />
          End-to-End Artificial Intelligence Compiler
        </div>
      </motion.div>
    </div>
  )
}
