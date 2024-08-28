# Base stage
FROM node:20-alpine as base

WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY packages/file-graph/package.json ./packages/file-graph/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/constants/package.json ./packages/constants/package.json
COPY packages/models/package.json ./packages/models/package.json
COPY app/package.json ./app/package.json
RUN yarn install --frozen-lockfile

# Dev stage
FROM base as dev
WORKDIR /app/app
CMD [ "yarn", "dev:docker", "--host", "0.0.0.0" ]

# Build stage
FROM base as build
COPY packages/file-graph ./packages/file-graph
COPY packages/utils ./packages/utils
COPY packages/constants ./packages/constants
COPY packages/models ./packages/models
COPY app ./app
RUN yarn workspace app build

# Production stage
FROM nginx:stable-alpine as prod
COPY --from=build /app/app/dist /usr/share/nginx/html
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
