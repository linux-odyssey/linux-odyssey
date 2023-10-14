FROM node

WORKDIR /app
COPY ./package.json yarn.lock ./
COPY server/package.json ./server/package.json
COPY packages/file-graph/package.json ./packages/file-graph/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/models/package.json ./packages/models/package.json
RUN yarn install --frozen-lockfile --production

COPY ./server ./server
COPY packages/file-graph ./packages/file-graph
COPY packages/utils ./packages/utils
COPY packages/models ./packages/models
COPY quests ./quests

WORKDIR /app/server

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD [ "yarn", "start" ]