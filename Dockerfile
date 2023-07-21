FROM node

WORKDIR /app
COPY package.json yarn.lock ./
COPY server/package.json ./server/
RUN yarn install --frozen-lockfile --production

WORKDIR /app/server

COPY server/src ./src
COPY server/quests ./quests
COPY server/swagger.yaml .

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD [ "yarn", "start" ]