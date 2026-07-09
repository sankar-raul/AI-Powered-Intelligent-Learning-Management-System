import type { LucideIcon } from 'lucide-react'

export type SubjectStatus = 'Draft' | 'Processing' | 'Ready' | 'Published' | 'Failed'
export type Difficulty = 'Foundation' | 'Intermediate' | 'Advanced'
export type ViewMode = 'grid' | 'list'

export interface TeacherSubject {
  id: string
  name: string
  department: string
  semester: string
  description: string
  studentsEnrolled: number
  progress: number
  status: SubjectStatus
  createdDate: string
  lastUpdated: string
  difficulty: Difficulty
}

export interface DashboardMetric {
  id: string
  label: string
  value: number
  delta: string
  icon: LucideIcon
}

export interface UploadRecord {
  id: string
  fileName: string
  type: DocumentType
  subject: string
  uploadedAt: string
  size: string
}

export interface AiJob {
  id: string
  subject: string
  task: string
  status: SubjectStatus
  progress: number
  updatedAt: string
}

export interface RoadmapTopic {
  id: string
  title: string
  difficulty: Difficulty
  estimatedTime: string
  description: string
}

export interface RoadmapUnit {
  id: string
  title: string
  description: string
  estimatedTime: string
  difficulty: Difficulty
  topics: RoadmapTopic[]
}

export type DocumentType = 'Syllabus' | 'Notes' | 'Slides' | 'Assignments'

export interface SubjectDocument {
  id: string
  name: string
  type: DocumentType
  size: string
  updatedAt: string
  status: 'Indexed' | 'Queued' | 'Failed'
}

export interface StudentProgress {
  id: string
  name: string
  email: string
  progress: number
  quizScore: number
  completion: number
  lastActive: string
}

export interface ChartPoint {
  name: string
  value: number
}

export interface ActivityPoint {
  day: string
  active: number
  completed: number
}

export interface CreateSubjectPayload {
  subjectName: string
  department: string
  semester: string
  description: string
  difficulty: Difficulty
  thumbnail?: FileList
  syllabus?: FileList
  lectureNotes?: FileList
}
