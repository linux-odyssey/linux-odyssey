FROM node:latest

RUN apt-get update && apt-get install -y \
  locales \
  curl \
  vim \
  zsh 

RUN sed -i -e 's/# zh_TW.UTF-8 UTF-8/zh_TW.UTF-8 UTF-8/' /etc/locale.gen && \
  dpkg-reconfigure --frontend=noninteractive locales && \
  update-locale LANG=zh_TW.UTF-8

ENV LANG zh_TW.UTF-8
ENV LANGUAGE zh_TW:zh
ENV LC_ALL zh_TW.UTF-8

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
