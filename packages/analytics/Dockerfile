FROM node

WORKDIR /app
COPY ./package.json yarn.lock ./
COPY packages/analytics/package.json ./packages/analytics/package.json
COPY packages/models/package.json ./packages/models/package.json
RUN yarn install --frozen-lockfile --production

COPY packages/analytics ./packages/analytics
COPY packages/models ./packages/models

WORKDIR /app/packages/analytics

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

CMD [ "yarn", "start" ]