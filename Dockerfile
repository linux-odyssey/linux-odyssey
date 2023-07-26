FROM node

WORKDIR /app
COPY package.json yarn.lock ./
COPY server/package.json ./server/
RUN yarn install --frozen-lockfile --production

ARG DOCKER_GID=140

RUN groupadd -g $DOCKER_GID docker && usermod -aG docker node

WORKDIR /app/server

USER node

COPY server/src ./src
COPY server/quests ./quests
COPY server/swagger.yaml .

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD [ "yarn", "start" ]