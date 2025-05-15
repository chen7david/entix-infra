# Entix Infrastructure Deployment

This document describes the infrastructure deployment process for the Entix application.

## Architecture Overview

The Entix infrastructure is managed using AWS CDK (Cloud Development Kit) and deployed using GitHub Actions workflows. The infrastructure is segmented into separate environments to ensure isolation between development, testing, staging, and production resources.

## Environments

The application supports the following environments:

- **Production**: Deployed from the `main` branch, contains customer-facing resources
- **Staging**: Deployed from the `staging` branch, used for pre-production verification
- **Test**: Deployed from the `test` branch, used for integration testing
- **Sandbox**: Deployed from the `sandbox` branch, used for development and experimentation

## Deployment Process

### How It Works

1. Each environment has its own dedicated GitHub Actions workflow file (`.github/workflows/[environment].yml`).
2. When code is pushed to a specific branch (e.g., `main`, `staging`, `test`, or `sandbox`), the corresponding workflow is triggered.
3. The workflow first runs the tests to ensure code quality.
4. If the tests pass and it's a push event (not a pull request), the workflow deploys the infrastructure.
5. The deployment process sets the appropriate environment variable (`ENV`) to ensure resources are created with the correct naming convention.

### Branch-to-Environment Mapping

| Branch    | Environment | Stack Name               |
| --------- | ----------- | ------------------------ |
| `main`    | Production  | `production-entix-infra` |
| `staging` | Staging     | `staging-entix-infra`    |
| `test`    | Test        | `test-entix-infra`       |
| `sandbox` | Sandbox     | `sandbox-entix-infra`    |

### Deployment Isolation

Each environment's infrastructure is completely isolated from others. Resources are prefixed with the environment name to prevent naming conflicts. When deploying to a specific branch, only the corresponding environment's resources are affected.

### Cognito Admin IAM Users

For each environment, an IAM user is automatically created to allow backend services to perform administrative actions on the Cognito User Pool for that specific environment. This is crucial for tasks such as user management (creating, deleting, updating users), group management, and other administrative operations via the AWS SDK.

- **Naming Convention**: The IAM users follow the naming pattern: `<environment_name>-cognito-admin-backend` (e.g., `staging-cognito-admin-backend`).
- **Permissions**: Each user is granted a specific IAM policy that restricts its Cognito administrative actions _only_ to the User Pool of its respective environment. This ensures strict permission boundaries between environments.
- **Access Keys**: To use these IAM users with your backend services, you will need to manually generate AWS access keys (Access Key ID and Secret Access Key) for each user through the AWS Management Console after they have been created by the CDK deployment.
- **CDK Output**: The CDK stack will output the name of the created IAM user for each environment, which you can find in the CloudFormation stack outputs.

## Development Workflow

1. Create feature branches from the appropriate base branch (usually `sandbox` or `test`).
2. Make your changes and create a pull request to the target branch.
3. On pull request creation, only tests are run (no deployment).
4. Once the pull request is merged, the corresponding workflow will deploy the changes to the appropriate environment.

## Continuous Integration

- **Pull Requests**: Only run tests to validate changes.
- **Merges/Pushes**: Run tests and deploy to the target environment if tests pass.

## Troubleshooting

If a deployment fails, check the GitHub Actions logs for detailed error information. Common issues include:

- Missing AWS credentials or insufficient permissions
- Validation errors in CDK templates
- Resource conflicts with existing infrastructure

For any deployment issues, contact the infrastructure team for assistance.
