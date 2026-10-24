import assert from 'node:assert/strict';
import { completeMemorixSnapshotRecord } from '@x12i/memorix-snapshot-completion';
const snapshot = { snapshotId: 'snapshot-1', entityId: 'asset-1', sourceCollection: 'assets', data: { label: 'Keep me' } };
const mapping = {
  name: 'snapshot-owner', entityType: 'asset', version: '1', snapshotSelector: { sourceCollection: 'assets' },
  source: { databaseName: 'fixture-db', collection: 'inventory' }, match: { snapshotPath: 'entityId', sourcePath: 'id' },
  writeRoot: 'data', fields: [{ sourcePath: 'owner', targetPath: 'owner', required: true }],
};
let written;
const result = await completeMemorixSnapshotRecord({ sourceDatabaseName: 'fixture-db', snapshot, mappings: [mapping],
  sourceReader: async request => { assert.equal(request.matchValue, 'asset-1'); return { owner: 'Example team' }; },
  snapshotWriter: async ({ updatedData }) => { written = updatedData; },
});
assert.equal(result.status, 'completed', JSON.stringify(result));
assert.equal(written.owner, 'Example team');
assert.equal(written.label, 'Keep me');
console.log({ result, written });
