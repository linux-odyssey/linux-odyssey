FROM node:20-alpine AS build

WORKDIR /app
COPY ./package.json yarn.lock ./
COPY server/package.json ./server/package.json
COPY packages/file-graph/package.json ./packages/file-graph/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/models/package.json ./packages/models/package.json
RUN yarn install --frozen-lockfile --production

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Production
FROM build as prod

COPY ./server ./server
COPY packages/file-graph ./packages/file-graph
COPY packages/utils ./packages/utils
COPY packages/models ./packages/models
COPY quests ./quests

ENV NODE_ENV=production

WORKDIR /app/server

CMD [ "yarn", "start" ]

# Development
FROM build as dev

RUN yarn install --frozen-lockfile

ENV NODE_ENV=development

CMD [ "yarn", "server" ]