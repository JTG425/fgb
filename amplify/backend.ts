import * as data from './data/resource';
import * as auth from './auth/resource';
import * as storage from './storage/resource';
import { defineBackend } from '@aws-amplify/backend';
import { Tags } from 'aws-cdk-lib';

export const backend = defineBackend({
  data: data.data,
  auth: auth.auth,
  storage: storage.storage,
});

export type Backend = typeof backend;

data.applyEscapeHatches(backend);
auth.applyEscapeHatches(backend);
storage.applyEscapeHatches(backend);

export function postRefactor() {
  storage.postRefactor(backend);
  Tags.of(backend.stack).add('gen2-migration/post-refactor', 'true');
}

// Uncomment after refactor
// postRefactor();
