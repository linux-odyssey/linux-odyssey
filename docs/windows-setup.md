# Windows Environment Setup

## Install WSL and Ubuntu

Please refer to the Official [Setup WSL](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) on Microsoft's website.

Run the following command in PowerShell as Administrator:

    wsl --install

Then restart the computer. After restarting, you can open Ubuntu terminal by searching "Ubuntu" in Start menu. You will be prompted to create a new user account. Once you have done that, you can continue with the following steps.

## Setup Environment (In Ubuntu terminal)

1. Update and upgrade

   ```
   sudo apt-get update
   sudo apt-get upgrade
   ```

1. Install Git

   ```
   sudo apt-get install git
   ```

1. Install Node.js (Version 20.x)

   ```
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install nodejs
   sudo apt install build-essential
   sudo npm install -g yarn
   ```

## Install Docker

(Refer to [get.docker.com](https://get.docker.com/))

To install the latest stable versions of Docker CLI, Docker Engine, and their
dependencies:

1. Download the script

   ```
   curl -fsSL https://get.docker.com -o install-docker.sh
   ```

1. verify the script's content

   ```
   cat install-docker.sh
   ```

1. run the script with --dry-run to verify the steps it executes

   ```
   sh install-docker.sh --dry-run
   ```

**NOTE: the script will recommend you to use Docker Desktop instead, but we need to use Docker inside WSL for the backend to work.** Just ignore it and wait for the installation to finish.

1. run the script either as root, or using sudo to perform the installation.

   ```
   sudo sh install-docker.sh
   ```

1. Verify the installation

   ```
   docker --version
   ```

1. Add your user to the docker group

   ```
   sudo usermod -aG docker $USER
   ```

   **NOTE: You need to create a new WSL terminal to apply the changes.**

1. Verify the installation

   ```
   docker ps
   ```
   This should return something like:

   CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

## Run the Project (In Ubuntu terminal)

1.  Clone the repository

    ```
    git clone https://github.com/lancatlin/linux-odyssey.git
    cd linux-odyssey
    ```

    Optional: To open the project in VSCode, run the following command inside the project folder:

    ```
    code .
    ```

1. Install dependencies

    ```
    yarn install
    ```
    It is ok if there are some warnings and `gyp: ERR` errors, just verify there is `done` at the end.

1. Copy the environment variables

    ```
    cp .env.sample .env
    ```

1.  Docker setup

    ```
    docker compose pull
    docker compose build
    docker compose up -d db
    ```

    <!-- Check folder ./config exist and is empty -->
    <!-- Check .env file exist -->

1.  Run the project

    ```
    yarn build
    yarn dev
    ```

    <!-- Check ./config/ssh_key.pub is a file not a folder -->

Enjoy!