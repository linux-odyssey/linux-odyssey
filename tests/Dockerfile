FROM cypress/included:13.3.2

WORKDIR /app
COPY package.json yarn.lock ./
COPY tests/package.json ./tests/package.json

WORKDIR /app/tests
RUN yarn install --frozen-lockfile
