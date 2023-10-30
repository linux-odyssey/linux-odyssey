FROM node:20-alpine as build

WORKDIR /app
COPY ./package.json yarn.lock ./
COPY packages/analytics/package.json ./packages/analytics/package.json
COPY packages/models/package.json ./packages/models/package.json
RUN yarn install --frozen-lockfile --production
ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

# Production stage
FROM build as prod
COPY packages/analytics ./packages/analytics
COPY packages/models ./packages/models
ENV NODE_ENV=production
WORKDIR /app/packages/analytics
CMD [ "yarn", "start" ]

# Development stage
FROM build as dev
RUN yarn install --frozen-lockfile
WORKDIR /app/packages/analytics
ENV NODE_ENV=development
CMD [ "yarn", "dev" ]
