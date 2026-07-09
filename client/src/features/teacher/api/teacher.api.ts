import { post } from '@/api/apiMethod'
import {
  completionData,
  dashboardMetrics,
  difficultTopics,
  quizScoreData,
  recentAiJobs,
  recentUploads,
  roadmapUnits,
  studentActivity,
  students,
  subjectDocuments,
  teacherSubjects,
} from './teacher.fixtures'
import type { CreateSubjectPayload, RoadmapUnit, TeacherSubject } from '../types/teacher.types'

const wait = (ms = 420) => new Promise((resolve) => window.setTimeout(resolve, ms))

export async function getTeacherDashboard() {
  await wait()
  return {
    metrics: dashboardMetrics,
    recentUploads,
    recentAiJobs,
  }
}

export async function getTeacherSubjects() {
  await wait()
  return teacherSubjects
}

export async function getTeacherSubject(subjectId: string | undefined) {
  await wait(260)
  return teacherSubjects.find((subject) => subject.id === subjectId) ?? teacherSubjects[0]
}

export async function getSubjectWorkspace() {
  await wait(320)
  return {
    roadmap: roadmapUnits,
    documents: subjectDocuments,
    students,
  }
}

export async function getTeacherAnalytics() {
  await wait(350)
  return {
    completionData,
    quizScoreData,
    difficultTopics,
    studentActivity,
    aiQuestions: [
      'Explain backpropagation with a small network',
      'Difference between 2PL and timestamp ordering',
      'How does paging avoid fragmentation?',
      'What is attention masking?',
    ],
  }
}

export async function createTeacherSubject(payload: CreateSubjectPayload) {
  const formData = new FormData()
  formData.append('title', payload.subjectName)
  formData.append('description', payload.description)
  
  // Map difficulty to backend SUBJECT_DIFFICULTIES: "basic", "intermidiate", "advanced", "pro"
  let difficultyMapped = 'intermidiate'
  if (payload.difficulty === 'Foundation') {
    difficultyMapped = 'basic'
  } else if (payload.difficulty === 'Advanced') {
    difficultyMapped = 'advanced'
  }
  
  formData.append('difficulty', difficultyMapped)

  if (payload.syllabus && payload.syllabus.length > 0) {
    formData.append('syllabus', payload.syllabus[0])
  }

  if (payload.lectureNotes && payload.lectureNotes.length > 0) {
    for (let i = 0; i < payload.lectureNotes.length; i++) {
      formData.append('notes', payload.lectureNotes[i])
    }
  }

  if (payload.thumbnail && payload.thumbnail.length > 0) {
    formData.append('thumbnail', payload.thumbnail[0].name || '')
  }

  try {
    const res = await post('/subject/create', formData)
    if (res && res.subject) {
      const s = res.subject
      let clientDiff: 'Foundation' | 'Intermediate' | 'Advanced' = 'Intermediate'
      if (s.difficulty === 'basic') {
        clientDiff = 'Foundation'
      } else if (s.difficulty === 'advanced') {
        clientDiff = 'Advanced'
      }

      const newSubject: TeacherSubject = {
        id: s._id || s.id || `sub-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: s.title,
        department: payload.department,
        semester: payload.semester,
        description: s.description,
        studentsEnrolled: 0,
        progress: 0,
        status: 'Processing',
        createdDate: s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        lastUpdated: new Date().toISOString().slice(0, 10),
        difficulty: clientDiff,
      }

      // Add to mock subject list so it persists locally during this session
      teacherSubjects.unshift(newSubject)
      return newSubject
    }
  } catch (error) {
    console.error('Error connecting to backend API /subject/create. Falling back to mock creation.', error)
  }

  // Fallback to local creation in case server endpoint fails
  await wait(500)
  const fallbackSubject: TeacherSubject = {
    id: `sub-${payload.subjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: payload.subjectName,
    department: payload.department,
    semester: payload.semester,
    description: payload.description,
    studentsEnrolled: 0,
    progress: 3,
    status: 'Processing',
    createdDate: new Date().toISOString().slice(0, 10),
    lastUpdated: new Date().toISOString().slice(0, 10),
    difficulty: payload.difficulty,
  }
  teacherSubjects.unshift(fallbackSubject)
  return fallbackSubject
}

export async function saveRoadmap(nextRoadmap: RoadmapUnit[]) {
  await wait(500)
  return nextRoadmap
}
