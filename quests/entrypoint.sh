#!/bin/sh

USERNAME=commander

echo "Initializing container for $USERNAME"

if ! id -u ${USERNAME} >/dev/null 2>&1; then
  echo "Adding user $USERNAME"
  adduser --disabled-password --gecos '' --shell /bin/zsh ${USERNAME} && \
  find / -name ".gitkeep" -type f -exec rm -f {} +

  echo "Adding public key for $USERNAME"
  PUB_KEY=/etc/ssh/authorized_keys/${USERNAME}
  cp /ssh_key.pub ${PUB_KEY}
  chmod 644 ${PUB_KEY}
fi

mkdir -p /run/sshd
echo "Starting SSH server"
/usr/sbin/sshd -D -e
