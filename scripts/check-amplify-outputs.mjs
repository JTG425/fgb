import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function validateOutputs(outputs) {
  if (!outputs?.version?.startsWith('1')) throw new Error('Expected Amplify Gen 2 outputs.');
  for (const field of ['aws_region', 'user_pool_id', 'user_pool_client_id', 'identity_pool_id']) {
    if (!outputs.auth?.[field]) throw new Error(`Missing auth.${field} in amplify_outputs.json.`);
  }
  if (!outputs.auth.unauthenticated_identities_enabled) {
    throw new Error('Guest identity-pool access is required for poster requests.');
  }
  if (!outputs.data?.aws_region || !outputs.data?.url?.startsWith('https://')) {
    throw new Error('Missing HTTPS data endpoint in amplify_outputs.json.');
  }
  const modes = [outputs.data.default_authorization_type, ...(outputs.data.authorization_types ?? [])];
  if (!modes.includes('AWS_IAM')) throw new Error('The poster service requires AWS_IAM authorization.');
  if (!outputs.storage?.bucket_name || !outputs.storage?.aws_region) {
    throw new Error('Missing migrated storage configuration.');
  }
  if (outputs.custom?.fgb_test_fixture) throw new Error('Test outputs cannot be used in a production build.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    validateOutputs(JSON.parse(readFileSync(new URL('../amplify_outputs.json', import.meta.url), 'utf8')));
    console.log('Amplify Gen 2 configuration verified.');
  } catch (error) {
    console.error(`Build stopped: ${error.message}\nGenerate amplify_outputs.json from the intended Gen 2 branch. See docs/amplify-gen2-migration.md.`);
    process.exitCode = 1;
  }
}
