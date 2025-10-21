This project is a Vite + React (JSX) frontend that integrates with a Flask backend for payments.
Keep instructions concise and specific to patterns in this repo.

Essentials for working in this codebase
- Run locally: `pnpm install` then `pnpm dev` (scripts defined in `package.json`).
- Production build: `pnpm build` (Vite). Preview with `pnpm preview`.
- Path alias: `@/*` maps to `src/*` (see `jsconfig.json`). Use `@/components/...` when adding imports.

Architecture & data flow
- Frontend routing: `src/main.jsx` → `src/App.jsx` uses `react-router-dom` for pages. Pages live in `src/pages`.
- UI primitives: reusable components are under `src/components/ui/*`. Prefer these when implementing new UI to stay consistent (e.g., `Button`, `Card`, `Input`).
- Payment flow: Pricing page (`src/pages/Precos.jsx`) navigates to `src/pages/Pagamento.jsx` using `navigate('/pagamento', { state: { selectedPlan, isYearly } })`. The payment page expects `location.state.selectedPlan` and redirects back to `/precos` if missing.
- Styling: Tailwind via `tailwind.config.js`. Use `cn()` from `src/lib/utils.js` for conditional class merging.
- Animations: framer-motion page transitions are in `src/App.jsx`. Use the existing `pageVariants` and `pageTransition` patterns for new routes.

Conventions and patterns to follow
- Component names: use PascalCase and export default where present (e.g., `export default Pagamento`).
- UI primitives are JSX files under `src/components/ui/` and usually accept `className` and `asChild` props. Reuse variants defined in `buttonVariants` and other utilities.
- Formatting & utilities: keep input formatting in page components (see `Pagamento.jsx`) for masks. Prefer small, single-purpose functions for formatting.
- Accessibility: most UI primitives include common a11y props (labels, aria). Keep label/placeholder/error patterns consistent with `Pagamento.jsx` and `Contato.jsx`.

Integration points
- Backend API URL: the backend expects environment variable `VITE_API_URL` (see backend docs in `escrita360_BACKEND/docs/FRONTEND_INTEGRATION.md`). Use `import.meta.env.VITE_API_URL` for API calls.
- Authentication & payments: Backend uses JWT and Stripe. Frontend currently stubs payment success (simulated timeout in `Pagamento.jsx`). For real integration, submit to backend endpoints such as `/api/payment/create-payment-intent`.

Files to reference when making changes
- Routing & page flow: `src/App.jsx`, `src/pages/*`
- Layout & header/footer: `src/components/Layout.jsx`
- UI components: `src/components/ui/*` (Button, Input, Card, Sheet, Badge, etc.)
- Utilities: `src/lib/utils.js` (class merging `cn`)
- Hooks: `src/hooks/*` (e.g., `use-scroll-animation`, `use-mobile`)

Testing / Debugging notes
- No unit tests in the repo; prefer manual validation in the browser when changing UI.
- Use Vite dev server to quickly validate UI changes and route/state behavior.

When creating PRs
- Keep changes small and focused. Import new code through `@/` alias.
- Update docs in `docs/` if behavior or UX changes (e.g., payment behavior). Add backend environment changes to `escrita360_BACKEND/.env.example` if necessary.

Examples
- Navigate with state: see `Precos.jsx` handleOpenPagamento → `navigate('/pagamento', { state: { selectedPlan: plan, isYearly } })`.
- Format input: `formatExpiryDate`, `formatCardNumber` functions in `Pagamento.jsx`.

If you need more info
- Check backend docs in `escrita360_BACKEND/docs` for API specs and env requirements.

Keep outputs actionable and limited to changes appropriate for the codebase. Avoid speculative refactors without tests or a brief plan in the PR description.
