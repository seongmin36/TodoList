# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# bcrypt 등 네이티브 모듈 빌드
RUN apk add --no-cache python3 make g++

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# workspace 설정 + 소스 (install 전에 복사해야 workspace symlink가 install 후 덮어쓰이지 않음)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/schemas ./packages/schemas
COPY apps/server ./apps/server

RUN pnpm install --frozen-lockfile

RUN pnpm --filter server build

# monorepo prod 의존성을 단일 디렉터리로 추출 (runner에서 pnpm install 재실행 불필요)
RUN pnpm deploy --filter=server --prod --legacy /prod/server \
    && cp -r apps/server/dist /prod/server/dist

# ── Stage 2: production ──────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /prod/server ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
