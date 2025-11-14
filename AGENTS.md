# Repository Guidelines

## Project Structure & Module Organization
- `client/` hosts the React 19 + Vite frontend (`src/` for UI logic, `components/` for feature areas, `STATIC_DATA/` for mock data, `context/` for providers). Keep reusable primitives in `components/ui` and route shells in `components/<Feature>/`.
- `server/` contains the NestJS API (`src/` modules, `seed.ts`, and TypeORM entities). SQLite state lives in `server/observer-finance.db` and is recreated via the seed script.
- Root docs like `README.md`, `CLAUDE.md`, and `INTEGRATION_GUIDE.md` explain architecture and integration; update them whenever structure changes.

## Build, Test, and Development Commands
```bash
cd client && npm install && npm run dev        # Vite dev server at :5174
cd client && npm run build && npm run preview  # Type-check + production bundle
cd server && npm install && npm run seed       # Populate SQLite with demo data
cd server && npm run start:dev                 # NestJS watcher at :3100/api
cd server && npm run test                      # Jest unit tests
cd server && npm run lint                      # ESLint across src/apps/libs/test
```

## Auth & Account Workflows
- All passwords are hashed with bcrypt on the server; never store or log raw passwords.
- Registration immediately authenticates the user; OTP emails are dispatched right after login so they can verify later via `/verify-email` or POST `/auth/verify-email`. Use `/auth/resend-verification` if the 15-minute window lapses.
- Forgot-password UX lives at `/forgot-password` and `/reset-password`; the backend sends 30-minute reset links via `APP_URL/reset-password?token=...`.
- Configure `APP_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM` in `server/.env` so verification and reset emails can be delivered (otherwise they are logged to the console for local development).

## Coding Style & Naming Conventions
- TypeScript everywhere; prefer functional React components with PascalCase file names (e.g., `AddTransactionDialog.tsx`) and hook files in camelCase (`use-mobile.ts`).
- Frontend uses 4-space indentation, double quotes, and Tailwind utility ordering that groups layout → color → state. Run `npm run lint` in each package before committing.
- Backend DTOs, services, and controllers live under `server/src/<domain>/`; name files with `.controller.ts`, `.service.ts`, `.entity.ts` and keep providers registered in the feature module.

## Testing Guidelines
- Backend tests rely on Jest with specs ending in `.spec.ts`; place them next to the source they cover. Use `npm run test:cov` to ensure new modules keep coverage near existing levels (~70%+).
- Frontend automated tests are not wired yet; when adding them, colocate `*.test.tsx` files with components and expose a matching `npm run test` script so CI can call it.
- Always seed the DB before API tests to guarantee deterministic fixtures.

## Commit & Pull Request Guidelines
- Follow the existing short imperative style (`modify client for theme adjustment ...`). Keep commits scoped to one concern and avoid noise such as build artifacts.
- Pull requests should include: problem statement, summary of changes, testing evidence (`npm run test`, screenshots of key UI states), and references to related issues or TODOs. Mention any schema or environment-breaking changes explicitly.

## Security & Configuration Tips
- Never commit `.env`; copy from `server/.env.example` and keep `JWT_SECRET` unique per environment.
- SQLite files are developer-local—clear them with `rm server/observer-finance.db && npm run seed` instead of sharing over Git.
- Store API URLs in environment variables so swapping between local and hosted backends does not require code edits.
