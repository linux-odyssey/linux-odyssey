FROM node:20-alpine as build

WORKDIR /app
COPY ./package.json yarn.lock ./
COPY packages/analytics/package.json ./packages/analytics/package.json
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./tsconfig.json
COPY packages ./packages

RUN yarn workspace analytics build

# Production stage
FROM node:20-alpine as prod

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/analytics ./packages/analytics

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

WORKDIR /app/packages/analytics
CMD [ "yarn", "start" ]