#!/bin/sh

USERNAME=commander

if ! id -u ${USERNAME} >/dev/null 2>&1; then
  adduser --disabled-password --gecos '' --shell /bin/zsh ${USERNAME} && \
  mkdir -p /home/${USERNAME}/.ssh && \
  cp /ssh_key.pub /home/${USERNAME}/.ssh/authorized_keys && \
  chmod 600 /home/${USERNAME}/.ssh/authorized_keys && \
  chmod 700 /home/${USERNAME}/.ssh && \
  chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/.ssh
fi

mkdir /run/sshd
echo "Starting SSH server"
/usr/sbin/sshd -D -e
