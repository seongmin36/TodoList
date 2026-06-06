# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# pnpm 활성화
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# workspace 설정 파일 복사
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# 각 패키지의 package.json만 먼저 복사 (레이어 캐시 활용)
COPY apps/server/package.json ./apps/server/
COPY packages/schemas/package.json ./packages/schemas/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY packages/schemas ./packages/schemas
COPY apps/server ./apps/server

# 공유 스키마 빌드 → 서버 빌드
RUN pnpm --filter @repo/schemas build
RUN pnpm --filter server build

# ── Stage 2: production ──────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# workspace 설정 파일 복사
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/schemas/package.json ./packages/schemas/

# 프로덕션 의존성만 설치
RUN pnpm install --frozen-lockfile --prod

# 빌드 결과물 복사
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/schemas/dist ./packages/schemas/dist

WORKDIR /app/apps/server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
