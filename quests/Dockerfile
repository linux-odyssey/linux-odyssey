FROM golang:1.24-alpine as cmd-hook-builder
WORKDIR /app
COPY ./services/cmd-hook/go.mod ./
RUN go mod download
COPY ./services/cmd-hook ./
RUN go build -o cmd-hook

FROM golang:1.24-alpine as terminal-builder
WORKDIR /app
COPY ./services/terminal-service/go.mod ./
COPY ./services/terminal-service/go.sum ./
RUN go mod download
COPY ./services/terminal-service ./
RUN go build -o terminal-service

FROM debian:bookworm-slim as main

LABEL maintainer="wancat@wancat.cc"

RUN apt-get update && apt-get install -y \
  vim \
  zsh \
  curl \
  sudo
COPY ./quests/.includes/zshrc /etc/zsh/zshrc
RUN rm -rf /etc/skel && mkdir -p /etc/skel
COPY ./quests/entrypoint.sh /entrypoint.sh
COPY --from=cmd-hook-builder /app/cmd-hook /usr/local/lib/cmd-hook/cmd-hook
COPY --from=terminal-builder /app/terminal-service /usr/local/lib/terminal-service/terminal-service

EXPOSE 9090

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
