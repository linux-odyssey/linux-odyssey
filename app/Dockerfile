# Build stage
FROM node as build-stage
WORKDIR /app
COPY app/package.json yarn.lock ./
RUN yarn install
COPY app .
RUN yarn build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
