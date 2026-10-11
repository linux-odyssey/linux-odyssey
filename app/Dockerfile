# Base stage
FROM oven/bun:1.3.14-alpine AS build

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
RUN bun install --frozen-lockfile --filter app

COPY tsconfig.json ./tsconfig.json
COPY server ./server
COPY packages ./packages
COPY app ./app
RUN bun run --filter app build

# Production stage
FROM nginx:stable-alpine AS prod
COPY --from=build /app/app/dist /usr/share/nginx/html
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
