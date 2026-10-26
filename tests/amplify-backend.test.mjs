// Synthesize real Gen 2 CloudFormation locally; no AWS API calls or deployment.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const outdir = mkdtempSync(join(tmpdir(), 'fgb-gen2-test-'));
process.env.CDK_CONTEXT_JSON = JSON.stringify({
  'amplify-backend-namespace': 'fgbtest',
  'amplify-backend-name': 'codex/amplify-gen2',
  'amplify-backend-type': 'branch',
});
process.env.CDK_OUTDIR = outdir;
process.env.CDK_DEFAULT_ACCOUNT = '111111111111';
process.env.CDK_DEFAULT_REGION = 'us-east-1';
process.env.AWS_BRANCH = 'codex/amplify-gen2';
const { backend } = await import('../amplify/backend.ts');
backend.stack.node.root.synth();
const resources = readdirSync(outdir).filter(name => name.endsWith('.template.json'))
  .flatMap(name => Object.entries(JSON.parse(readFileSync(join(outdir, name))).Resources ?? {})
    .map(([id, resource]) => ({ id, ...resource })));
const resolvers = resources.filter(r => r.Type === 'AWS::AppSync::Resolver');

test('generated API permits only request creation and catalog reads', () => {
  assert.deepEqual(resolvers.filter(r => /PosterRequest/.test(r.Properties.FieldName))
    .map(r => `${r.Properties.TypeName}.${r.Properties.FieldName}`), ['Mutation.createPosterRequest']);
  assert.deepEqual(resolvers.filter(r => /PosterListing/.test(r.Properties.FieldName))
    .map(r => `${r.Properties.TypeName}.${r.Properties.FieldName}`).sort(), ['Query.getPosterListing', 'Query.listPosterListings']);
  const request = resolvers.find(r => r.Properties.FieldName === 'createPosterRequest');
  assert.match(JSON.stringify(request.Properties.PipelineConfig.Functions[0]), /ValidatePosterRequest/);
});

test('reuses the existing announcement table and retains all model data', () => {
  const tables = resources.filter(r => /DynamoDBTable$/.test(r.Type));
  assert.equal(tables.length, 3);
  const imported = tables.filter(r => r.Type === 'Custom::ImportedAmplifyDynamoDBTable');
  assert.equal(imported.length, 1);
  assert.equal(imported[0].Properties.tableName, 'AddAnnouncement-vdopupkg5rachke3tpp5i745kq-main');
  for (const table of tables) {
    assert.equal(table.DeletionPolicy, 'Retain');
    assert.equal(table.UpdateReplacePolicy, 'Retain');
  }
});

test('retains username sign-in, existing password rules and guest identities', () => {
  const pool = resources.find(r => r.Type === 'AWS::Cognito::UserPool');
  assert.equal(pool.Properties.UsernameAttributes, undefined);
  assert.equal(pool.Properties.UsernameConfiguration.CaseSensitive, false);
  assert.equal(pool.Properties.Policies.PasswordPolicy.MinimumLength, 8);
  assert.equal(pool.DeletionPolicy, 'Retain');
  const identities = resources.find(r => r.Type === 'AWS::Cognito::IdentityPool');
  assert.equal(identities.Properties.AllowUnauthenticatedIdentities, true);
});

test('preserves direct public media reads without permitting public writes', () => {
  const statements = resources.filter(r => r.Type === 'AWS::S3::BucketPolicy')
    .flatMap(r => r.Properties.PolicyDocument.Statement);
  const publicRead = statements.find(s => s.Sid === 'readaccess');
  assert.ok(publicRead);
  assert.equal(publicRead.Effect, 'Allow');
  assert.deepEqual([publicRead.Action].flat(), ['s3:GetObject']);
  assert.match(JSON.stringify(publicRead.Resource), /public\/\*/);
  assert.doesNotMatch(JSON.stringify(publicRead.Resource), /private|protected/);
});

test('private files and protected writes remain scoped to their owning identity', () => {
  const policies = resources.filter(r => r.Type === 'AWS::IAM::Policy')
    .flatMap(r => r.Properties.PolicyDocument.Statement);
  const storageWrites = policies.filter(s => [s.Action].flat().some(a => ['s3:PutObject', 's3:DeleteObject'].includes(a)));
  const privateWrites = storageWrites.filter(s => JSON.stringify(s.Resource).includes('/private/'));
  assert.ok(privateWrites.length);
  for (const statement of privateWrites) {
    assert.match(JSON.stringify(statement.Resource), /cognito-identity.amazonaws.com:sub/);
    assert.doesNotMatch(JSON.stringify(statement.Resource), /\/private\/\*/);
  }
  for (const statement of storageWrites) {
    assert.doesNotMatch(JSON.stringify(statement.Resource), /\/protected\/\*/);
  }
});
