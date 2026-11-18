# Frontend UI Portfolio · React + TypeScript

An interactive component studio featuring three reusable, accessible React components. The project is a **demonstration**, not a live authentication product.

## Requirements
- Node.js 20.19+ or 22.12+ (Vite-supported); npm 10+

## Exact setup and library installation

This repository contains a complete Vite application. **No scaffolding is required** once you unzip or clone it:

```bash
cd frontend-ui-portfolio
npm install
npm run dev
```

Open the URL printed by Vite (typically <http://localhost:5173>). To rebuild the same dependencies in a new Vite project instead:

```bash
npm create vite@latest frontend-ui-portfolio -- --template react-ts
cd frontend-ui-portfolio
npm install
npm install lucide-react
npm install -D tailwindcss @tailwindcss/vite
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Then copy the supplied `src`, `public`, `vite.config.ts`, and configuration files. The current Tailwind Vite approach uses `tailwindcss()` in `vite.config.ts` and `@import "tailwindcss";` in the main CSS file.

**Why not `npx create-react-app my-app`?** React deprecated Create React App in February 2025. Vite is faster and has a first-class modern TypeScript/Tailwind integration. See <https://react.dev/blog/2025/02/14/sunsetting-create-react-app> and <https://tailwindcss.com/docs/installation/using-vite>.

## Components

1. **`src/components/LoginForm.tsx`** — controlled TypeScript form, validated email/password, accessible inline error messages, password visibility toggle, remember-me checkbox, pending state and explicit demo-only success message. It does *not* send credentials to a service or store them.
2. **`src/components/DashboardSidebar.tsx`** — mobile drawer with overlay and Escape support, semantic navigation, active state, desktop collapse/expand, profile section. `onNavigate` is decoupled from any routing library.
3. **`src/components/DataTable.tsx`** — a real async fetch of `public/mock-users.json`, loading/error/retry states, typed rows, locale-aware sorting, accessible column headers, filtering, zero-results state and six-row pagination. `load` is injectable for tests or a production API client.

## Tests and checks

```bash
npm run test
npm run build
```

Tests use Vitest, React Testing Library and user-event. Extend them with keyboard navigation, page-boundary, retry and mobile layout tests for a larger project. Run an accessibility audit with axe or Lighthouse before production deployment.

## Architecture and security notes

- No back-end endpoint is connected to `LoginForm`; client validation is **not** authentication.
- Search/filter/sort uses memoised derived data and does not mutate the source rows.
- Static JSON is solely a predictable stand-in for an API (there is no fake claim of a live service).
- In a deployed app, introduce a real auth API, error boundaries, focus trapping for mobile dialogs and server-side sorting/pagination when the dataset grows.

## Publish your own repo

```bash
git init
git add .
git commit -m "Build accessible React TypeScript UI portfolio"
gh repo create frontend-ui-portfolio --public --source=. --remote=origin --push
```

The `gh` command requires you to sign in with GitHub CLI (`gh auth login`). Do not commit secrets.
