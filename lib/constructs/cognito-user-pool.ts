import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_cognito as cognito } from "aws-cdk-lib";

/**
 * Creates a Cognito User Pool and App Client with environment-specific configuration.
 *
 * @param scope - The construct scope.
 * @param envName - The environment name (e.g., production, staging, test).
 * @returns The created Cognito User Pool and App Client.
 */
export const createCognitoUserPool = (
  scope: Construct,
  envName: string
): { userPool: cognito.UserPool; userPoolClient: cognito.UserPoolClient } => {
  const isTestEnv = envName === "test";
  const userPool = new cognito.UserPool(scope, `${envName}-user-pool`, {
    userPoolName: `${envName}-entix-user-pool`,
    selfSignUpEnabled: true,
    signInAliases: { username: true, email: false },
    autoVerify: { email: !isTestEnv },
    accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    standardAttributes: {
      email: {
        required: true,
        mutable: true,
      },
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: false,
      requireUppercase: false,
      requireDigits: false,
      requireSymbols: false,
      tempPasswordValidity: cdk.Duration.days(7),
    },
    email: cognito.UserPoolEmail.withCognito(),
    signInCaseSensitive: false,
    removalPolicy: cdk.RemovalPolicy.DESTROY, // Change to RETAIN for production
    userVerification: isTestEnv
      ? {
          emailSubject: "Welcome to Entix!",
          emailBody:
            "Your account is ready to use. Your verification code is {####}",
          emailStyle: cognito.VerificationEmailStyle.CODE,
        }
      : undefined,
  });

  // App client for basic auth (username & password)
  const userPoolClient = new cognito.UserPoolClient(
    scope,
    `${envName}-user-pool-client`,
    {
      userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
        adminUserPassword: true,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
        // cognito.UserPoolClientIdentityProvider.GOOGLE, // Uncomment if Google is enabled
      ],
    }
  );

  // Enable Google as an identity provider (requires client ID/secret)
  // new cognito.UserPoolIdentityProviderGoogle(scope, `${envName}-google-idp`, {
  //   clientId: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_PLACEHOLDER",
  //   clientSecretValue: cdk.SecretValue.unsafePlainText(
  //     process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET_PLACEHOLDER"
  //   ),
  //   userPool,
  //   scopes: ["profile", "email", "openid"],
  //   attributeMapping: {
  //     email: cognito.ProviderAttribute.GOOGLE_EMAIL,
  //     givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
  //     familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
  //   },
  // });

  return { userPool, userPoolClient };
};
