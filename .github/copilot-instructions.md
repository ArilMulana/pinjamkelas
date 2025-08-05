# Copilot Instructions for pinjamkelas

## Project Overview
- **pinjamkelas** is a Laravel + React (Vite, Inertia.js) monorepo for a classroom booking system.
- Backend: Laravel (app/, routes/, database/, config/)
- Frontend: React (resources/js/), using Inertia.js for SPA-like navigation and Headless UI for components.
- Styling: Tailwind CSS (see vite.config.ts for plugin setup).

## Key Patterns & Architecture
- **Inertia.js** bridges Laravel controllers and React pages. Controllers return `Inertia::render('path', [...props])`.
- React "pages" live in `resources/js/pages/` and match the Inertia render path. Example: `Inertia::render('matkul/prodi/index', ...)` maps to `resources/js/pages/matkul/prodi/index.tsx`.
- Data from controllers is accessed in React via `usePage().props` or custom hooks (see `use-matakuliah.tsx`).
- Shared logic/hooks are in `resources/js/hooks/`.
- TypeScript interfaces for data shape are defined in hooks (e.g., `dataMatkul`, `MatProdi`).
- Use prop drilling for passing Inertia props from page to child components (do not call usePage() in deep children).

## Developer Workflows
- **Dev server:** `npm run dev` (Vite, port 5173)
- **Build:** `npm run build`
- **Lint/Format:** `npm run lint`, `npm run format`
- **Typecheck:** `npm run types`
- **Backend:** Use Laravel artisan commands as usual (e.g., `php artisan migrate`)
- **Tests:** `php artisan test` or `vendor/bin/phpunit`

## Project-Specific Conventions
- Always use the same prop names in controller and React (e.g., `matkulData` in PHP = `matkulData` in JS).
- Use custom hooks (e.g., `useMatkul`) only in page components, not in deep children.
- For new Inertia pages, always create a matching React file in `resources/js/pages/...`.
- Use TypeScript for all React code and define interfaces for all Inertia props.
- Use Tailwind utility classes for all styling.

## Integration Points
- **Inertia.js**: All backend/frontend data flow is via Inertia props.
- **Vite**: Handles asset bundling and HMR for React.
- **Headless UI**: Used for advanced UI components (Combobox, etc).
- **SweetAlert2**: Used for notifications.

## Examples
- See `MatakuliahProgramStudiController.php` for a typical Inertia controller.
- See `resources/js/pages/matkul/prodi/index.tsx` for a typical Inertia page.
- See `resources/js/hooks/matakuliah/use-matakuliah.tsx` for data typing and hooks.

## Gotchas
- If a prop is missing in React, check the controller and prop names.
- Do not use usePage() in child components—pass props from the page.
- Always keep TypeScript interfaces in sync with backend data shape.

---
For more, see README.md and vite.config.ts for build details.
