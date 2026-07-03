# Iroko Court

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Monorepo](https://img.shields.io/badge/architecture-monorepo-0ea5e9)](#-project-structure)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-ef4444)](https://turbo.build/)
[![PNPM](https://img.shields.io/badge/package%20manager-pnpm-f59e0b)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/frontend-Next.js-000000)](https://nextjs.org/)

A modern full-stack monorepo powering the **Iroko Court** platform, with a web application, shared UI/business packages, and database components designed for scalable product development.

---

## Table of Contents

- [Overview](#overview)
- [Core Goals](#core-goals)
- [Technology Stack](#technology-stack)
- [Language Composition](#language-composition)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Workspace Packages](#workspace-packages)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Environment Configuration](#environment-configuration)
- [Scripts & Commands](#scripts--commands)
- [Build & Release Notes](#build--release-notes)
- [Quality Standards](#quality-standards)
- [Security Practices](#security-practices)
- [Troubleshooting](#troubleshooting)
- [Contribution Guide](#contribution-guide)
- [Roadmap (Suggested)](#roadmap-suggested)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

**Iroko Court** is structured as a **pnpm + Turborepo monorepo** designed for maintainability and team scalability.  
The repository currently includes:

- A **Next.js web client** (`apps/web`)
- Reusable internal packages (`packages/*`) for:
  - shared utilities/domain logic
  - UI primitives/components
  - configuration
  - database layer

This structure promotes:

- clear separation of concerns,
- reusable code across surfaces,
- consistent dependency management,
- and efficient CI/CD optimization with Turborepo task orchestration.

---

## Core Goals

- Deliver a reliable web application for Iroko Court users.
- Centralize shared frontend and domain logic in reusable packages.
- Maintain strict type safety and consistency via TypeScript.
- Enable rapid iteration with efficient local developer experience.
- Support long-term scale with modular architecture and clean boundaries.

---

## Technology Stack

### Monorepo & Tooling
- **pnpm workspaces** for package/workspace management
- **Turborepo** for task orchestration and caching
- **Prettier** for formatting consistency

### Frontend
- **Next.js** (App runtime for web experience)
- **React**
- **TypeScript**
- **Tailwind CSS 4**
- **ESLint**

### Data & Integration
- **Supabase JS** and **Supabase SSR**
- **React Query** for server state/data fetching patterns
- **Zod** for schema validation
- **React Hook Form** for form handling

### Visualization & Export
- **Recharts** for analytics/charting surfaces
- **ExcelJS** for spreadsheet generation/export workflows

---

## Language Composition

From repository analysis:

- **TypeScript** — 83%
- **PLpgSQL** — 15.9%
- **Other** — 1.1%

This indicates a frontend/application-heavy codebase with meaningful procedural SQL/database logic.

---

## Architecture

```mermaid
flowchart LR
    A[User Browser] --> B[apps/web - Next.js]
    B --> C[@iroko-court/shared]
    B --> D[@iroko-court/ui]
    B --> E[Supabase APIs]
    F[@iroko-court/database] --> E
    G[@iroko-court/config] --> B
    G --> C
    G --> D
```

### Architectural Notes

- `apps/web` is the primary runtime surface.
- `packages/shared` contains reusable logic/types/helpers.
- `packages/ui` provides cross-feature visual primitives/components.
- `packages/database` captures DB-level artifacts and related integration logic.
- `packages/config` acts as a central place for shared configuration concerns.

---

## Project Structure

```text
iroko-court/
├─ apps/
│  └─ web/                  # Next.js web application
├─ packages/
│  ├─ config/               # Shared config package
│  ├─ database/             # Database-focused package (SQL / integration)
│  ├─ shared/               # Shared utilities, types, domain logic
│  └─ ui/                   # Shared UI components
├─ package.json             # Root scripts and monorepo dev tooling
├─ pnpm-workspace.yaml      # Workspace package globs
├─ turbo.json               # Turborepo task graph / caching behavior
└─ README.md
```

---

## Workspace Packages

### `apps/web`
Primary web frontend built with Next.js and React.

Notable dependencies suggest support for:

- server/client integration with Supabase,
- form handling and validation,
- analytics/visualization dashboards,
- data export features.

### `packages/config`
Shared configuration package intended to centralize reusable config contracts and defaults.

### `packages/database`
Database package for schema/migrations/functions/database-access patterns (especially relevant given PLpgSQL composition).

### `packages/shared`
Cross-cutting logic package for shared types, validators, helpers, and utilities.

### `packages/ui`
Reusable design-system style components to keep consistency across pages/features.

---

## Getting Started

## Prerequisites

- **Node.js >= 20.0.0**
- **pnpm 10.x** (repo uses `pnpm@10.33.2`)

### 1) Clone

```bash
git clone https://github.com/Ebendttl/iroko-court.git
cd iroko-court
```

### 2) Install dependencies

```bash
pnpm install
```

### 3) Start development

```bash
pnpm dev
```

This runs `turbo dev`, orchestrating development tasks for active workspaces.

---

## Development Workflow

### Run dev mode
```bash
pnpm dev
```

### Build all workspaces
```bash
pnpm build
```

### Lint all workspaces
```bash
pnpm lint
```

### Format repository files
```bash
pnpm format
```

Formatting currently targets `**/*.{ts,tsx,md}`.

---

## Environment Configuration

> Create environment files before running the app in non-trivial environments.

Recommended convention:

- `apps/web/.env.local` for local web development
- `apps/web/.env` for shared defaults (non-sensitive)
- CI/CD-managed secrets for staging/production

Example variable set (adjust to your implementation):

```env
# App
NEXT_PUBLIC_APP_NAME=Iroko Court
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional analytics/monitoring
NEXT_PUBLIC_SENTRY_DSN=
```

> Never commit real credentials. Use GitHub secrets and deployment platform secret stores.

---

## Scripts & Commands

From root `package.json`:

- `pnpm dev` → `turbo dev`
- `pnpm build` → `turbo build`
- `pnpm lint` → `turbo lint`
- `pnpm format` → Prettier write pass for TS/TSX/MD

From `apps/web/package.json`:

- `pnpm --filter web dev` → Next dev server
- `pnpm --filter web build` → production build
- `pnpm --filter web start` → start production server
- `pnpm --filter web lint` → lint frontend app

---

## Build & Release Notes

### Turborepo task model (`turbo.json`)

- `build`
  - depends on upstream package builds (`^build`)
  - caches `.next/**` outputs excluding cache directory
- `lint`
  - depends on upstream lint tasks (`^lint`)
- `dev`
  - persistent and uncached for local interactive sessions

### Why this matters

- Faster repeated pipelines with caching.
- Predictable dependency-aware task execution.
- Better scaling as number of packages grows.

---

## Quality Standards

Recommended standards for this codebase:

- strict TypeScript mode in all workspaces,
- consistent formatting via Prettier,
- Next + ESLint quality checks,
- shared schema validation with Zod,
- PR checks for lint/build before merge.

Suggested CI jobs:

1. Install (`pnpm install --frozen-lockfile`)
2. Lint (`pnpm lint`)
3. Build (`pnpm build`)
4. (Optional) type-check and test suites if present

---

## Security Practices

- Keep all secrets in environment variables.
- Avoid exposing privileged keys in client bundles.
- Rotate sensitive tokens periodically.
- Apply least-privilege access for database service roles.
- Validate all incoming data with schema validation (e.g., Zod).
- Add rate limiting and abuse controls on critical endpoints.
- Audit authentication and authorization paths regularly.

---

## Troubleshooting

### `pnpm install` fails due to Node version
Ensure Node is `>=20`.

### Workspace package resolution issues
Run:

```bash
pnpm install
pnpm -r list
```

and verify `pnpm-workspace.yaml` includes all intended workspaces.

### Build cache oddities
Clear local artifacts:

```bash
rm -rf .turbo node_modules
pnpm install
pnpm build
```

### Next.js runtime errors
Check:

- env variables are present,
- server-only keys are not used in client components,
- dependency versions are aligned across workspace packages.

---

## Contribution Guide

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feat/short-description
   ```
3. Commit using clear, scoped messages:
   ```bash
   feat(web): add case summary card
   fix(shared): handle empty date parser input
   chore(repo): align turbo pipeline outputs
   ```
4. Run quality checks:
   ```bash
   pnpm lint && pnpm build
   ```
5. Open a pull request with:
   - purpose and context,
   - screenshots (if UI),
   - migration notes (if DB changes),
   - rollback considerations for risky updates.

---

## Roadmap (Suggested)

- [ ] Add automated test suites (unit + integration)
- [ ] Add CI workflow with matrix checks
- [ ] Add architecture decision records (ADRs)
- [ ] Introduce changelog/release automation
- [ ] Add performance budgets and monitoring
- [ ] Expand design system documentation (`packages/ui`)
- [ ] Formalize database migration and rollback playbooks

---

## License

This project is licensed under the **MIT License**.  
See [`LICENSE`](./LICENSE) for full text.

---

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Turborepo](https://turbo.build/)
- [pnpm](https://pnpm.io/)
- [Supabase](https://supabase.com/)
