import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Image, UploadCloud } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FieldLabel, Input, Textarea } from '@/components/ui/input'
import ProcessingTimeline from '../../components/ProcessingTimeline/ProcessingTimeline'
import UploadZone from '../../components/UploadZone/UploadZone'
import { useCreateTeacherSubject } from '../../hooks/useTeacherQueries'
import { createSubjectSchema, type CreateSubjectFormData } from '../../schemas/createSubject.schema'

const steps = ['Basic Information', 'Upload Files', 'Review']

export default function CreateSubjectPage({ mode }: { mode?: 'processing' }) {
  const navigate = useNavigate()
  const createMutation = useCreateTeacherSubject()
  const [step, setStep] = useState(0)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateSubjectFormData>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      difficulty: 'Intermediate',
    },
  })

  const values = useWatch({ control })

  if (mode === 'processing') {
    return <ProcessingTimeline />
  }

  const nextStep = async () => {
    const valid = step === 0 ? await trigger(['subjectName', 'department', 'semester', 'description', 'difficulty']) : await trigger(['syllabus'])
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const onSubmit = async (payload: CreateSubjectFormData) => {
    const subject = await createMutation.mutateAsync(payload)
    navigate(`/teacher/subjects/processing/${subject.id}`)
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      <section className="corner-frame border border-border bg-panel p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Create Subject</p>
        <h1 className="mt-3 font-display text-5xl font-semibold uppercase leading-none tracking-normal">AI-assisted subject builder</h1>
        <p className="mt-4 max-w-3xl text-sm text-text-secondary">
          Define the academic shell, upload source documents, then let the AI pipeline generate roadmap, summaries, quizzes, flashcards, and retrieval chunks.
        </p>
      </section>

      <nav className="grid gap-2 md:grid-cols-3">
        {steps.map((item, index) => (
          <button
            key={item}
            type="button"
            className={index === step ? 'border border-accent bg-accent px-4 py-3 text-left text-background' : 'border border-border bg-panel px-4 py-3 text-left text-text-secondary'}
            onClick={() => setStep(index)}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Step {index + 1}</span>
            <span className="mt-1 block text-sm font-medium uppercase tracking-[0.08em]">{item}</span>
          </button>
        ))}
      </nav>

      <section className="tech-panel p-5 md:p-6">
        {step === 0 ? (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldLabel label="Subject Name" error={errors.subjectName?.message}>
                <Input placeholder="Neural Networks" {...register('subjectName')} />
              </FieldLabel>
              <FieldLabel label="Department" error={errors.department?.message}>
                <Input placeholder="Computer Science" {...register('department')} />
              </FieldLabel>
              <FieldLabel label="Semester" error={errors.semester?.message}>
                <Input placeholder="Semester 6" {...register('semester')} />
              </FieldLabel>
              <FieldLabel label="Difficulty" error={errors.difficulty?.message}>
                <select className="mechanical-focus h-11 border border-border bg-background px-3 text-sm text-text-primary" {...register('difficulty')}>
                  <option>Foundation</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </FieldLabel>
            </div>
            <FieldLabel label="Description" error={errors.description?.message}>
              <Textarea placeholder="Describe scope, units, outcomes, and assessment intent." {...register('description')} />
            </FieldLabel>
            <UploadZone label="Thumbnail" accept="image/*" files={values.thumbnail} onFiles={(files) => setValue('thumbnail', files)} />
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4">
            <UploadZone label="Syllabus PDF" required accept="application/pdf" files={values.syllabus} onFiles={(files) => setValue('syllabus', files, { shouldValidate: true })} />
            {errors.syllabus?.message ? <p className="text-sm text-danger">{errors.syllabus.message}</p> : null}
            <UploadZone
              label="Lecture Notes / PPT / DOCX / Images"
              accept=".pdf,.ppt,.pptx,.doc,.docx,image/*"
              multiple
              files={values.lectureNotes}
              onFiles={(files) => setValue('lectureNotes', files)}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4">
            <ReviewRow icon={<FileText className="h-4 w-4" />} label="Subject" value={values.subjectName || 'Not specified'} />
            <ReviewRow icon={<CheckCircle2 className="h-4 w-4" />} label="Department" value={`${values.department || 'Department'} / ${values.semester || 'Semester'}`} />
            <ReviewRow icon={<UploadCloud className="h-4 w-4" />} label="Syllabus" value={values.syllabus?.[0]?.name || 'Missing'} />
            <ReviewRow icon={<Image className="h-4 w-4" />} label="Additional Files" value={`${values.lectureNotes?.length ?? 0} files staged`} />
          </div>
        ) : null}
      </section>

      <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-between">
        <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" variant="primary" onClick={nextStep}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" variant="primary" disabled={createMutation.isPending}>
            <CheckCircle2 className="h-4 w-4" />
            {createMutation.isPending ? 'Creating' : 'Create Subject'}
          </Button>
        )}
      </div>
    </form>
  )
}

function ReviewRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="grid gap-3 border border-border bg-background p-4 md:grid-cols-[32px_180px_1fr] md:items-center">
      <span className="text-accent">{icon}</span>
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">{label}</span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  )
}
