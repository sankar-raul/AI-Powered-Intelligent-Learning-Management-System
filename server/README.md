# AI LMS Server (Express + MongoDB)

## Setup

1. Install dependencies

```bash
yarn
```

2. Configure environment variables in `.env`

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/ai-lms
JWT_SECRET=change-me
```

3. Run the API

```bash
yarn dev
```

## Build

```bash
yarn build
yarn start
```

## API map

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Teacher (teacher/admin)
- `POST /api/teacher/subjects`
- `GET /api/teacher/subjects`
- `PATCH /api/teacher/subjects/:subjectId`
- `DELETE /api/teacher/subjects/:subjectId`
- `PUT /api/teacher/subjects/:subjectId/roadmap`
- `GET /api/teacher/subjects/:subjectId/roadmap`
- `POST /api/teacher/subjects/:subjectId/materials`
- `GET /api/teacher/subjects/:subjectId/materials`
- `POST /api/teacher/subjects/:subjectId/quizzes`
- `GET /api/teacher/subjects/:subjectId/quizzes`
- `POST /api/teacher/ai/roadmap-draft` (fallback/manual mode)
- `POST /api/teacher/ai/quiz-draft` (fallback/manual mode)

### Student (student/admin)
- `GET /api/student/subjects`
- `POST /api/student/subjects/:subjectId/enroll`
- `GET /api/student/subjects/:subjectId/roadmap`
- `GET /api/student/subjects/:subjectId/topics/:topicId`
- `POST /api/student/subjects/:subjectId/topics/:topicId/study`
- `POST /api/student/subjects/:subjectId/topics/:topicId/ask-ai`
- `POST /api/student/quizzes/:quizId/attempt`
- `GET /api/student/enrollments/:subjectId/progress`

## Progress and unlock rule
- Topic is considered complete **only when both**:
  1. Student marks it as studied.
  2. Student passes its quiz (`score >= passThreshold`, default `60`).
- Enrollment stores snapshot fields (`progress`, `completedTopicIds`, `unlockedTopicIds`) and is recomputed from source data.
- Unlocking is sequential by roadmap order.
