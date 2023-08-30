# Build stage
FROM node as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
COPY app/package.json ./app/package.json
COPY packages/file-graph/package.json ./packages/file-graph/package.json
RUN yarn install --frozen-lockfile

COPY app ./app
COPY packages/file-graph ./packages/file-graph
RUN yarn build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/app/dist /usr/share/nginx/html
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
