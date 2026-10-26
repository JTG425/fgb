// A new Hosting app must not deploy this migration draft on its initial build.
// Set this only after completing the rehearsal, backup, lock and regeneration
// checkpoints in the runbook. This is an operator acknowledgment, not an AWS audit.
if (process.env.FGB_GEN2_MIGRATION_READY !== 'true') {
  console.error('Deployment stopped. Complete docs/amplify-gen2-migration.md, then set FGB_GEN2_MIGRATION_READY=true for the reviewed branch.');
  process.exitCode = 1;
}
