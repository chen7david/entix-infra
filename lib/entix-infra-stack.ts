import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { createCognitoUserPool } from "./constructs/cognito-user-pool";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

/**
 * Properties for EntixInfraStack.
 */
export type EntixInfraStackProps = cdk.StackProps & {
  /**
   * The environment name (e.g., production, staging, test).
   */
  envName: string;
};

/**
 * The main infrastructure stack for Entix, parameterized by environment.
 */
export class EntixInfraStack extends cdk.Stack {
  /**
   * Constructs a new EntixInfraStack.
   * @param scope - The parent construct.
   * @param id - The stack identifier.
   * @param props - Stack properties, including envName for environment-aware naming.
   */
  constructor(scope: Construct, id: string, props: EntixInfraStackProps) {
    super(scope, id, props);

    const userPool = createCognitoUserPool(this, props.envName);
  }
}
