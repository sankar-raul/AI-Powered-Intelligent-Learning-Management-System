import {
  BrainCircuit,
  Cpu,
  GraduationCap,
  Layers3,
  UploadCloud,
} from 'lucide-react'
import type {
  ActivityPoint,
  AiJob,
  ChartPoint,
  DashboardMetric,
  RoadmapUnit,
  StudentProgress,
  SubjectDocument,
  TeacherSubject,
  UploadRecord,
} from '../types/teacher.types'

export const teacherSubjects: TeacherSubject[] = [
  {
    id: 'sub-neural-networks',
    name: 'Neural Networks',
    department: 'Computer Science',
    semester: 'Semester 6',
    description: 'Deep learning systems, backpropagation, optimization, CNNs, and transformer foundations.',
    studentsEnrolled: 184,
    progress: 92,
    status: 'Published',
    createdDate: '2026-06-01',
    lastUpdated: '2026-07-09',
    difficulty: 'Advanced',
  },
  {
    id: 'sub-dbms',
    name: 'Database Management Systems',
    department: 'Information Technology',
    semester: 'Semester 4',
    description: 'Relational design, normalization, indexing, transactions, query planning, and distributed data.',
    studentsEnrolled: 142,
    progress: 67,
    status: 'Ready',
    createdDate: '2026-06-11',
    lastUpdated: '2026-07-08',
    difficulty: 'Intermediate',
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    department: 'Computer Engineering',
    semester: 'Semester 5',
    description: 'Process scheduling, memory, file systems, concurrency, virtualization, and kernel architecture.',
    studentsEnrolled: 119,
    progress: 48,
    status: 'Processing',
    createdDate: '2026-07-04',
    lastUpdated: '2026-07-10',
    difficulty: 'Advanced',
  },
  {
    id: 'sub-dsa',
    name: 'Data Structures',
    department: 'Computer Science',
    semester: 'Semester 3',
    description: 'Algorithmic thinking through arrays, trees, graphs, hashing, heaps, and complexity analysis.',
    studentsEnrolled: 231,
    progress: 100,
    status: 'Published',
    createdDate: '2026-05-23',
    lastUpdated: '2026-07-06',
    difficulty: 'Foundation',
  },
  {
    id: 'sub-cloud',
    name: 'Cloud Native Systems',
    department: 'Information Technology',
    semester: 'Semester 7',
    description: 'Containers, orchestration, service meshes, telemetry, autoscaling, and resilient architecture.',
    studentsEnrolled: 76,
    progress: 12,
    status: 'Draft',
    createdDate: '2026-07-01',
    lastUpdated: '2026-07-02',
    difficulty: 'Intermediate',
  },
  {
    id: 'sub-compilers',
    name: 'Compiler Design',
    department: 'Computer Engineering',
    semester: 'Semester 6',
    description: 'Lexing, parsing, semantic analysis, intermediate representation, optimization, and codegen.',
    studentsEnrolled: 64,
    progress: 4,
    status: 'Failed',
    createdDate: '2026-06-27',
    lastUpdated: '2026-07-07',
    difficulty: 'Advanced',
  },
]

export const dashboardMetrics: DashboardMetric[] = [
  { id: 'total', label: 'Total Subjects', value: teacherSubjects.length, delta: '+2 this week', icon: Layers3 },
  {
    id: 'published',
    label: 'Published Subjects',
    value: teacherSubjects.filter((subject) => subject.status === 'Published').length,
    delta: 'enrollment live',
    icon: GraduationCap,
  },
  {
    id: 'processing',
    label: 'Processing Subjects',
    value: teacherSubjects.filter((subject) => subject.status === 'Processing').length,
    delta: 'AI pipeline active',
    icon: Cpu,
  },
  {
    id: 'students',
    label: 'Total Students',
    value: teacherSubjects.reduce((total, subject) => total + subject.studentsEnrolled, 0),
    delta: '+38 in 7 days',
    icon: BrainCircuit,
  },
]

export const recentUploads: UploadRecord[] = [
  { id: 'up-1', fileName: 'unit-4-transformers.pdf', type: 'Notes', subject: 'Neural Networks', uploadedAt: '12 min ago', size: '8.4 MB' },
  { id: 'up-2', fileName: 'dbms-syllabus.pdf', type: 'Syllabus', subject: 'DBMS', uploadedAt: '42 min ago', size: '1.2 MB' },
  { id: 'up-3', fileName: 'os-deadlocks.pptx', type: 'Slides', subject: 'Operating Systems', uploadedAt: '2 hr ago', size: '14.8 MB' },
]

export const recentAiJobs: AiJob[] = [
  { id: 'job-1', subject: 'Operating Systems', task: 'Generating quizzes', status: 'Processing', progress: 72, updatedAt: 'Live' },
  { id: 'job-2', subject: 'Database Management Systems', task: 'Roadmap ready for review', status: 'Ready', progress: 100, updatedAt: '8 min ago' },
  { id: 'job-3', subject: 'Compiler Design', task: 'Document extraction failed', status: 'Failed', progress: 18, updatedAt: '1 day ago' },
]

export const roadmapUnits: RoadmapUnit[] = [
  {
    id: 'unit-1',
    title: 'Unit 01: Learning System Foundations',
    description: 'Build intuition around model structure, data flow, training signals, and evaluation loops.',
    estimatedTime: '7h 30m',
    difficulty: 'Foundation',
    topics: [
      { id: 'topic-1', title: 'Perceptrons and activation functions', difficulty: 'Foundation', estimatedTime: '1h 20m', description: 'Core building blocks and nonlinear decision boundaries.' },
      { id: 'topic-2', title: 'Loss surfaces and gradient descent', difficulty: 'Intermediate', estimatedTime: '2h', description: 'How objective functions guide model updates.' },
      { id: 'topic-3', title: 'Backpropagation mechanics', difficulty: 'Advanced', estimatedTime: '2h 40m', description: 'Chain rule execution through layered architectures.' },
    ],
  },
  {
    id: 'unit-2',
    title: 'Unit 02: Representation Networks',
    description: 'Move from dense networks into convolutional, recurrent, and attention-based representations.',
    estimatedTime: '9h',
    difficulty: 'Advanced',
    topics: [
      { id: 'topic-4', title: 'CNN feature extraction', difficulty: 'Intermediate', estimatedTime: '2h', description: 'Filters, pooling, receptive fields, and transfer learning.' },
      { id: 'topic-5', title: 'Sequence modeling constraints', difficulty: 'Intermediate', estimatedTime: '2h 30m', description: 'RNN limitations, gated units, and long-context issues.' },
      { id: 'topic-6', title: 'Transformer attention blocks', difficulty: 'Advanced', estimatedTime: '3h', description: 'Scaled dot-product attention, heads, embeddings, and position signals.' },
    ],
  },
  {
    id: 'unit-3',
    title: 'Unit 03: Deployment and Evaluation',
    description: 'Translate trained models into monitored, useful AI systems for production environments.',
    estimatedTime: '6h',
    difficulty: 'Intermediate',
    topics: [
      { id: 'topic-7', title: 'Model evaluation protocol', difficulty: 'Foundation', estimatedTime: '1h 40m', description: 'Validation, leakage prevention, metrics, and failure analysis.' },
      { id: 'topic-8', title: 'Inference optimization', difficulty: 'Intermediate', estimatedTime: '2h 15m', description: 'Quantization, batching, caching, and latency tradeoffs.' },
      { id: 'topic-9', title: 'Monitoring model drift', difficulty: 'Advanced', estimatedTime: '2h', description: 'Detecting degradation and triggering regeneration workflows.' },
    ],
  },
]

export const subjectDocuments: SubjectDocument[] = [
  { id: 'doc-1', name: 'official-syllabus.pdf', type: 'Syllabus', size: '1.1 MB', updatedAt: '2026-07-09', status: 'Indexed' },
  { id: 'doc-2', name: 'module-1-notes.pdf', type: 'Notes', size: '6.8 MB', updatedAt: '2026-07-08', status: 'Indexed' },
  { id: 'doc-3', name: 'attention-lecture.pptx', type: 'Slides', size: '18.2 MB', updatedAt: '2026-07-07', status: 'Queued' },
  { id: 'doc-4', name: 'assignment-gradient-descent.docx', type: 'Assignments', size: '780 KB', updatedAt: '2026-07-05', status: 'Indexed' },
]

export const students: StudentProgress[] = [
  { id: 'stu-1', name: 'Aarav Mehta', email: 'aarav@college.edu', progress: 84, quizScore: 91, completion: 77, lastActive: '7 min ago' },
  { id: 'stu-2', name: 'Mira Shah', email: 'mira@college.edu', progress: 68, quizScore: 82, completion: 61, lastActive: '31 min ago' },
  { id: 'stu-3', name: 'Ishan Rao', email: 'ishan@college.edu', progress: 52, quizScore: 74, completion: 49, lastActive: '2 hr ago' },
  { id: 'stu-4', name: 'Naina Kapoor', email: 'naina@college.edu', progress: 93, quizScore: 96, completion: 90, lastActive: 'Today' },
  { id: 'stu-5', name: 'Kabir Sethi', email: 'kabir@college.edu', progress: 39, quizScore: 66, completion: 33, lastActive: 'Yesterday' },
]

export const completionData: ChartPoint[] = [
  { name: 'NN', value: 78 },
  { name: 'DBMS', value: 64 },
  { name: 'OS', value: 42 },
  { name: 'DSA', value: 88 },
  { name: 'Cloud', value: 28 },
]

export const quizScoreData: ChartPoint[] = [
  { name: 'Unit 1', value: 82 },
  { name: 'Unit 2', value: 74 },
  { name: 'Unit 3', value: 69 },
  { name: 'Unit 4', value: 86 },
]

export const difficultTopics: ChartPoint[] = [
  { name: 'Backpropagation', value: 46 },
  { name: 'Transactions', value: 34 },
  { name: 'Deadlocks', value: 29 },
  { name: 'Parsing', value: 22 },
]

export const studentActivity: ActivityPoint[] = [
  { day: 'Mon', active: 124, completed: 48 },
  { day: 'Tue', active: 148, completed: 59 },
  { day: 'Wed', active: 171, completed: 72 },
  { day: 'Thu', active: 156, completed: 64 },
  { day: 'Fri', active: 188, completed: 83 },
  { day: 'Sat', active: 97, completed: 41 },
  { day: 'Sun', active: 112, completed: 46 },
]

export const uploadIcon = UploadCloud
