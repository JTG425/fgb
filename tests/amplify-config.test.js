import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateOutputs } from '../scripts/check-amplify-outputs.mjs';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/amplify_outputs.json', import.meta.url)));
const valid = { ...fixture, custom: undefined };

test('accepts Gen 2 IAM, auth and storage outputs without relying on an API key', () => {
  assert.doesNotThrow(() => validateOutputs(valid));
});

test('blocks production builds using missing, Gen 1, test or incomplete outputs', () => {
  for (const outputs of [undefined, {}, { aws_project_region: 'us-east-1' }, fixture,
    { ...valid, auth: { ...valid.auth, unauthenticated_identities_enabled: false } },
    { ...valid, data: { ...valid.data, default_authorization_type: 'API_KEY', authorization_types: [] } },
    { ...valid, storage: undefined }]) {
    assert.throws(() => validateOutputs(outputs));
  }
});
