FROM cypress/browsers

WORKDIR /e2e
RUN yarn set version stable
COPY package.json yarn.lock ./
COPY tests/package.json ./tests/package.json
RUN yarn install

COPY quests ./quests
COPY tests ./tests
WORKDIR /e2e/tests

CMD [ "yarn", "test" ]
