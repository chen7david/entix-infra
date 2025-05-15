import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { createCognitoUserPool } from "./constructs/cognito-user-pool";
import * as iam from "aws-cdk-lib/aws-iam";

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

    const { userPool } = createCognitoUserPool(this, props.envName);

    // Create IAM Policy for Cognito Admin actions
    const cognitoAdminPolicy = new iam.Policy(
      this,
      `${props.envName}CognitoAdminPolicy`,
      {
        policyName: `${props.envName}-CognitoAdminPolicy`,
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "cognito-idp:AdminCreateUser",
              "cognito-idp:AdminDeleteUser",
              "cognito-idp:AdminGetUser",
              "cognito-idp:AdminUpdateUserAttributes",
              "cognito-idp:ListUsers",
              "cognito-idp:ListGroups",
              "cognito-idp:AdminAddUserToGroup",
              "cognito-idp:AdminRemoveUserFromGroup",
              "cognito-idp:AdminConfirmSignUp",
              "cognito-idp:CreateGroup",
              "cognito-idp:DeleteGroup",
              "cognito-idp:UpdateGroup",
              "cognito-idp:GetGroup",
              "cognito-idp:AdminListGroupsForUser",
              "cognito-idp:ListUsersInGroup",
            ],
            resources: [userPool.userPoolArn],
          }),
        ],
      }
    );

    // Create IAM User for the environment
    const adminUser = new iam.User(
      this,
      `${props.envName}EntixApiEntixApiAdminUser`,
      {
        userName: `${props.envName}-entix-api-admin`,
      }
    );

    // Attach the policy to the user
    adminUser.attachInlinePolicy(cognitoAdminPolicy);

    // Output the IAM user name for reference
    new cdk.CfnOutput(this, `${props.envName}EntixApiAdminUserName`, {
      value: adminUser.userName,
      description: `IAM user for entix-api admin tasks in the ${props.envName} environment.`,
    });
  }
}
