import { NextResponse } from 'next/server';
import { livePlatforms } from '@/server/accounts';
import { openRouterConfig } from '@/server/openrouter';

export const dynamic = 'force-dynamic';

/** GET /api/health — says whether the agents can reach OpenRouter, and which platforms the server reads. Never returns a key. */
export function GET() {
  const cfg = openRouterConfig();
  return NextResponse.json({
    ok: true,
    openrouter: { configured: !!cfg.key, model: cfg.model, timeoutMs: cfg.timeoutMs },
    accounts: { live: livePlatforms() },
  });
}
