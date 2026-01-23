This project consists of a Vite + React (JSX) frontend and a Node.js + Express backend that integrates with PagBank for payments and Firebase for authentication/administration.

Keep instructions concise and specific to patterns in this repo.

## Essentials for working in this codebase
- **Frontend run locally**: `pnpm install` then `pnpm dev` (Vite dev server on port 5173). Scripts defined in `package.json`.
- **Backend run locally**: In `../backend_siteescrita/`, `npm install` then `npm run dev` (Express on port 5000).
- **Production build**: Frontend `pnpm build` (Vite). Backend deploys as Node.js app.
- **Path alias**: `@/*` maps to `src/*` (see `jsconfig.json`). Use `@/components/...` when adding imports.
- **API URL**: Frontend uses `VITE_API_URL` env var (default `http://localhost:5000/api`).

## Architecture & data flow
- **Frontend routing**: `src/main.jsx` → `src/App.jsx` uses `react-router-dom` for pages. Pages live in `src/pages/`.
- **Backend API**: `../backend_siteescrita/app.js` sets up Express with routes in `app/routes/` (payment, auth, admin, etc.).
- **Payment flow**: Plans page (`src/pages/Planos.jsx`) fetches plans via `plansService.getPlans(audience)` from backend `/api/payment/plans`. Navigates to `src/pages/Pagamento.jsx` with `navigate('/pagamento', { state: { selectedPlan, audience } })`. Payment page submits to backend `/api/payment/create-pagbank-subscription` or similar.
- **Authentication**: JWT-based via `src/contexts/AuthContext.jsx`, backend `app/routes/auth.js`. Firebase admin for user management.
- **UI primitives**: Reusable components under `src/components/ui/*` (Button, Card, Input, etc. from Radix UI). Prefer these for consistency.
- **Styling**: Tailwind CSS via `tailwind.config.js`. Use `cn()` from `src/lib/utils.js` for conditional classes.
- **Animations**: Framer Motion page transitions in `src/App.jsx` with `pageVariants` and `pageTransition`.
- **Services**: Frontend `src/services/` calls backend APIs. Backend `app/services/` handles PagBank, Firebase.

## Conventions and patterns to follow
- **Component names**: PascalCase, export default (e.g., `export default Pagamento`).
- **UI primitives**: JSX files in `src/components/ui/`, accept `className` and `asChild` props. Use variants like `buttonVariants`.
- **Input formatting**: Keep masks in page components (see `Pagamento.jsx` for `formatExpiryDate`, `formatCardNumber`).
- **Accessibility**: UI primitives include a11y props (labels, aria). Match patterns in `Pagamento.jsx` and `Contato.jsx`.
- **Backend routes**: RESTful, async/await, error handling with try/catch, return JSON responses.
- **PagBank integration**: Use services in `app/services/pagbank_*_service.js` for subscriptions, orders, etc. Handle errors per `docs/codigodeerro.md`.
- **Firebase**: Admin SDK in backend for auth/users. Frontend uses Firebase JS SDK for client-side auth.

## Integration points
- **Backend API URL**: `VITE_API_URL` for frontend calls (see `src/services/api.js`).
- **Authentication & payments**: Backend uses JWT and PagBank. Frontend submits payment data to backend endpoints like `/api/payment/create-pagbank-subscription`.
- **Firebase**: Config in `firebase.json`, rules in `firestore.rules`. Admin service in `app/services/firebase_admin_service.js`.
- **PagBank**: Docs in `../backend_siteescrita/docs/`. Test scripts in `scripts/test-pagbank*.js`.

## Files to reference when making changes
- **Frontend routing & pages**: `src/App.jsx`, `src/pages/*`
- **Backend setup & routes**: `../backend_siteescrita/app.js`, `app/routes/*`
- **Layout & components**: `src/components/Layout.jsx`, `src/components/ui/*`
- **Services**: `src/services/*`, `app/services/*`
- **Utilities**: `src/lib/utils.js` (class merging `cn`)
- **Hooks**: `src/hooks/*` (e.g., `use-scroll-animation`)
- **Payment logic**: `src/pages/Pagamento.jsx`, `app/routes/payment.js`

## Testing / Debugging notes
- No unit tests; prefer manual browser validation for UI/route/state behavior.
- Use Vite dev server for frontend changes. Run backend separately with `npm run dev`.
- PagBank testing: Use scripts like `test-pagbank-sandbox.js` for config/card/pix/boleto tests.
- Firebase testing: `test-firebase-integration.js`.

## When creating PRs
- Keep changes focused. Use `@/` alias for imports.
- Update docs in `docs/` or `../backend_siteescrita/docs/` if UX or API changes.
- Add env vars to `.env.example` files if needed.

## Examples
- **Navigate with state**: `navigate('/pagamento', { state: { selectedPlan, audience } })` in `Planos.jsx`.
- **API call**: `api.get('/payment/plans', { params: { audience } })` in `plansService`.
- **Format input**: `formatExpiryDate`, `formatCardNumber` in `Pagamento.jsx`.
- **Backend route**: `router.post('/create-pagbank-subscription', async (req, res) => { ... })` in `payment.js`.

Keep outputs actionable and limited to changes appropriate for the codebase. Avoid speculative refactors without tests or a brief plan in the PR description.
