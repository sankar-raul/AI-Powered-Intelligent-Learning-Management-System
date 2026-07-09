import { z } from 'zod'

const fileListSchema = z.custom<FileList>((value) => value instanceof FileList)

export const createSubjectSchema = z.object({
  subjectName: z.string().min(3, 'Subject name must be at least 3 characters'),
  department: z.string().min(2, 'Department is required'),
  semester: z.string().min(1, 'Semester is required'),
  description: z.string().min(24, 'Description should explain the subject scope'),
  difficulty: z.enum(['Foundation', 'Intermediate', 'Advanced']),
  thumbnail: fileListSchema.optional(),
  syllabus: fileListSchema.refine((files) => files.length > 0, 'Syllabus PDF is required'),
  lectureNotes: fileListSchema.optional(),
})

export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>
