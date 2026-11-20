import assert from 'node:assert/strict';
import testRunner from 'node:test';
import { triggerProductionBuild } from '../src/worker.ts';

testRunner('triggerProductionBuild posts to the Cloudflare Deploy Hook', async () => {
  let requestedUrl = '';
  let requestedMethod = '';

  const fetcher: typeof fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedMethod = init?.method ?? 'GET';

    return Response.json({
      success: true,
      result: {
        build_uuid: 'build-123',
        branch: 'main',
        worker: 'talkbh',
      },
    });
  };

  await triggerProductionBuild('https://example.invalid/deploy-hook', fetcher);

  assert.equal(requestedUrl, 'https://example.invalid/deploy-hook');
  assert.equal(requestedMethod, 'POST');
});

testRunner('triggerProductionBuild rejects unsuccessful Deploy Hook responses', async () => {
  const fetcher: typeof fetch = async () => Response.json(
    { success: false },
    { status: 500 },
  );

  await assert.rejects(
    triggerProductionBuild('https://example.invalid/deploy-hook', fetcher),
    /Cloudflare Deploy Hook request failed \(HTTP 500\)/,
  );
});

testRunner('triggerProductionBuild fails when the Worker secret is missing', async () => {
  await assert.rejects(
    triggerProductionBuild(''),
    /Missing DEPLOY_HOOK_URL Worker secret/,
  );
});
