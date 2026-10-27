// OpenRouter client for the agents. Server only: it reads the API key from the environment.
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'anthropic/claude-sonnet-5.5';
const DEFAULT_TIMEOUT_MS = 45000;

export type AgentErrorCode = 'bad_request' | 'needs_account' | 'no_key' | 'timeout' | 'upstream' | 'bad_output';

export class AgentError extends Error {
  constructor(public code: AgentErrorCode, message: string, public status?: number) {
    super(message);
    this.name = 'AgentError';
  }
}

export function openRouterConfig() {
  const timeout = Number(process.env.OPENROUTER_TIMEOUT_MS);
  return {
    key: process.env.OPENROUTER_API_KEY || '',
    model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
    timeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT_MS,
    appUrl: process.env.APP_URL || 'http://localhost:3000',
  };
}

type ChatJsonArgs = {
  /** Short name for the output shape, sent to the model with the schema. */
  name: string;
  system: string;
  user: string;
  /** JSON Schema for the answer. Strict mode: every object needs additionalProperties: false. */
  schema: Record<string, unknown>;
  /** Upper bound on the answer length, to cap the cost of one call. */
  maxTokens?: number;
};

/** Ask the model for a JSON answer that matches `schema`, and parse it. */
export async function chatJson<T>({ name, system, user, schema, maxTokens = 2500 }: ChatJsonArgs): Promise<T> {
  const cfg = openRouterConfig();
  if (!cfg.key) throw new AgentError('no_key', 'OPENROUTER_API_KEY is not set.');

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), cfg.timeoutMs);
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': cfg.appUrl,
        'X-Title': 'AI Influencer Agency',
      },
      body: JSON.stringify({
        model: cfg.model,
        // No temperature: newer Claude models on OpenRouter do not accept it, and with
        // require_parameters an unsupported parameter rules out every provider.
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        response_format: { type: 'json_schema', json_schema: { name, strict: true, schema } },
        provider: { require_parameters: true },
      }),
    });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new AgentError('timeout', `The model did not answer in ${cfg.timeoutMs} ms.`);
    throw new AgentError('upstream', 'Could not reach OpenRouter.');
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new AgentError('upstream', `OpenRouter returned ${res.status}. ${detail.slice(0, 300)}`, res.status);
  }

  const data = await res.json().catch(() => null);
  const content: unknown = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) throw new AgentError('bad_output', 'The model returned no content.');
  try {
    return JSON.parse(stripFence(content)) as T;
  } catch {
    throw new AgentError('bad_output', 'The model did not return valid JSON.');
  }
}

/** Some models wrap JSON in a ```json fence even in JSON mode. */
function stripFence(s: string) {
  const m = s.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return m ? m[1] : s;
}
