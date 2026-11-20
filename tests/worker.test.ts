import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { triggerProductionBuild } from '../src/worker.ts';

test('Worker fetch forwards requests to the static assets binding', async () => {
  const request = new Request('https://talk.bh/proximo-encontro/');
  const expectedResponse = new Response('static page');
  let receivedRequest: Request | undefined;

  const response = await worker.fetch(request, {
    ASSETS: {
      fetch: async (received) => {
        receivedRequest = received;
        return expectedResponse;
      },
    },
    DEPLOY_HOOK_URL: 'https://example.invalid/deploy-hook',
  });

  assert.equal(receivedRequest, request);
  assert.equal(response, expectedResponse);
});

test('scheduled handler keeps the Deploy Hook request alive with waitUntil', async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';
  let requestedMethod = '';
  let scheduledPromise: Promise<unknown> | undefined;

  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedMethod = init?.method ?? 'GET';

    return Response.json({ success: true, result: { build_uuid: 'build-123' } });
  };

  try {
    worker.scheduled(
      { cron: '5 3 * * *', scheduledTime: Date.now() },
      {
        ASSETS: { fetch: async () => new Response() },
        DEPLOY_HOOK_URL: 'https://example.invalid/deploy-hook',
      },
      {
        waitUntil: (promise) => {
          scheduledPromise = promise;
        },
      },
    );

    assert.ok(scheduledPromise);
    await scheduledPromise;
    assert.equal(requestedUrl, 'https://example.invalid/deploy-hook');
    assert.equal(requestedMethod, 'POST');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('triggerProductionBuild rejects unsuccessful Deploy Hook responses', async () => {
  const fetcher: typeof fetch = async () => Response.json(
    { success: false },
    { status: 500 },
  );

  await assert.rejects(
    triggerProductionBuild('https://example.invalid/deploy-hook', fetcher),
    /Cloudflare Deploy Hook request failed \(HTTP 500\)/,
  );
});

test('triggerProductionBuild fails when the Worker secret is missing', async () => {
  await assert.rejects(
    triggerProductionBuild(''),
    /Missing DEPLOY_HOOK_URL Worker secret/,
  );
});
