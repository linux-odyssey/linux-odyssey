FROM node:20-alpine as build

WORKDIR /app
COPY ./package.json yarn.lock ./
COPY packages/analytics/package.json ./packages/analytics/package.json
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./tsconfig.json
COPY packages ./packages

ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

# Production stage
FROM node:20-alpine as prod
COPY --from=build /app/packages/analytics ./packages/analytics
ENV NODE_ENV=production
WORKDIR /app/packages/analytics
CMD [ "yarn", "start" ]