# Codebase Documentation

This document explains the current SSP MERN Project codebase at a repository level and records the major changes applied during the recent quality-gate, coverage, CI/CD, and documentation work.

## 1. Repository Overview

The repository is a monorepo with:

- a React frontend in `frontend/`
- an Express and MongoDB backend in `backend/`
- root-level infrastructure and CI/CD configuration

The application serves a landing page for Perseverance Software Training Institute and includes a CRUD-based "interest list" or task flow backed by MongoDB.

## 2. High-Level Architecture

```text
Browser
  -> Frontend (React app served by Nginx)
  -> Backend API (/courses)
  -> MongoDB
```

### Request Flow

1. The frontend renders the landing page and calls the API through `frontend/src/services/taskServices.js`.
2. React state and API coordination are handled by `frontend/src/courses.js`.
3. The backend receives requests in `backend/index.js` and routes `/courses` traffic to `backend/routes/courses.js`.
4. The route layer validates data and performs CRUD operations via the Mongoose model in `backend/models/task.js`.
5. MongoDB stores task records.

## 3. Root-Level Files

### `README.md`

Primary onboarding document for the project. It now reflects the current monorepo structure, Docker Compose usage, CI/CD stages, environment variables, and testing workflow.

### `docker-compose.yml`

Defines the local and deployment stack:

- `mongodb`
- `backend-api`
- `frontend`

It uses immutable image tags when present:

- `BACKEND_IMAGE_TAG`
- `FRONTEND_IMAGE_TAG`

### `sonar-project.properties`

Controls SonarCloud analysis. Current behavior:

- treats the repository root as source scope
- explicitly classifies backend and frontend test files as tests
- excludes test files and generated assets from source coverage
- imports coverage from:
  - `backend/coverage/lcov.info`
  - `frontend/coverage/lcov.info`

### `.github/workflows/cicd.yml`

Current GitHub Actions pipeline stages:

1. `quality-check`
2. `sonar`
3. `docker`
4. `deploy`

The previous Trivy stage has been removed.

## 4. Backend Codebase

Backend code lives in `backend/`.

### `backend/index.js`

Main Express server entry point.

Responsibilities:

- loads `.env` in non-production mode
- configures CORS using `FRONTEND_URL` plus localhost origins
- enables JSON parsing
- exposes `GET /health`
- mounts the `/courses` router
- handles 404 and centralized errors
- starts the server through `startServer()`

Important current design detail:

- `startServer()` only runs automatically when the file is executed directly
- this allows the file to be tested without opening a real server during Jest runs

Exports:

- `app`
- `allowedOrigins`
- `port`
- `startServer`

### `backend/db.js`

MongoDB connection utility.

Responsibilities:

- reads `DB_CONN_STR`
- throws if the connection string is missing
- conditionally applies username and password if `USE_DB_AUTH === "true"`
- connects through Mongoose

### `backend/models/task.js`

Mongoose schema for task records.

Fields:

- `task`: required string, trimmed, min length 1, max length 120
- `completed`: boolean with default `false`

Schema options:

- timestamps enabled
- `versionKey` disabled

### `backend/routes/courses.js`

Main backend route module for task CRUD.

Key internal pieces:

- `HTTP_STATUS`: avoids hard-coded numbers
- `HttpError`: consistent typed HTTP errors
- `asyncHandler`: wraps async route handlers
- `sanitizeTaskInput()`: validates and sanitizes request body
- `validateObjectId()`: rejects invalid Mongo IDs early

Supported endpoints:

- `POST /courses`
- `GET /courses`
- `PUT /courses/:id`
- `DELETE /courses/:id`

Validation behavior includes:

- request body must be an object
- `task` must be a non-empty string
- `task` length must be `<= 120`
- `completed` must be boolean
- update requests must include at least one allowed field

### `backend/package.json`

Backend scripts:

- `npm test`
- `npm start`
- `npm run dev`

Jest now uses `collectCoverageFrom` so CI coverage includes backend source files broadly, not only files directly imported by the test runner.

### `backend/Dockerfile`

Builds the backend image used in CI and deployment.

### `backend/README.md`

Backend-specific API notes. It is still present as a focused backend doc, while the root README now covers the full repo.

## 5. Backend Tests

Backend tests live in `backend/tests/`.

### `backend/tests/courses.test.js`

Covers:

- `sanitizeTaskInput`
- route creation flow
- list flow
- update success and error branches
- delete success and error branches

This file uses mocked model functions to isolate route behavior from the database.

### `backend/tests/db.test.js`

Covers:

- missing `DB_CONN_STR`
- connection without DB auth
- connection with DB auth

### `backend/tests/index.test.js`

Covers:

- Express app wiring
- middleware registration
- health route
- 404 behavior
- centralized error handler behavior
- CORS origin checks
- successful startup path
- failed startup path
- production-mode dotenv skip

### `backend/tests/task-model.test.js`

Covers:

- Mongoose model name
- expected schema field definitions

## 6. Frontend Codebase

Frontend code lives in `frontend/`.

### `frontend/src/App.js`

Root application component.

Responsibilities:

- imports the main sections of the landing page
- uses `useCourses()` from `frontend/src/courses.js`
- passes task state and actions into `ContactCTA`

Rendered sections:

- `Hero`
- `ProgramCard`
- `StatsStrip`
- `FeatureGrid`
- `LeadershipGrid`
- `TestimonialCarousel`
- `SuccessStoryGrid`
- `ContactCTA`

### `frontend/src/courses.js`

Custom hook that coordinates frontend task behavior.

Responsibilities:

- fetches existing tasks on mount
- manages `tasks` state
- manages `currentTask` input state
- handles add, update, and delete flows
- performs optimistic UI updates for update and delete
- rolls back state on failed update and delete requests

### `frontend/src/services/taskServices.js`

Axios service layer.

Functions:

- `getTasks()`
- `addTask(task)`
- `updateTask(id, task)`
- `deleteTask(id)`

Behavior:

- uses `REACT_APP_BACKEND_URL` if present
- otherwise defaults to `/courses`

### `frontend/src/index.js`

Frontend entry point that renders `<App />` inside a wrapper div.

### `frontend/src/App.css`, `frontend/src/index.css`, `frontend/src/tailwind-output.css`

Main frontend styles:

- `App.css` contains app-specific styling
- `index.css` contains base styles and Tailwind input
- `tailwind-output.css` is generated output and excluded from Sonar source coverage

### Frontend Layout Components

Located in `frontend/src/components/layout/`:

- `Header.js`: top navigation, mobile menu behavior, theme toggle, CTA
- `Footer.js`: footer content
- `PageShell.js`: shared page wrapper around header, content, and footer
- `SectionTitle.js`: reusable section heading block

### Frontend Section Components

Located in `frontend/src/components/sections/`:

- `Hero.js`: opening marketing section and primary CTA
- `ProgramCard.js`: program offering showcase
- `StatsStrip.js`: key metrics and outcomes
- `FeatureGrid.js`: selling points and differentiators
- `LeadershipGrid.js`: institute/team presentation
- `TestimonialCarousel.js`: learner testimonials
- `SuccessStoryGrid.js`: alumni outcomes
- `ContactCTA.js`: contact and interest list section with CRUD UI

### Frontend Shared Components

Located in `frontend/src/components/shared/`:

- `AvatarCard.js`
- `Badge.js`
- `Button.js`
- `Card.js`

These provide reusable visual building blocks used by the landing sections.

### Frontend Static and Deployment Files

- `frontend/public/`: static assets and HTML shell
- `frontend/nginx.conf`: Nginx configuration for serving the frontend
- `frontend/Dockerfile`: frontend image build
- `frontend/tailwind.config.js`: Tailwind setup

## 7. Frontend Tests

### `frontend/src/App.test.js`

Covers:

- app render
- initial task loading
- add task flow
- update task flow
- delete task flow
- failed initial fetch logging

### `frontend/src/services/taskServices.test.js`

Covers:

- default `/courses` API URL
- environment-driven API base URL override

## 8. CI/CD and Quality Changes Applied

This section records the major recent changes that were made across the repository.

### A. Sonar Coverage Fixes

Changes made:

- added backend route, DB, index, and model tests
- added frontend app and service tests
- configured Sonar to classify tests correctly
- imported both backend and frontend LCOV reports

Why:

- the quality gate was failing because new-code coverage was below the required threshold
- Sonar was initially counting test files incorrectly and was missing some source coverage inputs

### B. Backend Testability Improvements

Changes made:

- `backend/index.js` now exports `startServer`
- server startup is guarded by `require.main === module`
- backend Jest coverage collection was broadened in `backend/package.json`

Why:

- this allowed coverage to include bootstrap logic safely
- it made backend startup behavior unit-testable

### C. Frontend Coverage in CI

Changes made:

- frontend tests now run in CI
- frontend LCOV is uploaded as an artifact
- Sonar downloads and consumes frontend coverage
- frontend CI test command runs in-band for more predictable execution

Why:

- backend coverage alone was not enough for the new-code window
- frontend source changes also needed coverage reported to Sonar

### D. CI/CD Pipeline Simplification

Changes made:

- removed the Trivy stage from the GitHub Actions workflow
- deploy now depends directly on `docker`

Why:

- requested workflow simplification

### E. Docker and Deployment Direction

Existing recent codebase changes, now documented:

- deployment uses immutable image tags
- deployment exports image tags on the EC2 host before `docker compose pull`
- Compose consumes `BACKEND_IMAGE_TAG` and `FRONTEND_IMAGE_TAG`

## 9. Recent Change Timeline

Recent notable commits:

- `210f4fe` Remove Trivy stage from CI pipeline
- `1c3d884` Add frontend coverage for Sonar gate
- `b234bc5` Expand backend coverage for Sonar gate
- `dd40d3d` Classify Sonar test files correctly
- `db1e585` Add backend coverage tests for Sonar gate

## 10. How to Work on the Codebase

### Run backend tests

```bash
cd backend
npm test -- --runInBand
```

### Run frontend tests

```bash
cd frontend
npm test -- --watchAll=false --coverage --runInBand
```

### Build frontend

```bash
cd frontend
npm run build
```

### Start full stack

```bash
docker compose up -d
```

## 11. Current Documentation Status

Current documentation now includes:

- root onboarding and setup in `README.md`
- backend-specific notes in `backend/README.md`
- full-repository explanation and recent changes in this file

If needed later, this can be split further into:

- API documentation
- deployment runbook
- architecture decision records
- release notes or changelog
