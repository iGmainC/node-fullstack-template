# Node Fullstack Template (Bun Workspaces)

## Workspace Structure

```text
apps/
  frontend/   # React + Vite
  backend/    # Hono app
package/      # shared logic / dev plugins
```

## Scripts

Run from repo root:

```bash
bun install
bun run dev
bun run build
bun run typecheck
```

## Path Aliases

TypeScript + Vite aliases:

- `@package/*` -> `package/*`
- `@frontend/*` -> `apps/frontend/src/*`
- `@backend/*` -> `apps/backend/src/*`

This supports shared logic and cross-package type usage (for example frontend importing backend types for tRPC).

## Dev Flow

- Start frontend Vite in `apps/frontend`
- A custom plugin starts Hono backend and proxies matched backend routes
- Backend code changes hot-reload without restarting the dev process

## Docker

Build frontend image (Caddy static hosting):

```bash
docker build -f Dockerfile.frontend -t app-frontend .
```

Build backend image (Bun runtime):

```bash
docker build -f Dockerfile.backend -t app-backend .
```

Run frontend container:

```bash
docker run --rm -p 8080:80 app-frontend
```

Run backend container:

```bash
docker run --rm -p 3000:3000 --env-file .env app-backend
```
