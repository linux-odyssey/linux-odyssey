#!/bin/sh

USERNAME=commander

echo "Initializing container for $USERNAME"
echo "BACKEND_URL: $BACKEND_URL"

if ! id -u ${USERNAME} >/dev/null 2>&1; then
  echo "Adding user $USERNAME"
  adduser --disabled-password --gecos '' --shell /bin/zsh ${USERNAME} && \
  find / -name ".gitkeep" -type f -exec rm -f {} +
fi

# Preserve environment variables
export BACKEND_URL

echo "Starting terminal service"
su - ${USERNAME} -w BACKEND_URL -c "/usr/local/lib/terminal-service/terminal-service"
