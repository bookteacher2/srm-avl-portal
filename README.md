# EPC Supplier Portal — SRM & Approved Vendor List (Prototype)

A production-grade **Supplier Relationship Management (SRM)** portal with an
**Approved Vendor List (AVL)** module for an EPC company delivering Solar and EV
infrastructure. This is a **high-fidelity frontend prototype**: it runs on
realistic in-memory sample data and is architected so a real backend
(PostgreSQL/Prisma, Auth.js, REST/Server Actions, SharePoint, Excel, SQL Server,
SAP) can be added later **without rewriting the UI**.

> **Version 1** onboards **Contractor** suppliers. Product Suppliers and Service
> Providers are already modelled as configuration (`COMING_SOON`) — enabling them
> is data, not code.

**Tech:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS ·
shadcn/ui · Lucide · Framer Motion · React Hook Form · Zod · Recharts.

---

## ▶ Run in your browser — zero install (StackBlitz)

No Node.js or Git on your machine? Run the whole app **in the browser** with
StackBlitz (WebContainers). This repo is preconfigured (`.stackblitzrc`) to
auto-install and start.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/<your-username>/srm-avl-portal)

**One click:** once this project is on GitHub, open
`https://stackblitz.com/github/<your-username>/srm-avl-portal`
(replace `<your-username>`). StackBlitz installs deps and boots the dev server
automatically.

**Never used Git?** See **[RUN_ON_STACKBLITZ.md](RUN_ON_STACKBLITZ.md)** for a
browser-only, drag-and-drop path (create a GitHub repo on the website, upload the
files, open in StackBlitz) — no local installation of anything.

---

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Local development](#2-local-development)
3. [Demo accounts](#3-demo-accounts)
4. [Environment variables](#4-environment-variables)
5. [GitHub repository setup](#5-github-repository-setup)
6. [Deploy on Vercel](#6-deploy-on-vercel)
7. [Architecture (the swappable data layer)](#7-architecture-the-swappable-data-layer)
8. [Project structure](#8-project-structure)
9. [Troubleshooting](#9-troubleshooting)
10. [Roadmap](#10-roadmap)

---

## 1. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| **Node.js** | **18.18+** or **20.x** (LTS) | Required by Next.js 14. |
| **pnpm** | 9.x | `npm install -g pnpm` (or use Corepack: `corepack enable`). |
| **Git** | any recent | For version control and pushing to GitHub. |
| A **GitHub** account | — | To host the repository. |
| A **Vercel** account | — | Free Hobby tier is enough; sign in with GitHub. |

Check your versions:

```bash
node -v
pnpm -v
git --version
```

---

## 2. Local development

From the project root (`srm-avl-portal/`):

```bash
pnpm install
cp .env.example .env.local   # optional — sane defaults work out of the box
pnpm dev
```

Open **http://localhost:3000**.

Verify a production build before deploying:

```bash
pnpm build
pnpm start   # serves the production build on http://localhost:3000
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server (hot reload). |
| `pnpm build` | Production build (runs TypeScript type-checking). |
| `pnpm start` | Serve the production build. |
| `pnpm lint` | Run ESLint. |
| `pnpm typecheck` | Type-check without emitting. |

---

## 3. Demo accounts

There is **no password** in the prototype phase — use the **quick-login** buttons
on `/login`, or type one of these emails:

| Role | Email | Lands on |
| --- | --- | --- |
| Supplier (approved, Strategic) | `contact@sunnivasolar.co.th` | Supplier portal |
| Supplier (in review) | `bd@greenvolt.co.th` | Supplier portal |
| Procurement | `procurement@epc-procurement.co.th` | Procurement console |
| Engineering Reviewer | `engineering@epc-procurement.co.th` | Procurement console |
| HSE Reviewer | `hse@epc-procurement.co.th` | Procurement console |
| Finance | `finance@epc-procurement.co.th` | Procurement console |
| Admin | `admin@epc-procurement.co.th` | Procurement console |

---

## 4. Environment variables

**None are required to run the prototype** — it ships with mock data. Copy
`.env.example` to `.env.local` only if you want to tune behaviour. On Vercel you
can deploy with **no environment variables**.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` | Active data provider. Keep `mock` for the prototype. |
| `NEXT_PUBLIC_MOCK_LATENCY_MS` | `350` | Simulated latency so loading states feel real. Set `0` for instant. |

The remaining keys in `.env.example` (`DATABASE_URL`, `AUTH_SECRET`, Microsoft
Graph, storage) are **placeholders for future phases** and are not read by the
prototype.

> Never commit `.env.local` — it is git-ignored. Only `.env.example` is committed.

---

## 5. GitHub repository setup

The project already has an initial commit on the `main` branch. Create an **empty**
GitHub repo (no README/…gitignore) and push:

**Option A — GitHub website**

1. Go to <https://github.com/new>.
2. Name it e.g. `srm-avl-portal`, keep it **Private** (or Public), **do not**
   initialise with README/.gitignore/license.
3. Click **Create repository**, then run:

```bash
git remote add origin https://github.com/<your-username>/srm-avl-portal.git
git push -u origin main
```

**Option B — GitHub CLI** (`gh`)

```bash
gh repo create srm-avl-portal --private --source=. --remote=origin --push
```

> Before pushing, run `pnpm install` locally so `pnpm-lock.yaml` is generated,
> then commit it (`git add pnpm-lock.yaml && git commit -m "Add lockfile"`). A
> committed lockfile makes Vercel use pnpm and reproducible installs.

---

## 6. Deploy on Vercel

**Option A — Dashboard (recommended)**

1. Go to <https://vercel.com/new>.
2. **Import** your GitHub repo (`srm-avl-portal`).
3. Vercel auto-detects **Next.js**. Leave defaults:
   - Framework Preset: **Next.js**
   - Build Command: `pnpm build` (auto)
   - Output: `.next` (auto)
   - Install Command: `pnpm install` (auto)
4. Environment variables: **none required**. (Optionally add
   `NEXT_PUBLIC_DATA_SOURCE=mock`.)
5. Click **Deploy**. You get a live URL like `https://srm-avl-portal.vercel.app`.

Every push to `main` auto-deploys; pull requests get preview URLs.

**Option B — Vercel CLI**

```bash
npm install -g vercel
vercel          # first run links/configures the project (accept defaults)
vercel --prod   # promote to production
```

---

## 7. Architecture (the swappable data layer)

```
UI (app/, components/)
      │  imports ONLY from ↓
      ▼
Service layer            src/lib/services/*        ← business use-cases
      │  composes ↓ (+ pure domain rules in src/lib/domain/*)
      ▼
Repository contracts     src/lib/data/contracts.ts ← interfaces
      │  implemented by ↓
      ▼
Provider factory         src/lib/data/providers/index.ts   ← THE swap point
      │
      ├── mock (default)  in-memory + realistic seed
      └── prisma | rest | mssql | sharepoint | excel | sap   ← future
```

**Rules that keep it swappable**

1. Components import from `@/lib/services` — never a repository, provider, or the
   mock dataset.
2. Every data source implements the `DataProvider` contract.
3. The active source is chosen by `NEXT_PUBLIC_DATA_SOURCE` in one file
   (`src/lib/data/providers/index.ts`).

To add a real backend later: implement `DataProvider` in a new folder, add a
`case` in the factory, set the env var. No UI or service changes.

---

## 8. Project structure

```
src/
├── app/
│   ├── (public)/        # landing, login, registration wizard
│   ├── supplier/        # supplier portal (guarded)
│   └── admin/           # procurement console (guarded)
├── components/
│   ├── ui/              # shadcn primitives
│   ├── shared/          # StatCard, StepTimeline, ScoreRing, skeletons, …
│   ├── layout/          # sidebar, topbar, mobile nav, guarded AppShell
│   └── admin/           # dashboard charts
├── lib/
│   ├── data/            # contracts + provider factory + mock provider
│   ├── domain/          # pure business rules (scoring, expiry, slots)
│   ├── services/        # use-case layer the UI consumes
│   ├── validation/      # Zod schemas
│   └── labels.ts        # enum → label/variant mapping
├── config/              # navigation, roles
├── providers/           # AuthProvider (mock session), Toaster
├── hooks/               # useAsync
└── types/               # domain models + enums
```

---

## 9. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `pnpm: command not found` | Install pnpm: `npm install -g pnpm` or `corepack enable`. |
| Build fails on Node version | Use Node 18.18+ or 20.x (`node -v`). On Vercel set Project → Settings → Node.js Version to 20.x. |
| `next build` fails on a TypeScript error | Fix the reported file/line. Type-checking is intentionally **on**. As a temporary unblock you may set `typescript: { ignoreBuildErrors: true }` in `next.config.mjs`, but fix the root cause for production. |
| Lint errors during build | Lint is already excluded from builds (`eslint.ignoreDuringBuilds: true` in `next.config.mjs`) so it won't block deploys. Run `pnpm lint` locally to see them. |
| Vercel uses npm instead of pnpm | Commit `pnpm-lock.yaml` (generated by `pnpm install`) before pushing, or set Install Command to `pnpm install` in Vercel project settings. |
| Blank page / redirected to `/login` | Expected — protected areas require a session. Use a quick-login account on `/login`. |
| Styles look unstyled | Ensure `pnpm install` completed and you started with `pnpm dev` (Tailwind builds via PostCSS). |
| Port 3000 in use | `pnpm dev -- -p 3001`. |

---

## 10. Roadmap

- **Phase 2 — Backend integration.** Implement the `prisma` provider against
  PostgreSQL (schema mirrors the mock seed), wire **Auth.js** (RBAC) to replace
  the mock session, add real document storage and email notifications, and
  promote write operations to Server Actions.
- **Phase 3 — Enterprise integration.** SharePoint Lists / Excel-on-OneDrive /
  SQL Server / SAP-ERP providers, procurement master-data sync, e-signature,
  supplier self-service annual renewals, BI/analytics dashboards, and switching
  **Product Supplier** and **Service Provider** types to live.

---

_Prototype for internal review. No real supplier data is included; all sample
companies and contacts are fictional._
