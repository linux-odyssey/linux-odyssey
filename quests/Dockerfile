FROM ubuntu:22.04

LABEL maintainer="wancat@wancat.cc"

RUN apt-get update && apt-get install -y \
  locales \
  curl \
  vim \
  zsh \
  ca-certificates \
  gnupg

RUN sed -i -e 's/# zh_TW.UTF-8 UTF-8/zh_TW.UTF-8 UTF-8/' /etc/locale.gen && \
  dpkg-reconfigure --frontend=noninteractive locales && \
  update-locale LANG=zh_TW.UTF-8

ENV LANG zh_TW.UTF-8
ENV LANGUAGE zh_TW:zh
ENV LC_ALL zh_TW.UTF-8

ENV NODE_MAJOR=20
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y

WORKDIR /usr/local/lib/container

RUN npm install -g yarn
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
