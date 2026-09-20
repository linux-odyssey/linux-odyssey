# Windows Environment Setup

## 1. Install WSL and Ubuntu

Refer to Microsoft’s official [WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install).

Open PowerShell as Administrator and run:

```powershell
wsl --install
```

Restart your computer after the installation finishes.

Open Ubuntu from the Start menu. The first time Ubuntu starts, it will ask you to create a Linux username and password.

Verify that Ubuntu is using WSL 2 by running this command in PowerShell:

```powershell
wsl --update
wsl --list --verbose
```

Ubuntu should show `2` in the `VERSION` column.

If it is using WSL 1, run:

```powershell
wsl --set-version Ubuntu 2
```

## 2. Install Docker Desktop

Install [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/).

Start Docker Desktop after installation.

Docker Desktop normally uses the WSL 2 engine automatically. If the `Use the WSL 2 based engine` option appears under `Settings > General`, ensure it is enabled.

Go to:

```text
Settings > Resources > WSL Integration
```

Enable integration with your Ubuntu distribution, then select **Apply & restart**.

If the WSL Integration section is unavailable, ensure Docker Desktop is using Linux containers.

> [!IMPORTANT]
> Do not separately install Docker Engine inside Ubuntu when using Docker Desktop. Having both installations may cause conflicts.

Open the Ubuntu terminal and verify that Docker is available:

```bash
docker --version
docker compose version
docker run --rm hello-world
```

## 3. Set Up the Ubuntu Environment

Run the following commands in the Ubuntu terminal.

### Update the Package List

```bash
sudo apt update
```

### Install the Required Tools

```bash
sudo apt install -y git curl ca-certificates build-essential
```

### Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install Yarn 1.22

```bash
sudo npm install -g yarn@1.22.22
```

Verify the installations:

```bash
git --version
node --version
npm --version
yarn --version
```

The Node.js version should be `20.x` or later, and the Yarn version should be `1.22.x`.

## 4. Clone the Project

> [!WARNING]
> Clone the repository into the WSL Linux filesystem, such as `~/projects`. Do not place it on a Windows-mounted drive such as `/mnt/c/...` or `/mnt/d/...`. The project uses a bind mount for MongoDB data, and Windows-mounted directories may cause permission and filesystem compatibility problems.

Create and enter a project directory:

```bash
mkdir -p <path-to-projects-directory>
cd <path-to-projects-directory>
```

Clone the repository:

```bash
git clone https://github.com/linux-odyssey/linux-odyssey.git
cd linux-odyssey
```

### Optional: Open the Project in VS Code

Install [Visual Studio Code](https://code.visualstudio.com/) and the **WSL** extension first. Then run:

```bash
code .
```

## 5. Install Project Dependencies

From the project root, run:

```bash
yarn install
```

Warnings during installation may be harmless. The installation succeeded if Yarn finishes with a `Done` message and does not display `error Command failed`.

If a `gyp` error appears, confirm that it belongs to an optional dependency before ignoring it.

## 6. Create the Environment File

Copy the sample environment file:

```bash
cp .env.sample .env
```

Confirm that the file exists:

```bash
ls -la .env
```

The default values are suitable for local development. Do not use the sample secret key in a production environment.

## 7. Start the Docker Services

Ensure Docker Desktop is running, then execute:

```bash
docker compose pull
docker compose build
docker compose up -d
```

Check that the containers are running:

```bash
docker compose ps
```

To stop the Docker services later:

```bash
docker compose down
```

## 8. Run the Project

Start the frontend and backend development servers:

```bash
yarn dev
```

Keep the terminal running and open the following address in your browser:

[http://localhost:8000](http://localhost:8000)

To stop the development servers, press `Ctrl+C`.

### Optional: Verify the Production Build

You can verify that the project builds successfully by running:

```bash
yarn build
```
