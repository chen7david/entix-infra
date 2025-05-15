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
