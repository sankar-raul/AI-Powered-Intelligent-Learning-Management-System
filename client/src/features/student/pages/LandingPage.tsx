import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Terminal, Cpu, GitFork, BookOpen, BarChart3, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-between overflow-hidden">
      {/* Neo Grid Lines */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(200,255,61,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,255,61,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Futuristic Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-accent" />
          <span className="font-display text-lg font-bold uppercase tracking-wider text-text-primary">
            ANTIGRAVITY <span className="text-accent">OS</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-accent transition">
            Access System
          </Link>
          <Button asChild variant="primary" size="sm">
            <Link to="/login">
              BOOT SYSTEM
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 grid gap-16 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6"
        >
          <div className="inline-flex items-center gap-2 border border-accent/20 bg-accent/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent w-max">
            <Cpu className="h-3 w-3 animate-pulse" />
            COMPILER ACTIVE: V1.0.0
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase leading-[0.9] tracking-tighter text-text-primary">
            An intelligent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-text-secondary">
              AI Learning
            </span> <br />
            Operating System.
          </h1>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-lg mt-2">
            The playground for higher education. Ingest curriculum PDFs, compile semantically linked roadmap trees, run interactive quiz checkpoints, and learn side-by-side with an LLM core.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button asChild variant="primary" size="md" className="px-6">
              <Link to="/login">
                INITIALIZE CORE
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="md" className="px-6">
              <a href="#features">
                READ LOGS
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Cyber Schematic Graphics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative border border-border bg-panel p-8 corner-frame flex flex-col gap-6"
        >
          <div className="flex justify-between items-center border-b border-border pb-4">
            <span className="font-mono text-xs text-text-secondary uppercase tracking-widest">NETWORK INTERACTION PIPELINE</span>
            <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border bg-background p-4">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">Compiled Roadmaps</span>
              <span className="font-display text-3xl font-bold text-text-primary block mt-1">14,802</span>
            </div>
            <div className="border border-border bg-background p-4">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">Context Chunks</span>
              <span className="font-display text-3xl font-bold text-text-primary block mt-1">8.4M</span>
            </div>
            <div className="border border-border bg-background p-4">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">Active Streets</span>
              <span className="font-display text-3xl font-bold text-text-primary block mt-1">99.8%</span>
            </div>
            <div className="border border-border bg-background p-4">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">System Latency</span>
              <span className="font-display text-3xl font-bold text-accent block mt-1">84ms</span>
            </div>
          </div>

          {/* Micro layout node display */}
          <div className="border border-border bg-background p-4 flex flex-col gap-3 font-mono text-[10px] uppercase text-text-secondary">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2">
              <span className="text-accent">&gt;</span>
              <span>Syllabus Parsing Pipeline:</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>PDF Text Extraction</span>
              <span className="text-success">[SUCCESS]</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Node Extraction & Sorting</span>
              <span className="text-success">[COMPLETED]</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Quiz Vector Embeddings</span>
              <span className="text-accent">[ACTIVE]</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Showcase Section */}
      <section id="features" className="border-t border-border bg-panel py-16">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="border border-border p-6 flex flex-col gap-4">
            <span className="text-accent bg-accent-muted/10 p-2.5 w-max border border-accent/20">
              <GitFork className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-text-primary">
              AI Roadmaps
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Auto-generate structured visual learning roadmap units, topics, estimates, and tasks directly parsed from syllabus documents.
            </p>
          </div>

          <div className="border border-border p-6 flex flex-col gap-4">
            <span className="text-accent bg-accent-muted/10 p-2.5 w-max border border-accent/20">
              <Cpu className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-text-primary">
              Semantic Search & Chat
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              An IDE-integrated chat dashboard providing code compilation support, streaming, and full source citations to uploaded class material.
            </p>
          </div>

          <div className="border border-border p-6 flex flex-col gap-4">
            <span className="text-accent bg-accent-muted/10 p-2.5 w-max border border-accent/20">
              <BookOpen className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-text-primary">
              Adaptive Quizzing
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Answer structured MCQs with confidence scaling, review instantaneous detailed feedback explanations, and unlock performance XP.
            </p>
          </div>

          <div className="border border-border p-6 flex flex-col gap-4">
            <span className="text-accent bg-accent-muted/10 p-2.5 w-max border border-accent/20">
              <BarChart3 className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-text-primary">
              Gamified Consistency
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Maintain learning streaks, complete achievements, level up your profile, and analyze your progression logs with interactive heatmaps.
            </p>
          </div>
        </div>
      </section>

      {/* Cyber Footer */}
      <footer className="border-t border-border bg-background px-6 py-6 flex flex-col md:flex-row items-center justify-between font-mono text-[10px] text-text-muted uppercase tracking-wider gap-4">
        <span>© 2026 ANTIGRAVITY ILMS CONSOLE. ALL PROTOCOLS DEPLOYED.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-accent transition">System logs</a>
          <a href="#" className="hover:text-accent transition">Developer Api</a>
          <a href="#" className="hover:text-accent transition">Academic Sandbox</a>
        </div>
      </footer>
    </div>
  )
}
