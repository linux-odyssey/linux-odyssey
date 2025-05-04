FROM node:20-alpine AS build

WORKDIR /app
COPY ./package.json yarn.lock ./
COPY services/analytics/package.json ./services/analytics/package.json
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./tsconfig.json
COPY packages ./packages
COPY services/analytics ./services/analytics

RUN yarn workspace analytics build

# Production stage
FROM node:20-alpine AS prod

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/analytics ./services/analytics

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

WORKDIR /app/services/analytics
CMD [ "yarn", "start" ]