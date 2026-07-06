# AI LMS Client (React + Vite)

## Setup

```bash
yarn
```

Create `.env` (optional):

```env
VITE_API_BASE=http://127.0.0.1:8080/api
```

## Run

```bash
yarn dev
```

## Build

```bash
yarn build
```

## User flow included

- Login/Register (student or teacher)
- Teacher: create subjects, save roadmap JSON, add material JSON, add quiz JSON
- Student: browse subjects, enroll, view roadmap lock state, open topic page, mark studied, ask AI, attempt quiz, and view progress dashboard
