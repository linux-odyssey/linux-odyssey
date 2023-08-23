FROM node:latest

RUN apt-get update && apt-get install -y \
  curl \
  vim \
  zsh \
  jq

WORKDIR /usr/local/lib/container

COPY ./packages/container/package.json ./yarn.lock ./

RUN yarn install --modules-folder /usr/src/node_modules

ENV NODE_PATH=/usr/src/node_modules

COPY ./packages/container /usr/local/lib/container

RUN adduser --disabled-password --gecos '' --shell /bin/zsh rudeus

USER rudeus

WORKDIR /home/rudeus

COPY ./quests/helloworld/home /home/rudeus/

CMD [ "/bin/zsh" ]
