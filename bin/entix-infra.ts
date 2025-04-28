#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import {
  EntixInfraStack,
  EntixInfraStackProps,
} from "../lib/entix-infra-stack";

/**
 * Supported deployment environments.
 */
const environments = ["production", "staging", "test"] as const;
type Environment = (typeof environments)[number];

const app = new cdk.App();

environments.forEach((env) => {
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
});
