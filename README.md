# Node Fullstack Template

[![CI](https://github.com/iGmainC/node-fullstack-template/actions/workflows/ci.yml/badge.svg)](https://github.com/iGmainC/node-fullstack-template/actions/workflows/ci.yml)
[![Bun](https://img.shields.io/badge/Bun-1.3+-black?logo=bun)](https://bun.sh)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![License](https://img.shields.io/github/license/iGmainC/node-fullstack-template)](./LICENSE)

English | [简体中文](#中文说明)

A production-minded full-stack starter powered by Bun, Vite 8, React 19, Hono, tRPC, Better Auth, Prisma and PostgreSQL.

[Use this template](https://github.com/new?template_name=node-fullstack-template&template_owner=iGmainC)

## Why this template

- One Vite development process for frontend HMR and a hot-reloaded Hono backend.
- Route-aware HTTP and WebSocket proxying through [`@igmainc/vite-plugin-hono-dev`](https://github.com/iGmainC/vite-plugin-hono-dev).
- Explicit Node and Bun backend entrypoints, so each runtime uses its native Hono adapter.
- Typed APIs with tRPC, authentication with Better Auth, and PostgreSQL access through Prisma.
- React Compiler, TanStack Router, Tailwind CSS and shadcn/ui ready to extend.
- Reproducible CI, dual-runtime backend builds, Docker images and an MIT license.

## Quick start

Requirements: Bun 1.3+, Node.js 22.14+ for the optional Node runtime, Docker, and Docker Compose.

```bash
git clone https://github.com/iGmainC/node-fullstack-template.git my-app
cd my-app
bun install
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d
bun run db:push
bun run dev
```

Open <http://localhost:5173>. The page includes HTTP, tRPC, Better Auth, and WebSocket playgrounds. Requests registered by Hono are proxied to the managed backend at <http://localhost:8787>.

## Runtime model

The default `bun run dev` command starts Vite under Bun. The plugin uses `runtime: "auto"`, and `vite.config.ts` selects the matching backend entry:

| Command | Vite host | Backend entry | Hono adapter |
| --- | --- | --- | --- |
| `bun run dev` | Bun | `server.bun.ts` | `Bun.serve()` + `hono/bun` |
| `bun run dev:node` | Node | `server.ts` | `@hono/node-server` + `@hono/node-ws` |

This keeps runtime-specific WebSocket wiring out of the shared application composition in `apps/backend/app.ts`.

## Project layout

```text
apps/
  frontend/                 React and TanStack Router application
  backend/
    app.ts                  Shared Hono route composition
    server.ts               Node production/development entry
    server.bun.ts           Bun production/development entry
packages/
  components/               Shared shadcn/ui components
  lib/                      Shared utilities
  prisma/                   Generated Prisma Client (gitignored)
  env.ts                    Validated environment contract
prisma/
  schema.prisma             PostgreSQL schema
```

## Commands

```bash
bun run dev                 # full-stack development under Bun
bun run dev:node            # full-stack development under Node
bun run dev:backend:bun     # standalone Bun backend on :3000
bun run dev:backend:node    # standalone Node backend on :3000
bun run db:generate         # generate Prisma Client
bun run db:push             # sync the development database schema
bun run db:studio           # open Prisma Studio
bun run typecheck           # generate Prisma Client and check TypeScript
bun run build               # build frontend plus Node and Bun backends
bun run verify              # formatting, lint, types, and production builds
```

## Build outputs

```text
dist/
  frontend/
  backend/
    server.node.js
    server.bun.js
```

The provided backend container uses the Bun artifact. The Node artifact is available for Node-based deployment targets.

## Docker deployment

Build the application artifacts before building the small runtime images:

```bash
cp .env.example .env
# Replace BETTER_AUTH_SECRET before any non-local deployment.
bun run build
docker compose up --build -d
```

- Frontend and API gateway: <http://localhost:8080>
- Direct backend port: <http://localhost:3000>
- PostgreSQL: `localhost:5432`

## Verification

Every push to `main` and every pull request runs `bun install --frozen-lockfile` followed by `bun run verify`. Run the same command locally before submitting changes.

## License

[MIT](./LICENSE)

---

## 中文说明

[返回英文](#node-fullstack-template)

一个面向真实项目起步的全栈模板，技术栈包括 Bun、Vite 8、React 19、Hono、tRPC、Better Auth、Prisma 与 PostgreSQL。

[使用此模板创建仓库](https://github.com/new?template_name=node-fullstack-template&template_owner=iGmainC)

### 模板能力

- 一个 Vite 开发进程同时提供前端 HMR 与 Hono 后端热更新。
- 通过 [`@igmainc/vite-plugin-hono-dev`](https://github.com/iGmainC/vite-plugin-hono-dev) 按 Hono 路由代理 HTTP 与 WebSocket。
- Node 与 Bun 使用各自独立的后端入口和原生 Hono adapter，不混用运行时语义。
- 内置 tRPC 类型安全 API、Better Auth、Prisma 与 PostgreSQL。
- 已接入 React Compiler、TanStack Router、Tailwind CSS 和 shadcn/ui。
- 提供可复现 CI、双运行时后端产物、Docker 部署与 MIT License。

### 快速开始

需要 Bun 1.3+、Docker 与 Docker Compose；只有使用 Node 开发入口时才需要 Node.js 22.14+。

```bash
git clone https://github.com/iGmainC/node-fullstack-template.git my-app
cd my-app
bun install
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d
bun run db:push
bun run dev
```

打开 <http://localhost:5173>。首页内置 HTTP、tRPC、Better Auth 和 WebSocket 调试入口；Hono 已注册路由会被代理到 <http://localhost:8787> 的托管后端。

### 运行时模型

默认的 `bun run dev` 在 Bun 中启动 Vite。插件配置使用 `runtime: "auto"`，同时 `vite.config.ts` 会选择与宿主一致的后端入口：

| 命令 | Vite 宿主 | 后端入口 | Hono adapter |
| --- | --- | --- | --- |
| `bun run dev` | Bun | `server.bun.ts` | `Bun.serve()` + `hono/bun` |
| `bun run dev:node` | Node | `server.ts` | `@hono/node-server` + `@hono/node-ws` |

共享路由只在 `apps/backend/app.ts` 组装，运行时专属的 WebSocket 接线不会泄漏到另一套 adapter。

### 常用命令

```bash
bun run dev                 # Bun 全栈开发
bun run dev:node            # Node 全栈开发
bun run dev:backend:bun     # 单独启动 Bun 后端
bun run dev:backend:node    # 单独启动 Node 后端
bun run db:generate         # 生成 Prisma Client
bun run db:push             # 同步本地数据库结构
bun run db:studio           # 打开 Prisma Studio
bun run typecheck           # 生成 Prisma Client 并检查 TypeScript
bun run build               # 构建前端及 Node/Bun 后端
bun run verify              # 格式、Lint、类型和生产构建总检查
```

### 构建产物

```text
dist/
  frontend/
  backend/
    server.node.js
    server.bun.js
```

Docker 后端默认运行 Bun 产物；`server.node.js` 可用于 Node 部署环境。

### Docker 部署

```bash
cp .env.example .env
# 非本地环境务必替换 BETTER_AUTH_SECRET。
bun run build
docker compose up --build -d
```

- 前端及 API 网关：<http://localhost:8080>
- 后端直连端口：<http://localhost:3000>
- PostgreSQL：`localhost:5432`

### 验证与贡献

推送到 `main` 或提交 Pull Request 时，CI 会执行冻结依赖安装和 `bun run verify`。提交改动前建议在本地执行同一命令。

### 许可证

[MIT](./LICENSE)
