import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

// Compare a fresh, normally validated AWS generation with the draft's source.
// Run from this project with the other project's amplify/ directory as argument.
const manifest = JSON.parse(readFileSync(new URL('../migration/generated-baseline.json', import.meta.url)));
const directory = process.argv[2];
if (!directory) {
  console.error('Usage: node scripts/verify-gen2-generation.mjs /path/to/freshly-generated/amplify');
  process.exit(1);
}
const changed = [];
for (const [name, expected] of Object.entries(manifest.files)) {
  try {
    const hash = createHash('sha256').update(readFileSync(join(resolve(directory), name))).digest('hex');
    if (hash !== expected) changed.push(name);
  } catch {
    changed.push(name);
  }
}
if (changed.length) {
  console.error(`Generated AWS definitions differ from the reviewed baseline:\n${changed.join('\n')}\nReconcile these differences before enabling deployment. Do not overwrite the poster schema or validation.`);
  process.exitCode = 1;
} else {
  console.log('Fresh AWS generation matches the reviewed baseline. The project-specific Gen 2 changes can be retained.');
}
