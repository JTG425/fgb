import { Amplify } from 'aws-amplify';
import testOutputs from '../tests/fixtures/amplify_outputs.json';

// Hosting / ampx generates this file. An unconfigured local checkout can still
// browse the bundled catalog; production builds require real outputs.
const generated = import.meta.glob('../amplify_outputs.json', { eager: true, import: 'default' });
const outputs = import.meta.env.MODE === 'test' ? testOutputs : generated['../amplify_outputs.json'];

export const isAmplifyConfigured = Boolean(outputs?.auth && outputs?.data);

if (isAmplifyConfigured) {
  Amplify.configure(outputs);
}
