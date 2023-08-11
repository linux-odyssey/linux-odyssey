FROM node:latest

RUN apt-get update && apt-get install -y \
  curl \
  vim \
  zsh \
  jq

RUN adduser --disabled-password --gecos '' --shell /bin/zsh rudeus

USER rudeus

WORKDIR /home/rudeus

COPY ./server/quests/helloworld/home /home/rudeus/

COPY ./packages/cli /usr/local/lib/cli

CMD [ "/bin/zsh" ]
