interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  DEPLOY_HOOK_URL: string;
}

interface ScheduledController {
  cron: string;
  scheduledTime: number;
}

interface WorkerExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

interface DeployHookPayload {
  success?: boolean;
  result?: {
    build_uuid?: string;
    branch?: string;
    worker?: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function triggerProductionBuild(
  deployHookUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  if (!deployHookUrl) {
    throw new Error('Missing DEPLOY_HOOK_URL Worker secret.');
  }

  const response = await fetcher(deployHookUrl, { method: 'POST' });
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error(`Cloudflare Deploy Hook returned invalid JSON (HTTP ${response.status}).`);
  }

  if (!response.ok || !isRecord(payload) || payload.success !== true) {
    throw new Error(`Cloudflare Deploy Hook request failed (HTTP ${response.status}).`);
  }

  const result = isRecord(payload.result) ? payload.result : {};
  const buildUuid = typeof result.build_uuid === 'string' ? result.build_uuid : undefined;
  const branch = typeof result.branch === 'string' ? result.branch : undefined;
  const worker = typeof result.worker === 'string' ? result.worker : undefined;

  console.info('Triggered the scheduled Talk BH production build.', {
    buildUuid,
    branch,
    worker,
  });
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return env.ASSETS.fetch(request);
  },

  scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: WorkerExecutionContext,
  ): void {
    ctx.waitUntil(triggerProductionBuild(env.DEPLOY_HOOK_URL));
  },
};
