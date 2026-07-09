import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTeacherSubject,
  getSubjectWorkspace,
  getTeacherAnalytics,
  getTeacherDashboard,
  getTeacherSubject,
  getTeacherSubjects,
  saveRoadmap,
} from '../api/teacher.api'
import type { CreateSubjectPayload, RoadmapUnit, TeacherSubject } from '../types/teacher.types'

export const teacherKeys = {
  dashboard: ['teacher', 'dashboard'] as const,
  subjects: ['teacher', 'subjects'] as const,
  subject: (subjectId: string | undefined) => ['teacher', 'subject', subjectId] as const,
  workspace: (subjectId: string | undefined) => ['teacher', 'workspace', subjectId] as const,
  analytics: ['teacher', 'analytics'] as const,
}

export function useTeacherDashboard() {
  return useQuery({ queryKey: teacherKeys.dashboard, queryFn: getTeacherDashboard })
}

export function useTeacherSubjects() {
  return useQuery({ queryKey: teacherKeys.subjects, queryFn: getTeacherSubjects })
}

export function useTeacherSubject(subjectId: string | undefined) {
  return useQuery({ queryKey: teacherKeys.subject(subjectId), queryFn: () => getTeacherSubject(subjectId) })
}

export function useSubjectWorkspace(subjectId: string | undefined) {
  return useQuery({ queryKey: teacherKeys.workspace(subjectId), queryFn: getSubjectWorkspace })
}

export function useTeacherAnalytics() {
  return useQuery({ queryKey: teacherKeys.analytics, queryFn: getTeacherAnalytics })
}

export function useCreateTeacherSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => createTeacherSubject(payload),
    onSuccess: (subject) => {
      queryClient.setQueryData<TeacherSubject[]>(teacherKeys.subjects, (current = []) => [subject, ...current])
    },
  })
}

export function useSaveRoadmap(subjectId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roadmap: RoadmapUnit[]) => saveRoadmap(roadmap),
    onMutate: async (roadmap) => {
      await queryClient.cancelQueries({ queryKey: teacherKeys.workspace(subjectId) })
      const previous = queryClient.getQueryData<{ roadmap: RoadmapUnit[] }>(teacherKeys.workspace(subjectId))
      queryClient.setQueryData(teacherKeys.workspace(subjectId), (current: { roadmap: RoadmapUnit[] } | undefined) => ({
        ...current,
        roadmap,
      }))
      return { previous }
    },
    onError: (_error, _roadmap, context) => {
      if (context?.previous) {
        queryClient.setQueryData(teacherKeys.workspace(subjectId), context.previous)
      }
    },
  })
}
