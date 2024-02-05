FROM node:20-alpine AS build

RUN yarn set version berry
WORKDIR /app
COPY ./package.json yarn.lock tsconfig.json ./
COPY packages/file-graph/package.json ./packages/file-graph/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/models/package.json ./packages/models/package.json
COPY packages/constants/package.json ./packages/constants/package.json
COPY server/package.json ./server/package.json
RUN yarn install
# Install docker cli
COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Production
FROM build as prod

COPY packages/file-graph ./packages/file-graph
COPY packages/utils ./packages/utils
COPY packages/models ./packages/models
COPY packages/constants ./packages/constants
COPY server ./server
COPY quests ./quests

ENV NODE_ENV=production
RUN yarn build
WORKDIR /app/server
CMD [ "yarn", "start" ]

# Development
FROM build as dev

RUN yarn install --frozen-lockfile
COPY server/nodemon.json ./server/nodemon.json
COPY tsconfig.json ./tsconfig.json
COPY server/tsconfig.json ./server/tsconfig.json
ENV NODE_ENV=development
CMD [ "yarn", "server" ]