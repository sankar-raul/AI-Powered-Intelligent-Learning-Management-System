import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Role = 'teacher' | 'student' | 'admin'

type User = {
  userId: string
  name: string
  email: string
  role: Role
}

type Subject = {
  _id: string
  title: string
  description: string
  difficulty: string
  teacher_id: string
}

type TopicState = {
  topicId: string
  title: string
  description: string
  unitTitle: string
  isUnlocked: boolean
  isCompleted: boolean
  isStudied: boolean
}

type TopicDetail = {
  topicId: string
  isUnlocked: boolean
  isCompleted: boolean
  isStudied: boolean
  materials: { _id: string; title: string; description: string; fileUrl: string; type: string }[]
  quizStatus: { attempted: boolean; score?: number; passed?: boolean }
  hasQuiz: boolean
  quizId: string | null
  chatMessages: { role: 'user' | 'system'; content: string; timestamp: string }[]
}

type Quiz = {
  _id: string
  title: string
  passThreshold: number
  questions: { question: string; options: string[] }[]
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8080/api'
const TOKEN_KEY = 'lms_token'

const api = async <T,>(path: string, method = 'GET', token?: string, body?: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? 'Request failed')
  }

  return data as T
}

function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'student' as Role })

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [roadmapTopics, setRoadmapTopics] = useState<TopicState[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState<string>('')
  const [topicDetail, setTopicDetail] = useState<TopicDetail | null>(null)
  const [progress, setProgress] = useState<{ progress: number; completedTopics: number; totalTopics: number } | null>(null)

  const [teacherSubjectForm, setTeacherSubjectForm] = useState({
    title: '',
    description: '',
    difficulty: 'basic',
    thumbnail: '',
  })
  const [teacherRoadmapJson, setTeacherRoadmapJson] = useState(
    JSON.stringify(
      [
        {
          title: 'Unit 1',
          order: 1,
          topics: [{ title: 'Topic 1', description: 'Intro topic', order: 1 }],
        },
      ],
      null,
      2,
    ),
  )
  const [teacherQuizJson, setTeacherQuizJson] = useState(
    JSON.stringify(
      {
        topicId: '',
        title: 'Topic Quiz',
        passThreshold: 60,
        questions: [
          {
            question: 'Sample question',
            options: ['A', 'B', 'C', 'D'],
            answer: 'A',
            explanation: 'Sample explanation',
          },
        ],
      },
      null,
      2,
    ),
  )
  const [teacherMaterialJson, setTeacherMaterialJson] = useState(
    JSON.stringify(
      {
        topicId: '',
        title: 'Topic Notes',
        description: 'Short note',
        type: 'pdf',
        fileUrl: 'https://example.com/note.pdf',
      },
      null,
      2,
    ),
  )

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [aiQuestion, setAiQuestion] = useState('')

  const isTeacher = useMemo(() => user?.role === 'teacher' || user?.role === 'admin', [user])

  const loadMe = async (authToken: string) => {
    const response = await api<{ user: User }>('/auth/me', 'GET', authToken)
    setUser(response.user)
  }

  const loadSubjects = async (authToken: string, role: Role) => {
    const path = role === 'student' ? '/student/subjects' : '/teacher/subjects'
    const list = await api<Subject[]>(path, 'GET', authToken)
    setSubjects(list)
  }

  useEffect(() => {
    const init = async () => {
      if (!token) return
      try {
        setLoading(true)
        await loadMe(token)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    void init()
  }, [token])

  useEffect(() => {
    const refresh = async () => {
      if (!token || !user) return
      try {
        await loadSubjects(token, user.role)
      } catch (e) {
        setError((e as Error).message)
      }
    }

    void refresh()
  }, [token, user])

  const onAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      setLoading(true)
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload =
        mode === 'login'
          ? { email: authForm.email, password: authForm.password }
          : authForm
      const response = await api<{ token: string }>(endpoint, 'POST', undefined, payload)
      localStorage.setItem(TOKEN_KEY, response.token)
      setToken(response.token)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setSubjects([])
    setSelectedSubjectId('')
    setRoadmapTopics([])
    setSelectedTopicId('')
    setTopicDetail(null)
    setProgress(null)
    setQuiz(null)
    setQuizAnswers({})
  }

  const enroll = async (subjectId: string) => {
    if (!token) return
    setError('')
    try {
      await api(`/student/subjects/${subjectId}/enroll`, 'POST', token)
      setSelectedSubjectId(subjectId)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const loadRoadmap = async (subjectId: string) => {
    if (!token) return
    setError('')
    try {
      const response = await api<{ topics: TopicState[] }>(`/student/subjects/${subjectId}/roadmap`, 'GET', token)
      setSelectedSubjectId(subjectId)
      setRoadmapTopics(response.topics)
      setSelectedTopicId('')
      setTopicDetail(null)
      setQuiz(null)
      setQuizAnswers({})
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const loadTopic = async (subjectId: string, topicId: string) => {
    if (!token) return
    setError('')
    try {
      const response = await api<TopicDetail>(`/student/subjects/${subjectId}/topics/${topicId}`, 'GET', token)
      setSelectedTopicId(topicId)
      setTopicDetail(response)

      if (response.quizId) {
        const teacherQuizzes = await api<Quiz[]>(`/teacher/subjects/${subjectId}/quizzes?topicId=${topicId}`, 'GET', token)
        setQuiz(teacherQuizzes.find((item) => item._id === response.quizId) ?? null)
      } else {
        setQuiz(null)
      }
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const markStudied = async () => {
    if (!token || !selectedSubjectId || !selectedTopicId) return
    setError('')
    try {
      await api(`/student/subjects/${selectedSubjectId}/topics/${selectedTopicId}/study`, 'POST', token)
      await loadRoadmap(selectedSubjectId)
      await loadTopic(selectedSubjectId, selectedTopicId)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const submitQuiz = async () => {
    if (!token || !quiz?._id || !selectedSubjectId) return
    setError('')
    try {
      const answers = quiz.questions.map((_, index) => quizAnswers[index] ?? '')
      await api(`/student/quizzes/${quiz._id}/attempt`, 'POST', token, { answers })
      await loadRoadmap(selectedSubjectId)
      if (selectedTopicId) {
        await loadTopic(selectedSubjectId, selectedTopicId)
      }
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const askAi = async () => {
    if (!token || !selectedSubjectId || !selectedTopicId || !aiQuestion.trim()) return
    setError('')
    try {
      await api(
        `/student/subjects/${selectedSubjectId}/topics/${selectedTopicId}/ask-ai`,
        'POST',
        token,
        { question: aiQuestion },
      )
      setAiQuestion('')
      await loadTopic(selectedSubjectId, selectedTopicId)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const loadProgress = async (subjectId: string) => {
    if (!token) return
    setError('')
    try {
      const response = await api<{ progress: number; completedTopics: number; totalTopics: number }>(
        `/student/enrollments/${subjectId}/progress`,
        'GET',
        token,
      )
      setProgress(response)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const createTeacherSubject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return
    setError('')
    try {
      await api('/teacher/subjects', 'POST', token, teacherSubjectForm)
      await loadSubjects(token, user?.role ?? 'teacher')
      setTeacherSubjectForm({ title: '', description: '', difficulty: 'basic', thumbnail: '' })
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const saveRoadmap = async () => {
    if (!token || !selectedSubjectId) return
    setError('')
    try {
      await api(`/teacher/subjects/${selectedSubjectId}/roadmap`, 'PUT', token, {
        units: JSON.parse(teacherRoadmapJson) as unknown,
      })
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const addQuiz = async () => {
    if (!token || !selectedSubjectId) return
    setError('')
    try {
      await api(`/teacher/subjects/${selectedSubjectId}/quizzes`, 'POST', token, JSON.parse(teacherQuizJson) as unknown)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const addMaterial = async () => {
    if (!token || !selectedSubjectId) return
    setError('')
    try {
      await api(`/teacher/subjects/${selectedSubjectId}/materials`, 'POST', token, JSON.parse(teacherMaterialJson) as unknown)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  if (!token || !user) {
    return (
      <main className="container">
        <h1>AI-Powered LMS</h1>
        <p className="subtitle">Teacher and student MVP flow with roadmap, quizzes, progress, and Ask AI.</p>
        <form className="panel" onSubmit={onAuthSubmit}>
          <div className="row">
            <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? 'active' : ''}>Login</button>
            <button type="button" onClick={() => setMode('register')} className={mode === 'register' ? 'active' : ''}>Register</button>
          </div>

          {mode === 'register' && (
            <input
              value={authForm.name}
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              placeholder="Name"
              required
            />
          )}

          <input
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            placeholder="Email"
            type="email"
            required
          />

          <input
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            placeholder="Password"
            type="password"
            required
          />

          {mode === 'register' && (
            <select
              value={authForm.role}
              onChange={(e) => setAuthForm({ ...authForm, role: e.target.value as Role })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          )}

          <button type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}</button>
        </form>
        {error && <p className="error">{error}</p>}
      </main>
    )
  }

  return (
    <main className="container">
      <header className="header">
        <div>
          <h1>AI-Powered LMS</h1>
          <p className="subtitle">Logged in as {user.name} ({user.role})</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="panel">
        <h2>{isTeacher ? 'Teacher Subject Management' : 'Student Subject List'}</h2>
        <ul className="subjectList">
          {subjects.map((subject) => (
            <li key={subject._id}>
              <h3>{subject.title}</h3>
              <p>{subject.description}</p>
              <small>{subject.difficulty}</small>
              <div className="row">
                {isTeacher ? (
                  <button onClick={() => setSelectedSubjectId(subject._id)}>Manage</button>
                ) : (
                  <>
                    <button onClick={() => void enroll(subject._id)}>Enroll</button>
                    <button onClick={() => void loadRoadmap(subject._id)}>Roadmap</button>
                    <button onClick={() => void loadProgress(subject._id)}>Progress</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {isTeacher && (
        <>
          <section className="panel">
            <h2>Create Subject</h2>
            <form className="grid" onSubmit={createTeacherSubject}>
              <input
                value={teacherSubjectForm.title}
                onChange={(e) => setTeacherSubjectForm({ ...teacherSubjectForm, title: e.target.value })}
                placeholder="Subject title"
                required
              />
              <input
                value={teacherSubjectForm.description}
                onChange={(e) => setTeacherSubjectForm({ ...teacherSubjectForm, description: e.target.value })}
                placeholder="Description"
                required
              />
              <select
                value={teacherSubjectForm.difficulty}
                onChange={(e) => setTeacherSubjectForm({ ...teacherSubjectForm, difficulty: e.target.value })}
              >
                <option value="basic">basic</option>
                <option value="intermidiate">intermidiate</option>
                <option value="advanced">advanced</option>
                <option value="pro">pro</option>
              </select>
              <input
                value={teacherSubjectForm.thumbnail}
                onChange={(e) => setTeacherSubjectForm({ ...teacherSubjectForm, thumbnail: e.target.value })}
                placeholder="Thumbnail URL (optional)"
              />
              <button type="submit">Create Subject</button>
            </form>
          </section>

          {selectedSubjectId && (
            <>
              <section className="panel">
                <h2>Roadmap JSON</h2>
                <textarea value={teacherRoadmapJson} onChange={(e) => setTeacherRoadmapJson(e.target.value)} rows={10} />
                <button onClick={() => void saveRoadmap()}>Save Roadmap</button>
              </section>

              <section className="panel">
                <h2>Material JSON</h2>
                <textarea value={teacherMaterialJson} onChange={(e) => setTeacherMaterialJson(e.target.value)} rows={8} />
                <button onClick={() => void addMaterial()}>Add Material</button>
              </section>

              <section className="panel">
                <h2>Quiz JSON</h2>
                <textarea value={teacherQuizJson} onChange={(e) => setTeacherQuizJson(e.target.value)} rows={10} />
                <button onClick={() => void addQuiz()}>Add Quiz</button>
              </section>
            </>
          )}
        </>
      )}

      {!isTeacher && selectedSubjectId && (
        <>
          <section className="panel">
            <h2>Roadmap Topic States</h2>
            <ul className="topicList">
              {roadmapTopics.map((topic) => (
                <li key={topic.topicId}>
                  <div>
                    <strong>{topic.unitTitle} → {topic.title}</strong>
                    <p>{topic.description}</p>
                    <small>
                      {topic.isUnlocked ? 'Unlocked' : 'Locked'} | {topic.isStudied ? 'Studied' : 'Not studied'} | {topic.isCompleted ? 'Completed' : 'Incomplete'}
                    </small>
                  </div>
                  <button disabled={!topic.isUnlocked} onClick={() => void loadTopic(selectedSubjectId, topic.topicId)}>Open</button>
                </li>
              ))}
            </ul>
          </section>

          {topicDetail && (
            <section className="panel">
              <h2>Topic Detail</h2>
              <p>Status: {topicDetail.isCompleted ? 'Completed' : 'In progress'}</p>
              <button onClick={() => void markStudied()}>Mark Studied</button>

              <h3>Materials</h3>
              <ul>
                {topicDetail.materials.map((material) => (
                  <li key={material._id}>
                    {material.title} ({material.type}) - <a href={material.fileUrl} target="_blank">open</a>
                  </li>
                ))}
              </ul>

              <h3>Ask AI</h3>
              <div className="row">
                <input value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="Ask about this topic" />
                <button onClick={() => void askAi()}>Ask</button>
              </div>
              <ul>
                {topicDetail.chatMessages.map((message, index) => (
                  <li key={`${message.timestamp}-${index}`}>
                    <strong>{message.role}:</strong> {message.content}
                  </li>
                ))}
              </ul>

              {topicDetail.hasQuiz && quiz && (
                <>
                  <h3>{quiz.title}</h3>
                  <p>Pass threshold: {quiz.passThreshold}%</p>
                  {quiz.questions.map((question, index) => (
                    <div key={question.question} className="quizQuestion">
                      <p>{index + 1}. {question.question}</p>
                      <select
                        value={quizAnswers[index] ?? ''}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, [index]: e.target.value })}
                      >
                        <option value="">Select answer</option>
                        {question.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button onClick={() => void submitQuiz()}>Submit Quiz</button>
                  {topicDetail.quizStatus.attempted && (
                    <p>
                      Last score: {topicDetail.quizStatus.score}% ({topicDetail.quizStatus.passed ? 'Passed' : 'Failed'})
                    </p>
                  )}
                </>
              )}
            </section>
          )}

          {progress && (
            <section className="panel">
              <h2>Progress Dashboard</h2>
              <p>{progress.progress}% complete</p>
              <p>{progress.completedTopics} / {progress.totalTopics} topics completed</p>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default App
