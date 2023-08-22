FROM node

WORKDIR /app
COPY server/package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY server/src ./src
COPY server/swagger.yaml .
COPY quests ./quests

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD [ "yarn", "start" ]