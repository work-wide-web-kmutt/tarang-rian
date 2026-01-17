# Tarang Rian ตารางเรียน

An academic course planning platform for browsing and scheduling general elective courses, built with React and TanStack Router.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (version 1.3.5 or later)

### Installation

Install dependencies:

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

Or start only the web application:

```bash
bun run dev:web
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

## Project Structure

```
tarang-rian/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Biome formatting and linting
