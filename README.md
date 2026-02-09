# TeamTailor Candidate Export

A full-stack web application that exports candidates and their job applications from the TeamTailor API to a CSV file.

## Features

- **Fast parallel fetching** with configurable concurrency limits
- **CSV export** with candidate and job application data
- **Live data preview** with candidate table before downloading
- **Automatic retry** with exponential backoff for API failures
- **Type-safe** with Zod schema validation and TypeScript
- **Dark mode** with system preference detection
- **Docker ready** with docker-compose

## Quick Start

### Using Docker (Recommended)

```bash
cd server
cp .env.example .env # Add your API key
cd ..

docker-compose up --build

# Server: http://localhost:3000
# Client: http://localhost:4000 or http://localhost:5173 if you run client manually
```

### Manual Setup

```bash
# Server
cd server
cp .env.example .env  # Add your API key
npm install
npm run dev

# Client (new terminal)
cd client
npm install
npm run dev
```

## Tech Stack

### Backend

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Validation | Zod |
| HTTP Client | Axios |
| Testing | Vitest |

### Frontend

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build Tool | Vite |
| Language | TypeScript |
| Data Fetching | TanStack Query |
| Query Keys | @lukemorales/query-key-factory |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (Radix primitives) |
| Animations | Framer Motion |
| Icons | Lucide React |

## Architecture

```
server/
├── src/
│   ├── config/        # Environment & constants
│   ├── routes/        # Express routes
│   ├── services/      # Business logic (API, CSV)
│   ├── middleware/     # Error handling
│   ├── types/         # Zod schemas & types
│   ├── utils/         # Retry logic
│   └── __tests__/     # Unit tests

client/
├── src/
│   ├── api/           # API routes, functions, query keys
│   ├── components/    # UI components (CandidateTable, DownloadButton, ThemeToggle)
│   │   └── ui/        # shadcn/ui primitives
│   ├── hooks/         # TanStack Query hooks
│   ├── lib/           # Config & utilities
│   ├── providers/     # QueryProvider, ThemeProvider
│   └── types/         # Shared TypeScript types
```

### Key Design Decisions

1. **Parallel pagination** - Uses `p-limit` to fetch multiple pages concurrently while respecting API rate limits
2. **Zod transforms** - Validates API responses and transforms JSON:API format to internal DTOs
3. **Retry with backoff** - Automatically retries failed requests with exponential delay

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/candidates` | Returns candidates as JSON |
| GET | `/candidates/export` | Downloads CSV with all candidates |
| GET | `/health` | Health check endpoint |

## CSV Output Format

| Column | Description |
|--------|-------------|
| candidate_id | Unique candidate identifier |
| first_name | Candidate's first name |
| last_name | Candidate's last name |
| email | Candidate's email |
| job_application_id | Job application ID |
| job_application_created_at | Application timestamp |

## Scripts

### Server

```bash
npm run dev        # Development server with hot reload
npm run build      # Build TypeScript
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once
npm run typecheck  # TypeScript check
```

### Client

```bash
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
```

## AI Usage Disclosure

AI was used strictly as a productivity and support tool, not as an autonomous code author:

- **Research & Validation** – verifying JSON:API pagination behavior, concurrency patterns, and Express error-handling approaches
- **Boilerplate & Setup** – initial Docker configuration, README scaffolding
- **Code Review Support** – identifying edge cases, simplifying logic, and validating error scenarios
- **Testing Assistance** – generating initial test cases and edge-case scenarios

All AI-generated output was reviewed, understood, and adapted.  
Final implementation, architecture, and trade-off decisions were made by me.
