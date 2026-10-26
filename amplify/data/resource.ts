import { defineData } from '@aws-amplify/backend';
import type { Backend } from '../backend';
import { aws_iam, CfnResource } from 'aws-cdk-lib';
import { readFileSync } from 'node:fs';
import { attachPosterRequestValidation } from './poster-request-validation';

const schema = readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8');

export const data = defineData({
  migratedAmplifyGen1DynamoDbTableMappings: [
    {
      //The "branchName" variable needs to be the same as your deployment branch if you want to reuse your Gen1 app tables
      branchName: 'codex/amplify-gen2',
      modelNameToTableNameMapping: {
        AddAnnouncement: 'AddAnnouncement-vdopupkg5rachke3tpp5i745kq-main',
      },
    },
  ],
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
      description: 'api key description',
    },
  },
  schema,
});

export function applyEscapeHatches(backend: Backend) {
  attachPosterRequestValidation(backend);
  // Preserve new poster records as well as the imported announcement table.
  for (const resource of backend.data.stack.node.findAll()) {
    if (CfnResource.isCfnResource(resource) && [
      'AWS::DynamoDB::Table', 'Custom::AmplifyDynamoDBTable', 'Custom::ImportedAmplifyDynamoDBTable',
    ].includes(resource.cfnResourceType)) {
      resource.addOverride('DeletionPolicy', 'Retain');
      resource.addOverride('UpdateReplacePolicy', 'Retain');
    }
  }
  const cfnGraphqlApi = backend.data.resources.cfnResources.cfnGraphqlApi;
  cfnGraphqlApi.additionalAuthenticationProviders = [
    {
      authenticationType: 'AWS_IAM',
    },
  ];
  backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
    new aws_iam.PolicyStatement({
      effect: aws_iam.Effect.ALLOW,
      actions: ['appsync:GraphQL'],
      resources: [
        `arn:aws:appsync:${backend.data.stack.region}:${backend.data.stack.account}:apis/vdopupkg5rachke3tpp5i745kq/*`,
      ],
    })
  );
}
