FROM cypress/browsers

COPY --from=oven/bun:1.3.14 /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /e2e
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
RUN bun install --frozen-lockfile

COPY quests ./quests
COPY tests ./tests
WORKDIR /e2e/tests

CMD [ "bun", "run", "test" ]
