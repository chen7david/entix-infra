#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import {
  EntixInfraStack,
  EntixInfraStackProps,
} from "../lib/entix-infra-stack";

/**
 * Supported deployment environments.
 */
const environments = ["production", "staging", "test", "sandbox"] as const;
type Environment = (typeof environments)[number];

/**
 * Get deployment environment name from process.env.ENV or default to 'sandbox'
 * @returns The environment name to use for deployment
 */
const getEnvironment = (): Environment => {
  const env = process.env.ENV;
  if (!env || !environments.includes(env as Environment)) {
    throw new Error(
      `Invalid or missing environment. Must be one of: ${environments.join(
        ", "
      )}`
    );
  }
  return env as Environment;
};

const app = new cdk.App();
const env = getEnvironment();

const stackProps: EntixInfraStackProps = {
  /*
   * Pass the environment name for resource naming and tagging.
   * You can add AWS account/region here if needed in the future.
   */
  envName: env,
  description: `Entix Infra stack for ${env}`,
  tags: { Environment: env },
};

new EntixInfraStack(app, `${env}-entix-infra`, stackProps);
