import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// Auth & Toast imports
import { AuthProvider } from './auth/AuthContext'
import { ToastProvider } from './components/ui/toast'

// Teacher features
import TeacherAnalyticsPage from './features/teacher/pages/Analytics/TeacherAnalyticsPage'
import CreateSubjectPage from './features/teacher/pages/CreateSubject/CreateSubjectPage'
import DashboardPage from './features/teacher/pages/Dashboard/DashboardPage'
import SettingsPage from './features/teacher/pages/Settings/SettingsPage'
import SubjectDetailsPage from './features/teacher/pages/SubjectDetails/SubjectDetailsPage'
import SubjectsPage from './features/teacher/pages/Subjects/SubjectsPage'
import TeacherLayout from './features/teacher/components/layout/TeacherLayout'

// Student & Common features
import LandingPage from './features/student/pages/LandingPage'
import LoginPage from './features/auth/pages/LoginPage'
import StudentLayout from './features/student/components/layout/StudentLayout'
import StudentDashboard from './features/student/pages/Dashboard/StudentDashboard'
import ExploreSubjects from './features/student/pages/Explore/ExploreSubjects'
import StudentSubjectDetails from './features/student/pages/SubjectDetails/StudentSubjectDetails'
import TopicStudyPage from './features/student/pages/Topic/TopicStudyPage'
import QuizPage from './features/student/pages/Quiz/QuizPage'
import ProgressPage from './features/student/pages/Progress/ProgressPage'
import ProfilePage from './features/student/pages/Profile/ProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 4,
      retry: 1,
    },
  },
})

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="min-h-screen flex flex-col"
      >
        <Routes location={location}>
          {/* Landing & Authentication */}
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />

          {/* Student Portal */}
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/explore" element={<ExploreSubjects />} />
            <Route path="/student/subjects" element={<ExploreSubjects />} />
            <Route path="/student/subjects/:subjectId" element={<StudentSubjectDetails />} />
            <Route path="/student/subjects/:subjectId/topic/:topicId" element={<TopicStudyPage />} />
            <Route path="/student/subjects/:subjectId/topic/:topicId/quiz" element={<QuizPage />} />
            <Route path="/student/progress" element={<ProgressPage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
          </Route>

          {/* Teacher Portal */}
          <Route element={<TeacherLayout />}>
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="/teacher/dashboard" element={<DashboardPage />} />
            <Route path="/teacher/subjects" element={<SubjectsPage />} />
            <Route path="/teacher/subjects/create" element={<CreateSubjectPage />} />
            <Route path="/teacher/subjects/processing/:subjectId" element={<CreateSubjectPage mode="processing" />} />
            <Route path="/teacher/subjects/:subjectId" element={<SubjectDetailsPage />} />
            <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
            <Route path="/teacher/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
