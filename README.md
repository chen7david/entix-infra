# entix-infra

## Development Environment

This project is set up for cross-platform development using [Dev Containers](https://containers.dev/) and Docker. The environment is compatible with Apple Silicon (ARM64), Intel Macs, and Windows (Intel/ARM) machines.

### Pre-installed Tools

The devcontainer comes with the following tools and extensions pre-installed:

- **Node.js** (via official devcontainers image)
- **TypeScript** (`typescript`)
- **AWS CLI v2** (auto-detects ARM64/x86-64)
- **AWS CDK** (`aws-cdk`)
- **ts-node**
- **ESLint** (`eslint`)
- **Prettier** (`prettier`)
- **@types/node**
- **VS Code Extensions:**
  - Error Lens (`usernamehw.errorlens`)
  - ESLint (`dbaeumer.vscode-eslint`)
  - GitLens (`eamodio.gitlens`)
  - Prettier (`esbenp.prettier-vscode`)
  - Docker (`ms-azuretools.vscode-docker`)

## Getting Started

### 1. Open in Dev Container

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [VS Code](https://code.visualstudio.com/).
2. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code.
3. Open this repository in VS Code and select **"Reopen in Container"** when prompted.

### 2. Configure AWS CLI

To use AWS CLI and AWS CDK, you need to provide your AWS credentials. The recommended way is to use the AWS CLI's `aws configure` command inside the devcontainer:

```sh
aws configure
```

You will be prompted for:

- AWS Access Key ID
- AWS Secret Access Key
- Default region name (e.g., `us-east-1`)
- Default output format (e.g., `json`)

This will create a credentials file at `/home/node/.aws/credentials` inside the container (or `~/.aws/credentials` for the current user).

> **Tip:** You can mount your local `~/.aws` directory into the container if you want to reuse your existing credentials. Add this to your `devcontainer.json`:
>
> ```json
> "mounts": [ "source=${env:HOME}/.aws,target=/home/node/.aws,type=bind,consistency=cached" ]
> ```

### 3. Using AWS CDK

You can now use the AWS CDK CLI inside the devcontainer. For example:

```sh
cdk synth
cdk deploy
cdk diff
```

All CDK commands will use the AWS credentials you configured above.

## Notes

- This setup supports both ARM64 and x86-64 platforms natively.
- All tools are installed at build time for fast container startup.
- For any additional tools, update the `Dockerfile` and rebuild the container.

---

For more information, see the [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html) and [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html).
