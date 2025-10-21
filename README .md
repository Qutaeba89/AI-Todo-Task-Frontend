# AI Chat Bot — Frontend (Vite + React + TypeScript)

## Overview
Simple UI to manage **tasks** and to **simplify text with AI**.
- Lists tasks, creates/edits/deletes via REST.
- Live updates via **WebSocket (STOMP + SockJS)** on `/topic/tasks`.
- AI button “Förenkla text (AI)” calls backend `/api/ai/simplify`.

## Tech
- Vite, React, TypeScript.
- STOMP client (`@stomp/stompjs`) + SockJS.
- Uses environment vars for backend base URLs.

## Prerequisites
- Node.js 18+ and npm.

## Setup
Create a `.env` **in the frontend project root**:
```bash
VITE_API_BASE=http://localhost:8080
VITE_WS_BASE=http://localhost:8080
```
- `VITE_API_BASE` → backend HTTP (REST), default `http://localhost:8080`.
- `VITE_WS_BASE`  → backend WS base (for SockJS), same host by default.

Install & run:
```bash
cd AI-Chat-Bot-Frontend
npm install
npm run dev
```
Vite will print the local URL (commonly `http://localhost:5173`).

## How it works
- `src/api.ts`: wrapper for REST calls (`/api/tasks`, `/api/ai/simplify`).
- `src/ws.ts`: connects STOMP over SockJS to `{
    "endpoint": "/ws",
    "topic": "/topic/tasks"
}`.
- `src/components/TaskForm.tsx`: form with basic validation (title required, min length).
- `src/components/TaskList.tsx`: renders list, edit/delete, triggers AI simplify for description.
- `src/ai/AiSimplifyButton.tsx`: calls `api.simplifyText` and shows loading/error.

## Project Structure
```
AI-Chat-Bot-Frontend/
  src/
    App.tsx
    api.ts              # REST client
    ws.ts               # STOMP/SockJS client
    components/
      TaskForm.tsx
      TaskList.tsx
    ai/
      AiSimplifyButton.tsx
  index.html
  package.json
  vite.config.*
```

## Dev Tips
- Ensure backend is running at `8080` or adjust `.env`.
- Open the browser console to see WS debug logs (`[STOMP] ...`).

## Build
```bash
npm run build
npm run preview
```
