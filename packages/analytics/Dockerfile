FROM node:20-alpine as build

WORKDIR /app
COPY ./package.json yarn.lock tsconfig.json ./
COPY packages/analytics/package.json ./packages/analytics/package.json
COPY packages/models/package.json ./packages/models/package.json
RUN yarn install --frozen-lockfile
ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

# Production stage
FROM build as prod
COPY packages/analytics ./packages/analytics
COPY packages/models ./packages/models
ENV NODE_ENV=production
WORKDIR /app/packages/analytics
RUN yarn build
CMD [ "yarn", "start" ]