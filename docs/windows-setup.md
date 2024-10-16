# Windows Environment Setup

## Prerequisites

1. Have a computer with Windows 10 or later.
1. Install WSL and Ubuntu on Windows.
1. Enter Ubuntu terminal.

## Setup Environment (In Ubuntu terminal)

1. Update and upgrade

   ```
   $ sudo apt-get update
   $ sudo apt-get upgrade
   ```

1. Install Git

   ```
   $ sudo apt-get install git
   ```

1. Install Node.js (Version 20.x)

   ```
   $ curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   $ sudo apt-get install nodejs
   ```

1. [Install Docker](#install-docker)
1. [Install Python 2.7](#install-python-27)

## Run the Project (In Ubuntu terminal)

1.  Installation

    ```
    $ git clone https://github.com/lancatlin/linux-odyssey.git
    $ cd linux-odyssey
    $ yarn install
    ```

1.  Docker setup

    ```
    $ docker compose pull
    $ docker compose build
    $ docker-compose up -d
    ```

    <!-- Check folder ./config exist and is empty -->
    <!-- Check .env file exist -->

1.  Run the project

    ```
    $ yarn build
    $ yarn dev
    ```

    <!-- Check ./config/ssh_key.pub is a file not a folder -->

## References

### Install Docker

(Refer to [get.docker.com](https://get.docker.com/))

To install the latest stable versions of Docker CLI, Docker Engine, and their
dependencies:

1. Download the script

   ```
   $ curl -fsSL https://get.docker.com -o install-docker.sh
   ```

1. verify the script's content

   ```
   $ cat install-docker.sh
   ```

1. run the script with --dry-run to verify the steps it executes

   ```
   $ sh install-docker.sh --dry-run
   ```

1. run the script either as root, or using sudo to perform the installation.

   ```
   $ sudo sh install-docker.sh
   ```

1. Verify the installation

   ```
   $ docker --version
   ```

### Install Python 2.7

1. Install required packages

   ```
   $ sudo apt install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses-dev xz-utils tk-dev libffi-dev liblzma-dev python3-openssl git
   ```

1. Install pyenv

   ```
   $ curl https://pyenv.run | bash
   ```

1. Add following lines to bash configuration file (e.g. `~/.bashrc`, `~/.bash_profile`, `~/.zshrc`)

   ```
   export PATH="$HOME/.pyenv/bin:$PATH"
   eval "$(pyenv init --path)"
   eval "$(pyenv init -)"
   eval "$(pyenv virtualenv-init -)"
   ```

1. Restart the shell

1. Install Python 2.7.18 using pyenv

   ```
   $ pyenv install 2.7.18
   ```

1. Set Python 2.7.18 as the global version

   ```
   $ pyenv global 2.7.18
   ```

1. Verify the installation

   ```
   $ python --version
   ```
