import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Construct } from "constructs";
import { createCognitoUserPool } from "../lib/constructs/cognito-user-pool";

/**
 * Test stack for Cognito User Pool creation.
 */
class TestStack extends cdk.Stack {
  public readonly userPool: cdk.aws_cognito.UserPool;
  constructor(scope: Construct, id: string, envName: string) {
    super(scope, id);
    this.userPool = createCognitoUserPool(this, envName);
  }
}

describe("createCognitoUserPool", () => {
  it("creates a Cognito User Pool with correct config for production", () => {
    const app = new cdk.App();
    const stack = new TestStack(app, "TestStackProd", "production");
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      UserPoolName: "production-entix-user-pool",
      AutoVerifiedAttributes: ["email"],
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
        },
      },
    });
  });

  it("creates a Cognito User Pool with correct config for test env (no email verification)", () => {
    const app = new cdk.App();
    const stack = new TestStack(app, "TestStackTest", "test");
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      UserPoolName: "test-entix-user-pool",
      AutoVerifiedAttributes: [],
    });
  });
});
