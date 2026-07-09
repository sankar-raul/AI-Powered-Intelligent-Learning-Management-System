import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import {
  ArrowLeft,
  BookOpen,
  Terminal,
  Send,
  Loader2,
  Copy,
  Check,
  Award,
  Link as LinkIcon
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'system'
  content: string
  citations?: { docName: string; page: number }[]
}

const TOPIC_CONTENTS: Record<string, { title: string; content: string; codeSnippet?: string }> = {
  'topic-gradient-descent': {
    title: 'Gradient Descent Optimization',
    content: 'Gradient descent is an optimization algorithm used to minimize some cost function by iteratively moving in the direction of steepest descent as defined by the negative of the gradient.\n\nIn machine learning, we use gradient descent to update the parameters of our model. In linear regression, these parameters are the weights (W) and biases (b). The cost function measuring our average prediction error is typically the Mean Squared Error (MSE).',
    codeSnippet: 'def gradient_descent(X, y, W, b, learning_rate, iterations):\n    m = len(y)\n    for i in range(iterations):\n        # 1. Forward prediction\n        predictions = np.dot(X, W) + b\n        # 2. Compute error gradients\n        dW = (1/m) * np.dot(X.T, (predictions - y))\n        db = (1/m) * np.sum(predictions - y)\n        # 3. Parameters update rule\n        W -= learning_rate * dW\n        b -= learning_rate * db\n    return W, b'
  },
  'topic-paging': {
    title: 'Translation Lookaside Buffer (TLB)',
    content: 'A Translation Lookaside Buffer (TLB) is a hardware cache memory that stores recent translations of virtual memory addresses to physical memory addresses. It is part of the chip\'s memory management unit (MMU).\n\nWhen a virtual address translation is requested, the MMU checks the TLB. If there is a match (a TLB hit), the physical address is retrieved immediately. If there is no match (a TLB miss), the MMU must read multi-level page tables in RAM, incurring significant memory cycle delays.',
    codeSnippet: '#define TLB_SIZE 16\ntypedef struct {\n    unsigned int virtual_page_num;\n    unsigned int physical_frame_num;\n    bool valid_bit;\n} TLB_Entry;\n\nunsigned int MMU_Translate(unsigned int vpn) {\n    for(int i = 0; i < TLB_SIZE; i++) {\n        if (tlb[i].virtual_page_num == vpn && tlb[i].valid_bit) {\n            return tlb[i].physical_frame_num; // TLB Hit!\n        }\n    }\n    return PageTable_Lookup(vpn); // TLB Miss, perform page table walk\n}'
  }
}

export default function TopicStudyPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>()
  const { toast } = useToast()
  const currentContent = TOPIC_CONTENTS[topicId || 'topic-gradient-descent'] || TOPIC_CONTENTS['topic-gradient-descent']

  const [copied, setCopied] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: `Hello! I have loaded the syllabus context for **${currentContent.title}**. You can ask me to explain optimization derivatives, pseudocode segments, or suggest practice questions.`,
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const handleCopyCode = () => {
    if (currentContent.codeSnippet) {
      navigator.clipboard.writeText(currentContent.codeSnippet)
      setCopied(true)
      toast({
        title: 'Copied to clipboard',
        description: 'Code snippet code copied.',
        type: 'success'
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: inputValue
    }
    setMessages((current) => [...current, userMsg])
    setInputValue('')
    setThinking(true)

    // Simulate AI response
    setTimeout(() => {
      setThinking(false)
      const aiReply: Message = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'system',
        content: `Analyzing gradient boundaries for "${userMsg.content}". In the uploaded syllabus note, parameters are adjusted using vector projection multipliers. You must focus on the partial derivative slope terms.`,
        citations: [
          { docName: 'Syllabus_PDF.pdf', page: 8 },
          { docName: 'LectureNotes_Unit1.docx', page: 3 }
        ]
      }
      setMessages((current) => [...current, aiReply])
    }, 1500)
  }

  return (
    <div className="grid gap-6 h-[calc(100vh-140px)] max-h-[850px] lg:grid-cols-[1.1fr_0.9fr]">
      {/* LEFT COLUMN: Study Material */}
      <section className="flex flex-col justify-between overflow-y-auto border border-border bg-panel p-5 md:p-6 h-full scrollbar">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
            <Link
              to={`/student/subjects/${subjectId || 'sub-machine-learning'}`}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:text-accent transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Roadmap
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">Study Module</span>
          </div>

          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-text-primary mb-4">
            {currentContent.title}
          </h1>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 whitespace-pre-line">
            {currentContent.content}
          </div>

          {currentContent.codeSnippet && (
            <div className="mt-6 border border-border bg-background/80 relative">
              <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-panel/50">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-accent" />
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Reference Source Code</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="text-text-muted hover:text-text-primary p-1 border border-transparent hover:border-border transition"
                >
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <pre className="p-4 font-mono text-xs overflow-x-auto text-accent/90">
                <code>{currentContent.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Resources references */}
          <div className="mt-8 border-t border-border pt-6">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted block mb-3">Academic References</span>
            <div className="grid gap-2">
              <div className="border border-border bg-background p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="text-xs font-mono uppercase text-text-primary">Syllabus_PDF.pdf</span>
                </div>
                <span className="font-mono text-[9px] text-text-muted">Page 6-12</span>
              </div>
              <div className="border border-border bg-background p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="text-xs font-mono uppercase text-text-primary">LectureNotes_Unit1.docx</span>
                </div>
                <span className="font-mono text-[9px] text-text-muted">Page 2-5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Quiz CTA bar */}
        <div className="border-t border-border pt-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
            <Award className="h-4 w-4 text-accent" />
            <span>Ready for assessment? Topic Quiz rewards up to 100 XP.</span>
          </div>
          <Button asChild variant="primary" className="w-full sm:w-auto px-6">
            <Link to={`/student/subjects/${subjectId || 'sub-machine-learning'}/topic/${topicId || 'topic-gradient-descent'}/quiz`}>
              START CHECKPOINT QUIZ
            </Link>
          </Button>
        </div>
      </section>

      {/* RIGHT COLUMN: AI Chat Sidebar (IDE style) */}
      <section className="flex flex-col border border-border bg-panel h-full overflow-hidden">
        {/* IDE Header */}
        <div className="border-b border-border px-4 py-3 bg-background/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
            <span className="font-mono text-xs uppercase tracking-wider text-text-primary">AI Coprocessor Sandbox</span>
          </div>
          <span className="font-mono text-[9px] text-text-muted">SYSTEM INTERFACE: ONLINE</span>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar">
          <AnimatePresence>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col gap-1.5 max-w-[85%] ${
                  m.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 text-xs leading-relaxed border ${
                    m.role === 'user'
                      ? 'border-accent/20 bg-accent/5 text-text-primary'
                      : 'border-border bg-background text-text-secondary'
                  }`}
                >
                  <p>{m.content}</p>
                </div>

                {/* Citations references */}
                {m.citations && m.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {m.citations.map((c, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1 border border-border bg-background/80 px-2 py-0.5 font-mono text-[9px] text-text-muted uppercase hover:text-accent hover:border-accent transition cursor-pointer"
                      >
                        <LinkIcon className="h-2.5 w-2.5" />
                        {c.docName}:L{c.page}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <div className="mr-auto max-w-[85%] flex items-center gap-2 border border-border bg-background p-3 text-xs text-text-muted font-mono uppercase tracking-wider">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                Querying pinecone index...
              </div>
            )}
          </AnimatePresence>
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Console */}
        <form onSubmit={handleSendMessage} className="border-t border-border p-3 bg-background/50 flex gap-2">
          <input
            type="text"
            placeholder="Query semantic memory stack or ask a concept question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 h-10 border border-border bg-panel px-3 text-xs text-text-primary placeholder:text-text-muted transition focus:border-accent focus:outline-none"
            disabled={thinking}
          />
          <Button type="submit" variant="primary" className="h-10 px-4" disabled={thinking}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </section>
    </div>
  )
}
