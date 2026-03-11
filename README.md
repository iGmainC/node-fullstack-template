# Node Fullstack Template

[中文文档](#中文说明)

Fullstack template powered by `Bun + Vite + React + Hono + tRPC + Prisma`.

## Tech Stack

- Runtime/PM: `bun`
- Frontend: `react`, `vite`, `@tanstack/react-router`, `tailwindcss`, `shadcn`
- Backend: `hono`, `@hono/node-server`, `trpc`
- DB/ORM: `prisma`, `@prisma/client`, `pg`
- Tooling: `typescript`, `eslint`, `biome`

## Workspace Layout

```text
apps/
  frontend/                 # frontend app
  backend/                  # backend app (Hono)
packages/
  components/               # shared UI components (shadcn)
  lib/                      # shared utils
  prisma/                   # Prisma generated types
  env.ts                    # env schema
```

## Quick Start

```bash
bun install
cp .env.example .env
bun run dev
```

Default dev endpoints:
- Frontend: `http://localhost:5173`
- Backend (started by dev proxy): `http://localhost:8787`

## Scripts

Run from project root:

```bash
bun run dev       # start frontend dev server + managed backend dev proxy
bun run build     # build frontend + bundle backend into dist/
bun run clean     # remove dist
bun run lint      # run ESLint
bun run format    # run Biome format
```

## Path Aliases

Shared by `tsconfig` and `vite`:

- `@packages/*` -> `packages/*`
- `@frontend/*` -> `apps/frontend/*`
- `@backend/*` -> `apps/backend/*`

## Dev Flow

`bun run dev` starts Vite and loads `@igmainc/vite-plugin-hono-dev`:

- Loads `apps/backend/server.ts`
- Proxies requests by matching registered Hono routes
- Hot reloads backend code without manual restart

## Build Outputs

```text
dist/
  frontend/                 # Vite frontend build
  backend/server.js         # Bun bundled backend entry
```

## Docker (Optional)

```bash
# Frontend
docker build -f Dockerfile.frontend -t app-frontend .
docker run --rm -p 8080:80 app-frontend

# Backend
docker build -f Dockerfile.backend -t app-backend .
docker run --rm -p 3000:3000 --env-file .env app-backend
```

## 中文说明

[Back to English](#node-fullstack-template)

基于 `Bun + Vite + React + Hono + tRPC + Prisma` 的全栈模板。

### 技术栈

- Runtime/包管理: `bun`
- 前端: `react`, `vite`, `@tanstack/react-router`, `tailwindcss`, `shadcn`
- 后端: `hono`, `@hono/node-server`, `trpc`
- 数据库/ORM: `prisma`, `@prisma/client`, `pg`
- 工具链: `typescript`, `eslint`, `biome`

### 目录结构

```text
apps/
  frontend/                 # 前端应用
  backend/                  # 后端应用（Hono）
packages/
  components/               # 共享 UI 组件（shadcn）
  lib/                      # 共享工具函数
  prisma/                   # Prisma 生成类型
  env.ts                    # 环境变量定义
```

### 快速开始

```bash
bun install
cp .env.example .env
bun run dev
```

默认开发地址：
- 前端: `http://localhost:5173`
- 后端（由开发代理启动）: `http://localhost:8787`

### 常用脚本

在仓库根目录执行：

```bash
bun run dev
bun run build
bun run clean
bun run lint
bun run format
```

### 路径别名

`tsconfig` / `vite` 共享别名：

- `@packages/*` -> `packages/*`
- `@frontend/*` -> `apps/frontend/*`
- `@backend/*` -> `apps/backend/*`

### 开发流程

`bun run dev` 会启动 Vite，并加载 `@igmainc/vite-plugin-hono-dev`：

- 加载 `apps/backend/server.ts`
- 按 Hono 已注册路由进行请求代理
- 后端变更支持热重载，无需手动重启

### 构建产物

```text
dist/
  frontend/                 # Vite 前端产物
  backend/server.js         # Bun 打包后的后端入口
```

### Docker（可选）

```bash
# Frontend
docker build -f Dockerfile.frontend -t app-frontend .
docker run --rm -p 8080:80 app-frontend

# Backend
docker build -f Dockerfile.backend -t app-backend .
docker run --rm -p 3000:3000 --env-file .env app-backend
```
