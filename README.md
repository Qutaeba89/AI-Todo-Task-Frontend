# AI Todo Task — Frontend

React + TypeScript + Vite frontend for a task manager with an AI-powered text simplifier.

**Live:** http://77.81.6.76:3000 · **Backend:** [AI-Todo-Task-Backend](https://github.com/Qutaeba89/AI-Todo-Task-Backend)

## Features

- List, create, edit, and delete tasks via REST
- Live updates across every connected client via WebSocket (STOMP + SockJS)
- "Simplify text (AI)" button that calls the backend's `/api/ai/simplify` endpoint

## Tech stack

Vite, React, TypeScript, `@stomp/stompjs` + SockJS.

## Why this stack

Spring Boot (backend) owns the business logic and database; React (Vite) owns the browser UI —
REST for request/response, WebSocket for real-time push. Node.js is only a local build tool Vite
uses; it's not part of the runtime backend.

## Getting started

**Prerequisites:** Node.js 18+, npm, the backend running on port 8080.

```bash
git clone https://github.com/Qutaeba89/AI-Todo-Task-Frontend.git
cd AI-Todo-Task-Frontend
npm install
```

Create a `.env` in the project root:

```bash
VITE_API_BASE=http://localhost:8080
VITE_WS_BASE=http://localhost:8080
```

```bash
npm run dev
```

Vite prints the local URL (commonly `http://localhost:5173`).

## Project structure

```
src/
  App.tsx
  api.ts                     # REST client
  ws.ts                      # STOMP/SockJS client — connects to /ws, subscribes to /topic/tasks
  components/
    TaskForm.tsx              # create/edit form with basic validation
    TaskList.tsx               # list, edit, delete, triggers AI simplify
  ai/
    AiSimplifyButton.tsx        # calls api.simplifyText, shows loading/error
```

## Dev tips

- Make sure the backend is running on `8080`, or adjust `.env`.
- Open DevTools console and check for the "Connected to /ws" message.
- Open two browser tabs — real-time updates should appear in both immediately.

## Troubleshooting

- **CORS error** — add `http://localhost:5173` as an allowed origin in the backend's `WebConfig.java`.
- **SockJS connection error** — confirm the backend's `/ws` endpoint is active.
- **Mixed content (https/http)** — make sure frontend and backend use the same protocol.

## Build

```bash
npm run build
npm run preview
```
