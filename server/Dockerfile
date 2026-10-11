FROM oven/bun:1.3.14-alpine AS prod

WORKDIR /app
COPY package.json bun.lock ./
COPY app/package.json ./app/package.json
COPY server/package.json ./server/package.json
COPY services/analytics/package.json ./services/analytics/package.json
COPY tests/package.json ./tests/package.json
COPY packages/constants/package.json ./packages/constants/package.json
COPY packages/file-graph/package.json ./packages/file-graph/package.json
COPY packages/game/package.json ./packages/game/package.json
COPY packages/models/package.json ./packages/models/package.json
COPY packages/utils/package.json ./packages/utils/package.json
RUN bun install --frozen-lockfile --production --filter server

# Install docker cli
COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/
COPY tsconfig.json ./tsconfig.json
COPY packages ./packages
COPY server ./server
COPY ./quests ./quests

ENV NODE_ENV=production
WORKDIR /app/server
CMD [ "bun", "src/index.ts" ]

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
