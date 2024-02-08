FROM cypress/browsers:node-20.11.0-chrome-121.0.6167.85-1-ff-120.0-edge-121.0.2277.83-1

WORKDIR /e2e
RUN yarn set version stable
COPY package.json yarn.lock ./
COPY tests/package.json ./tests/package.json
RUN yarn config set -H enableImmutableInstalls false
RUN yarn install

COPY quests ./quests
COPY tests ./tests
WORKDIR /e2e/tests
CMD [ "yarn", "test:e2e" ]