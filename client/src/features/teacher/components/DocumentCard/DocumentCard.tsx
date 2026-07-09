import { Download, Eye, RefreshCw, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SubjectDocument } from '../../types/teacher.types'

export default function DocumentCard({ document }: { document: SubjectDocument }) {
  return (
    <article className="tech-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{document.type}</p>
          <h3 className="mt-2 truncate text-base font-medium text-text-primary">{document.name}</h3>
          <p className="mt-2 text-sm text-text-secondary">{document.size} / {document.updatedAt}</p>
        </div>
        <span className="border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
          {document.status}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="icon" variant="secondary" aria-label={`Preview ${document.name}`}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" aria-label={`Download ${document.name}`}>
          <Download className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" aria-label={`Replace ${document.name}`}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" aria-label="Upload new document">
          <Upload className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="danger" aria-label={`Delete ${document.name}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  )
}
