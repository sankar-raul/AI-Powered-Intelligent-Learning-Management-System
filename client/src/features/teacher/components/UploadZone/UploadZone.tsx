import { FileUp, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  label: string
  required?: boolean
  accept?: string
  multiple?: boolean
  files?: FileList
  onFiles: (files: FileList) => void
}

export default function UploadZone({ label, required, accept, multiple, files, onFiles }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const selectedFiles = files ? Array.from(files) : []

  return (
    <div
      className={cn(
        'tech-panel p-5 transition',
        isDragging ? 'border-accent bg-accent/5' : 'hover:border-border-strong',
      )}
      onDragEnter={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        if (event.dataTransfer.files.length) {
          onFiles(event.dataTransfer.files)
        }
      }}
    >
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          if (event.target.files) onFiles(event.target.files)
        }}
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="border border-border bg-background p-3 text-accent">
            <FileUp className="h-5 w-5" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-primary">
              {label} {required ? <span className="text-accent">Required</span> : <span className="text-text-muted">Optional</span>}
            </p>
            <p className="mt-2 text-sm text-text-secondary">Drag files here or open the system picker. PDF, PPT, DOCX, and images are validated before processing.</p>
          </div>
        </div>
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          Select Files
        </Button>
      </div>

      {selectedFiles.length ? (
        <div className="mt-5 grid gap-2">
          {selectedFiles.map((file) => (
            <div key={`${file.name}-${file.size}`} className="flex items-center justify-between border border-border bg-background px-3 py-2">
              <span className="truncate text-sm text-text-primary">{file.name}</span>
              <span className="font-mono text-xs text-text-muted">{Math.max(file.size / 1024 / 1024, 0.01).toFixed(2)} MB</span>
            </div>
          ))}
          <div className="h-2 border border-border bg-background">
            <div className="h-full w-9/12 bg-accent" />
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2 text-xs text-text-muted">
          <X className="h-3.5 w-3.5" />
          No files staged
        </div>
      )}
    </div>
  )
}
