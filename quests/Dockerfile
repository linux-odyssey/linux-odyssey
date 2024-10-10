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

ENV USERNAME=commander

RUN adduser --disabled-password --gecos '' --shell /bin/zsh ${USERNAME}
COPY ./ssh_pubkey /home/${USERNAME}/.ssh/authorized_keys
RUN chmod 600 /home/${USERNAME}/.ssh/authorized_keys \
  && chmod 700 /home/${USERNAME}/.ssh \
  && chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/.ssh

RUN service ssh start

EXPOSE 22

CMD [ "/usr/sbin/sshd", "-D" ]
