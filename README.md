# Frontend Component Studio

[![Frontend checks](https://github.com/eskooo-a2fi/frontend-ui-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/eskooo-a2fi/frontend-ui-portfolio/actions/workflows/ci.yml)
[![Live demo deployment](https://github.com/eskooo-a2fi/frontend-ui-portfolio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/eskooo-a2fi/frontend-ui-portfolio/actions/workflows/deploy-pages.yml)

**A responsive React + TypeScript component studio** showcasing reusable UI patterns, state management, accessible interactions, and thoughtful error handling. Built as a demonstrable frontend-engineering portfolio, not a production identity service.

**[Explore the live demo](https://eskooo-a2fi.github.io/frontend-ui-portfolio/)** · [Source code](https://github.com/eskooo-a2fi/frontend-ui-portfolio) · [Automated tests](https://github.com/eskooo-a2fi/frontend-ui-portfolio/actions)

> The live demo link works **after** GitHub Pages has been enabled and the deployment workflow succeeds. The login is a client-side demonstration; it does not authenticate users against a server.

## What I built

| Component | Capabilities | Code |
| --- | --- | --- |
| **Login form** | Email/password validation, inline accessible errors, show/hide password, remember-me and submit feedback | [`LoginForm.tsx`](src/components/LoginForm.tsx) |
| **Navigation sidebar** | Desktop collapse, mobile drawer, semantic navigation, active state, user profile | [`DashboardSidebar.tsx`](src/components/DashboardSidebar.tsx) |
| **Data table** | Asynchronous mock-data fetch, loading/error/retry, sorting, text search, pagination, empty states | [`DataTable.tsx`](src/components/DataTable.tsx) |

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · Lucide · Vitest · React Testing Library.

## Design decisions

- **Separation of concerns.** Individual components have typed props. The data table accepts an injectable loader, making network behaviour testable without a real API.
- **Accessible controls.** Form labels and associated errors, semantic table headers with `aria-sort`, button names, keyboard focus indicators and a responsive navigation interface.
- **Realistic states.** Loading, server errors, retry, search-with-no-results, and disabled pagination are visible, not just the happy path.
- **Scalable data handling.** Sorting/filtering operate on derived data; a large production dataset would need server-side search and pagination.
- **Honest demo boundaries.** The form intentionally does not store or send credentials. Static JSON is mock data, not a real back end.

## Run locally

Requires Node 20.19+ or Node 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints. To verify the work:

```bash
npm run test
npm run build
```

The application uses Vite rather than the deprecated Create React App. Tailwind CSS is integrated via `@tailwindcss/vite`.

## Deployment

The checked-in [GitHub Pages workflow](.github/workflows/deploy-pages.yml) builds and deploys `dist/` after pushes to `main`. In **Settings → Pages**, set **Build and deployment → Source: GitHub Actions** once. The workflow sets `GITHUB_PAGES=true` to generate the correct `/frontend-ui-portfolio/` asset base path, including the JSON fixture.

## Future enhancements

- Add keyboard focus trapping in the mobile navigation drawer.
- Add axe-core accessibility checks and end-to-end browser coverage.
- Replace the JSON fixture with a real paginated API and connect the login form to an appropriately secured authentication service.
