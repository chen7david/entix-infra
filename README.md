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

## CDK Project Usage

This project uses the AWS Cloud Development Kit (CDK) with TypeScript to define and manage infrastructure as code. The CDK app is structured to support multiple environments (production, staging, testing) within a single AWS account, using environment-prefixed stack and resource names (e.g., `production-entix-infra`).

### Project Structure

- `bin/entix-infra.ts`: Entry point for the CDK app, instantiates a stack for each environment.
- `lib/entix-infra-stack.ts`: Main stack definition, parameterized by environment.
- `cdk.json`: CDK configuration.
- `.github/workflows/deploy.yml`: GitHub Actions workflow for CI/CD deployment.

### Environment Naming Convention

All stacks and resources are prefixed with the environment name (e.g., `production-entix-infra`, `staging-entix-infra`, `testing-entix-infra`). This makes it easy to distinguish resources by environment and simplifies migration to a multi-account setup in the future.

### Useful Commands

- `npm run build` – Compile TypeScript to JavaScript
- `npm run watch` – Watch for changes and compile
- `npm run test` – Run Jest unit tests
- `npx cdk deploy <env>-entix-infra` – Deploy the stack for a specific environment (e.g., `production-entix-infra`)
- `npx cdk diff <env>-entix-infra` – Compare deployed stack with current state
- `npx cdk synth <env>-entix-infra` – Emit the synthesized CloudFormation template for a specific environment

#### Example:

```sh
npx cdk deploy production-entix-infra
npx cdk diff staging-entix-infra
npx cdk synth testing-entix-infra
```

> **Tip:** The GitHub Actions workflow will automatically deploy the correct stack based on the branch name (`main` → `production-entix-infra`, `staging` → `staging-entix-infra`, `testing` → `testing-entix-infra`).

## CI/CD with GitHub Actions

This project uses GitHub Actions for automated deployment of your AWS CDK stacks to different environments. The workflow is defined in `.github/workflows/deploy.yml`.

### Deployment Triggers and Environment Mapping

- **Branches:** Deployments are triggered on push to the following branches:
  - `main` → **production** environment (stack: `production-entix-infra`)
  - `staging` → **staging** environment (stack: `staging-entix-infra`)
  - `test` → **test** environment (stack: `test-entix-infra`)
- The workflow automatically maps the `main` branch to the `production` environment and stack prefix. Other branches use their branch name as the environment and stack prefix.
- The workflow will bootstrap the CDK app if needed (idempotent, safe to run multiple times).

### GitHub Environments and Secrets

For secure deployments, you must create the following GitHub Environments in your repository settings:

- `production`
- `staging`
- `test`

For each environment, add these secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

### Recommended Development Workflow

1. **Feature Development:**
   - Create a feature branch from `main` (or `staging`/`test` as appropriate).
   - Develop and test locally using the dev container and CDK commands.
2. **Pull Request:**
   - Open a PR to merge your feature branch into `main`, `staging`, or `test`.
   - Ensure all checks pass and request review.
3. **Merge:**
   - Once approved, merge the PR. This triggers the GitHub Actions workflow to deploy the stack for the target environment.
   - For `main`, the stack `production-entix-infra` is deployed. For `staging` or `test`, the corresponding stack is deployed.

> **Tip:** Use branch protection rules to require PR review and status checks before merging to `main`, `staging`, or `test` for safer deployments.

## Notes

- This setup supports both ARM64 and x86-64 platforms natively.
- All tools are installed at build time for fast container startup.
- For any additional tools, update the `Dockerfile` and rebuild the container.

## Cognito User Pool Authentication

This project provisions an [Amazon Cognito User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) for authentication, with the following features:

- **Username and password authentication** (usernames are unique)
- **Duplicate emails allowed** (email is not used as a sign-in alias)
- **Account email verification required** (except for the `test` environment, where accounts are active immediately)
- **Password policy:** Minimum 8 characters
- **Self sign-up enabled**
- **Account recovery via email only**
- **Google login (optional, see below)**

### Environment-specific behavior

- In `production` and `staging`, users must verify their email before the account is active.
- In `test`, accounts are active as soon as they are created (no email verification required).

### Google Login (Optional)

To enable Google login as a federated identity provider:

1. Register your app in the [Google Developer Console](https://console.developers.google.com/) and obtain a Client ID and Client Secret.
2. Uncomment and configure the `UserPoolIdentityProviderGoogle` block in `lib/entix-infra-stack.ts` with your credentials.
3. Deploy the stack.

> **Note:** Additional configuration in the AWS Console may be required to finalize the Google identity provider setup.

### Customization

- You can further customize the user pool by editing the `createCognitoUserPool` function in `lib/cognito-user-pool.ts`.

#### Google Auth Environment Variables

To enable Google login, set the following environment variables before deploying:

```sh
export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
```

These will be used by the CDK deployment to configure the Google identity provider in Cognito.

---

For more information, see the [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html) and [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html).
