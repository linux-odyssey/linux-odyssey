FROM alpine:3.18

LABEL maintainer="wancat@wancat.cc"

RUN apk add --no-cache \
  vim \
  zsh \
  nodejs \
  yarn 

WORKDIR /usr/local/lib/container

COPY ./packages/container/package.json ./yarn.lock ./
RUN yarn install --modules-folder /usr/src/node_modules
ENV NODE_PATH=/usr/src/node_modules
COPY ./packages/container /usr/local/lib/container
COPY ./quests/.includes/zshrc /etc/zsh/zshrc

ENV USERNAME=commander

RUN adduser --disabled-password --gecos '' --shell /bin/zsh ${USERNAME}

USER ${USERNAME}

WORKDIR /home/${USERNAME}
CMD [ "/bin/zsh" ]
