import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Construct } from "constructs";
import { createCognitoUserPool } from "../lib/constructs/cognito-user-pool";

/**
 * Test stack for Cognito User Pool creation.
 */
class TestStack extends cdk.Stack {
  public readonly userPool: cdk.aws_cognito.UserPool;
  public readonly userPoolClient: cdk.aws_cognito.UserPoolClient;
  constructor(scope: Construct, id: string, envName: string) {
    super(scope, id);
    const { userPool, userPoolClient } = createCognitoUserPool(this, envName);
    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
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

  it("creates a Cognito User Pool Client with correct config for basic auth", () => {
    const app = new cdk.App();
    const stack = new TestStack(app, "TestStackClient", "production");
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
      GenerateSecret: false,
      ExplicitAuthFlows: [
        "ALLOW_USER_PASSWORD_AUTH",
        "ALLOW_ADMIN_USER_PASSWORD_AUTH",
        "ALLOW_USER_SRP_AUTH",
        "ALLOW_REFRESH_TOKEN_AUTH",
      ],
      SupportedIdentityProviders: ["COGNITO"],
    });
  });
});
