FROM debian:bookworm-slim

LABEL maintainer="wancat@wancat.cc"

RUN apt-get update && apt-get install -y \
  vim \
  zsh \
  curl \
  openssh-server


RUN curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs
RUN npm install -g yarn
RUN node -v && yarn -v

WORKDIR /usr/local/lib/container
COPY ./packages/container/package.json ./yarn.lock ./
RUN yarn install --modules-folder /usr/src/node_modules
ENV NODE_PATH=/usr/src/node_modules
COPY ./packages/container /usr/local/lib/container
COPY ./quests/.includes/zshrc /etc/zsh/zshrc
RUN rm -f /etc/motd /etc/issue /etc/issue.net /etc/update-motd.d/*
RUN rm -rf /etc/skel && mkdir -p /etc/skel
RUN mkdir -p /etc/ssh/authorized_keys && chmod 755 /etc/ssh/authorized_keys
COPY ./quests/.includes/sshd_config /etc/ssh/sshd_config

EXPOSE 22

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
