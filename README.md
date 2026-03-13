# Poll App

A live voting/poll application with real-time voting.

## Technologies

### Client
- [Vue 3](https://vuejs.org/) — UI framework (Composition API)
- [Vue Router 5](https://router.vuejs.org/) — client-side routing
- [Vite 7](https://vite.dev/) — dev server and build tool
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Vitest](https://vitest.dev/) — unit testing
- [ESLint](https://eslint.org/) + [oxlint](https://oxc.rs/docs/guide/usage/linter) — linting

### Server
- [Node.js](https://nodejs.org/) (v20.19+ or v22.12+) — runtime
- [Express 5](https://expressjs.com/) — HTTP framework
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — SQLite database
- [nodemon](https://nodemon.io/) — auto-restart during development
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) — real-time vote broadcasting

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`. Built and tested on `24.7.0`.
- npm

### Run the server

```bash
cd server
npm install
npm run dev
```

The server starts on `http://localhost:3000` by default.

### Run the client

```bash
cd client
npm install
npm run dev
```

The client dev server starts on `http://localhost:5173` by default.

### Run client unit tests

```bash
cd client
npm run test:unit
```

## Recommended VS Code Extensions

| Extension | ID | Purpose |
|---|---|---|
| Vue - Official | `Vue.volar` | Vue 3 language support and IntelliSense |
| Vitest | `vitest.explorer` | Run and debug Vitest tests in the sidebar |
| ESLint | `dbaeumer.vscode-eslint` | Inline ESLint diagnostics and auto-fix |
| OXC | `oxc.oxc-vscode` | Fast oxlint diagnostics |
