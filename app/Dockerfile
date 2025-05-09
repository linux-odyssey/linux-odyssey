# Base stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
COPY app/package.json ./app/package.json
COPY server/package.json ./server/package.json
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./tsconfig.json
COPY server ./server
COPY packages ./packages
COPY app ./app
RUN yarn workspace app build

# Production stage
FROM nginx:stable-alpine AS prod
COPY --from=build /app/app/dist /usr/share/nginx/html
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
