#!/bin/sh

USERNAME=commander

if ! id -u ${USERNAME} >/dev/null 2>&1; then
  adduser --disabled-password --gecos '' --shell /bin/zsh ${USERNAME} && \
  find / -name ".gitkeep" -type f -exec rm -f {} +

  PUB_KEY=/etc/ssh/authorized_keys/${USERNAME}
  cp /ssh_key.pub ${PUB_KEY}
  chmod 644 ${PUB_KEY}
fi

mkdir -p /run/sshd
echo "Starting SSH server"
/usr/sbin/sshd -D -e
