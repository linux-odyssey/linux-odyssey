FROM node:latest

RUN apt-get update && apt-get install -y \
  curl \
  vim \
  jq

RUN adduser --disabled-password --gecos '' rudeus

USER rudeus

WORKDIR /home/rudeus

COPY ./server/quests/helloworld/home /home/rudeus/

COPY ./packages/cli/cli.js /usr/local/bin/cli.js

CMD [ "/bin/bash" ]
