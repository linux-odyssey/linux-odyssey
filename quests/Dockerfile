FROM golang:1.24-alpine as builder

WORKDIR /app

COPY ./services/cmd-hook/go.mod ./

RUN go mod download

COPY ./services/cmd-hook ./

RUN go build -o cmd-hook

FROM debian:bookworm-slim as main

LABEL maintainer="wancat@wancat.cc"

RUN apt-get update && apt-get install -y \
  vim \
  zsh \
  curl \
  openssh-server

COPY --from=builder /app/cmd-hook /usr/local/bin/cmd-hook
COPY ./quests/.includes/zshrc /etc/zsh/zshrc
RUN rm -f /etc/motd /etc/issue /etc/issue.net /etc/update-motd.d/*
RUN rm -rf /etc/skel && mkdir -p /etc/skel
RUN mkdir -p /etc/ssh/authorized_keys && chmod 755 /etc/ssh/authorized_keys
COPY ./quests/.includes/sshd_config /etc/ssh/sshd_config
COPY ./quests/entrypoint.sh /entrypoint.sh

EXPOSE 22

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
