FROM node:20-alpine AS build

WORKDIR /app
COPY ./package.json yarn.lock ./
COPY server/package.json ./server/package.json
RUN yarn install
# Install docker cli
COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/
COPY server ./server
COPY packages ./packages
COPY tsconfig.json ./tsconfig.json
RUN yarn workspace server build

# Production
FROM node:20-alpine as prod

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server ./server
COPY ./quests ./quests

ENV NODE_ENV=production
WORKDIR /app/server
CMD [ "yarn", "start" ]

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
