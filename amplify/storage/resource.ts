import { defineStorage } from '@aws-amplify/backend';
import { CfnResource } from 'aws-cdk-lib';
import { AnyPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import type { Backend } from '../backend';

const branchName = (process.env.AWS_BRANCH ?? 'sandbox').replace(/[^a-zA-Z0-9_-]/g, '-');

export const storage = defineStorage({
  name: `fgbtheatersstoragec850c-${branchName}`,
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['write', 'read', 'delete']),
    ],
    'protected/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['write', 'read', 'delete']),
    ],
    'private/{entity_id}/*': [
      allow.entity('identity').to(['write', 'read', 'delete']),
    ],
  }),
});

export function postRefactor(backend: Backend) {
  const s3Bucket = backend.storage.resources.cfnResources.cfnBucket;
  s3Bucket.bucketName = 'fgbtheatersstoragec850c-main';
}

export function applyEscapeHatches(backend: Backend) {
  const s3Bucket = backend.storage.resources.cfnResources.cfnBucket;
  // Existing slideshow/media URLs use unsigned reads of public/*.
  // The migration generator does not copy this manually configured bucket policy.
  s3Bucket.publicAccessBlockConfiguration = {
    blockPublicAcls: false,
    ignorePublicAcls: false,
    blockPublicPolicy: false,
    restrictPublicBuckets: false,
  };
  const bucket = backend.storage.resources.bucket;
  bucket.addToResourcePolicy(new PolicyStatement({
    sid: 'readaccess',
    principals: [new AnyPrincipal()],
    actions: ['s3:GetObject'],
    resources: [bucket.arnForObjects('public/*')],
  }));
  s3Bucket.corsConfiguration = { corsRules: [{
    id: 'S3CORSRuleId1',
    allowedHeaders: ['*'],
    allowedMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
    allowedOrigins: ['*'],
    exposedHeaders: ['x-amz-server-side-encryption', 'x-amz-request-id', 'x-amz-id-2', 'ETag'],
    maxAge: 3000,
  }] };
  s3Bucket.accelerateConfiguration = { accelerationStatus: 'Enabled' };
  s3Bucket.bucketEncryption = {
    serverSideEncryptionConfiguration: [
      {
        serverSideEncryptionByDefault: {
          sseAlgorithm: 'AES256',
        },
        bucketKeyEnabled: false,
      },
    ],
  };
  for (const cfnResource of backend.storage.stack.node
    .findAll()
    .filter(
      (c) =>
        CfnResource.isCfnResource(c) &&
        ['AWS::S3::Bucket', 'Custom::S3AutoDeleteObjects'].includes(
          c.cfnResourceType
        )
    )) {
    (cfnResource as CfnResource).addOverride('UpdateReplacePolicy', 'Retain');
    (cfnResource as CfnResource).addOverride('DeletionPolicy', 'Retain');
  }
}
