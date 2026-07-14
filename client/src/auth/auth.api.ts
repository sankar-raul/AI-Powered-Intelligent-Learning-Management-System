import { get, post } from '@/api/apiMethod'

export interface LoginPayload {
  email: string
  password: string
  role?: 'student' | 'teacher'
}

export const login = async (payload: LoginPayload) => post('/auth/login', payload)

export const me = async () => get('/auth/me')
