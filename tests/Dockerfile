FROM cypress/browsers

WORKDIR /e2e
COPY package.json yarn.lock ./
COPY tests/package.json ./tests/package.json
RUN yarn install --frozen-lockfile

COPY quests ./quests
COPY tests ./tests
WORKDIR /e2e/tests

CMD [ "yarn", "test" ]
