// The four agents (PRD section 6): Grow, Scout, Content and Pitch.
// Each one turns a talent into a JSON answer that matches the app's own types.
// Profile writes a new talent's niche and character story from its accounts' own words.
import type { AccountAbout } from './account-error';
import { parseReadRequest, type ReadRequest } from './accounts';
import { AgentError, chatJson } from './openrouter';

export type AgentName = 'grow' | 'scout' | 'content' | 'pitch';
export const AGENTS: AgentName[] = ['grow', 'scout', 'content', 'pitch'];

type Pair = [number, number];

export type TalentInput = {
  name: string;
  niche: string;
  story: string;
  accounts: { platform: string; handle: string; mode: 'live' | 'handle'; status: 'ok' | 'lost' }[];
  /** [this week, last week]. Null when no account shares numbers. */
  stats: { posts: Pair; views: Pair; eng: Pair; time: Pair | null; timeBy?: string } | null;
};

export type BrandInput = { name: string; what: string; why: string; where: string };

export type AgentRequest = {
  talent: TalentInput;
  /** Titles or names already shown or dismissed. The agent must not repeat them. */
  avoid?: string[];
  /** Pitch only. */
  brand?: BrandInput;
  /** Pitch only: who signs the pitch. */
  sender?: { name: string; agency: string };
};

const VOICE = [
  'You work inside "AI Influencer Agency", a tool for students in the Philippines who run AI talents (AI-made characters) on TikTok, Instagram, YouTube and Facebook.',
  'Write in plain, short sentences. Use common words. Say "AI talent", never "avatar".',
  'Never promise income. The product never posts, sends or contacts anyone: the student does.',
].join(' ');

// ---- Input checks -----------------------------------------------------------

const isStr = (v: unknown, max = 2000): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const isPair = (v: unknown): v is Pair => Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number' && Number.isFinite(n));

export function parseRequest(agent: AgentName, body: unknown): AgentRequest {
  const b = body as AgentRequest | null;
  const t = b?.talent;
  if (!t || !isStr(t.name, 120) || !isStr(t.niche, 200) || !isStr(t.story, 2000)) throw new AgentError('bad_request', 'talent.name, talent.niche and talent.story are required.');
  if (!Array.isArray(t.accounts)) throw new AgentError('bad_request', 'talent.accounts must be an array.');
  if (t.stats != null && !(isPair(t.stats.posts) && isPair(t.stats.views) && isPair(t.stats.eng) && (t.stats.time === null || isPair(t.stats.time)))) {
    throw new AgentError('bad_request', 'talent.stats is not valid.');
  }
  if (agent === 'pitch') {
    const br = b?.brand;
    if (!br || !isStr(br.name, 200) || !isStr(br.what, 300) || !isStr(br.why, 600) || !isStr(br.where, 300)) throw new AgentError('bad_request', 'brand with name, what, why and where is required.');
    if (!b?.sender || !isStr(b.sender.name, 120) || !isStr(b.sender.agency, 120)) throw new AgentError('bad_request', 'sender.name and sender.agency are required.');
  }
  const avoid = Array.isArray(b?.avoid) ? b!.avoid.filter((x): x is string => typeof x === 'string').slice(0, 60) : [];
  return { talent: t, avoid, brand: b?.brand, sender: b?.sender };
}

/** Numbers count only when at least one account shares them (PRD: handle-only accounts have no numbers). */
function liveStats(t: TalentInput) {
  return t.accounts.some((a) => a.mode === 'live') ? t.stats : null;
}

function describe(t: TalentInput) {
  const s = liveStats(t);
  const lines = [
    `Name: ${t.name}`,
    `Niche: ${t.niche}`,
    `Character story: ${t.story}`,
    `Accounts: ${t.accounts.length ? t.accounts.map((a) => `${a.platform} ${a.handle} (${a.mode === 'live' ? (a.status === 'lost' ? 'connection lost, last good numbers' : 'connected') : 'added by handle, no numbers'})`).join('; ') : 'none'}`,
  ];
  if (s) {
    lines.push(
      `This week vs last week: ${s.posts[0]} vs ${s.posts[1]} posts; ${s.views[0]} vs ${s.views[1]} views; ${s.eng[0]}% vs ${s.eng[1]}% average engagement; ` +
        (s.time ? `${s.time[0]} vs ${s.time[1]} hours watched.` : `time watched not available${s.timeBy ? ` (${s.timeBy} does not share it)` : ''}.`),
    );
  } else {
    lines.push('Numbers: not available (no connected account).');
  }
  return lines.join('\n');
}

const avoidLine = (avoid?: string[]) => (avoid && avoid.length ? `\nDo not repeat or rephrase any of these: ${avoid.map((a) => JSON.stringify(a)).join(', ')}.` : '');

// ---- Schemas ------------------------------------------------------------------

const obj = (properties: Record<string, unknown>) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const str = (description: string) => ({ type: 'string', description });

const GROW_SCHEMA = obj({
  ideas: { type: 'array', description: '3 to 5 ideas.', items: obj({ title: str('What to do, as a short command.'), why: str('One sentence that names a real number from the talent.') }) },
});

const SCOUT_SCHEMA = obj({
  brands: {
    type: 'array',
    description: '3 to 5 brand ideas.',
    items: obj({
      name: str('Brand or company name.'),
      what: str('What they sell, in a few words.'),
      why: str('One sentence: why this brand fits this talent.'),
      where: str('Where to approach them, e.g. "Direct outreach: their partnerships email", "Creator marketplace: Elev8or", "Creator agency that runs their ads".'),
    }),
  },
});

const CONTENT_SCHEMA = obj({
  ideas: {
    type: 'array',
    description: '3 content ideas.',
    items: obj({
      format: { type: 'string', enum: ['Short video', 'Reel', 'Carousel', 'Photo'] },
      platform: { type: 'string', enum: ['TikTok', 'Instagram', 'YouTube', 'Facebook'] },
      length: str('e.g. "30 sec", "6 slides", "1 photo".'),
      title: str('Post title.'),
      hook: str('The opening line, in quotes.'),
      beats: { type: 'array', items: { type: 'string' }, description: '2 to 4 short steps.' },
      why: str('One or two sentences tied to the talent story or numbers.'),
      when: str('Best time to post, e.g. "Thu, 7 pm".'),
    }),
  },
});

const PITCH_SCHEMA = obj({
  pitch: str('The pitch message, ready to paste into an email or DM.'),
  profile: str('One paragraph talent profile.'),
});

// ---- Agents -------------------------------------------------------------------

type Grow = { ideas: { title: string; why: string }[] };
type Scout = { brands: BrandInput[] };
type Content = { ideas: { format: string; platform: string; length: string; title: string; hook: string; beats: string[]; why: string; when: string }[] };
type Pitch = { pitch: string; profile: string };

export async function runAgent(agent: AgentName, req: AgentRequest) {
  const t = req.talent;
  switch (agent) {
    case 'grow': {
      const s = liveStats(t);
      if (!s) throw new AgentError('needs_account', 'Connect an account so the agent can read the numbers.');
      const few = s.posts[0] < 5;
      const out = await chatJson<Grow>({
        name: 'grow_ideas',
        schema: GROW_SCHEMA,
        system: `${VOICE} You are the Grow agent. You suggest what to do next to grow views and engagement: what to post, tagging a brand, inviting a collab. Each idea must name a real number from the talent's accounts.`,
        user: `${describe(t)}\n\n${few ? 'The account is new with very few posts. Say so, and give starter ideas instead of trends.' : 'Give ideas based on what the numbers show.'} Give 3 to 5 ideas.${avoidLine(req.avoid)}`,
      });
      return { ideas: (out.ideas || []).slice(0, 5), few };
    }
    case 'scout': {
      const out = await chatJson<Scout>({
        name: 'brand_ideas',
        schema: SCOUT_SCHEMA,
        system: `${VOICE} You are the Scout agent. You suggest brands that fit the talent's niche and character story, mostly brands active in the Philippines, and where to approach each: a creator marketplace (Elev8or; TikTok One needs 1,000+ followers), creator agencies, or direct outreach. You only suggest; you send nothing.`,
        user: `${describe(t)}\n\nGive at least 3 brand ideas. Each "why" must tie to this talent.${avoidLine(req.avoid)}`,
      });
      return { brands: (out.brands || []).slice(0, 5) };
    }
    case 'content': {
      const out = await chatJson<Content>({
        name: 'content_ideas',
        schema: CONTENT_SCHEMA,
        system: `${VOICE} You are the Content agent. You suggest what the talent can post next, as short briefs the student makes in their own image and video tools.`,
        user: `${describe(t)}\n\nGive 3 content ideas that fit the character story.${avoidLine(req.avoid)}`,
      });
      return { ideas: (out.ideas || []).slice(0, 3) };
    }
    case 'pitch': {
      const b = req.brand!;
      const s = liveStats(t);
      const out = await chatJson<Pitch>({
        name: 'pitch_draft',
        schema: PITCH_SCHEMA,
        maxTokens: 1200,
        system: `${VOICE} You are the Pitch agent. You draft a short sponsorship pitch from the student to a brand, plus a one-paragraph talent profile. The student edits, approves and sends it themselves. ${s ? 'Use the numbers given, exactly.' : 'No account is connected: leave all numbers out. Do not invent numbers.'}`,
        user: `${describe(t)}\n\nBrand: ${b.name} — ${b.what}.\nWhy it fits: ${b.why}\nWhere to approach: ${b.where}\n\nWrite the pitch as "Hi ${b.name} team," and sign it as:\n${req.sender!.name}\n${req.sender!.agency}\nAsk for a short call about a sponsored post. Keep it under 150 words.`,
      });
      return { pitch: out.pitch, profile: out.profile, hasNumbers: !!s };
    }
  }
}

// ---- Profile ------------------------------------------------------------------

export type ProfileRequest = {
  name: string;
  /** The talent's accounts, as the account reader takes them. */
  accounts: ReadRequest[];
  /** Character stories already shown. "Fill in again" must give a new one. */
  avoid: string[];
};

export function parseProfileRequest(body: unknown): ProfileRequest {
  const b = body as Partial<ProfileRequest> | null;
  if (!b || !isStr(b.name, 120)) throw new AgentError('bad_request', 'name is required.');
  if (!Array.isArray(b.accounts) || !b.accounts.length || b.accounts.length > 8) throw new AgentError('bad_request', 'accounts must hold 1 to 8 accounts.');
  let accounts: ReadRequest[];
  try {
    accounts = b.accounts.map(parseReadRequest);
  } catch (e) {
    throw new AgentError('bad_request', (e as Error).message);
  }
  const avoid = Array.isArray(b.avoid) ? b.avoid.filter((x): x is string => isStr(x)).slice(0, 5) : [];
  return { name: b.name, accounts, avoid };
}

const PROFILE_SCHEMA = obj({
  niche: str('The niche in 2 to 5 words, e.g. "Budget travel in the Philippines".'),
  story: str('The character story: 2 or 3 sentences, at most 70 words, about who the AI talent is and what they post.'),
});

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n) + '…' : s);

/**
 * Write a niche and character story. `abouts` are the accounts the server could read; `others` are
 * the accounts it could not read (added by handle, or a platform the server does not read yet).
 */
export async function runProfile(name: string, abouts: AccountAbout[], others: { platform: string; handle: string }[], avoid: string[]) {
  const lines = abouts.map((a) => [
    `${a.platform} ${a.handle}`,
    `Bio: ${a.bio ? clip(a.bio, 600) : 'none'}`,
    a.posts.length ? `Newest posts:\n${a.posts.map((p) => '- ' + clip(p.replace(/\s+/g, ' '), 300)).join('\n')}` : 'No posts yet.',
  ].join('\n'));
  if (others.length) lines.push(`Accounts with no text to read: ${others.map((o) => `${o.platform} ${o.handle}`).join(', ')}`);
  const out = await chatJson<{ niche: string; story: string }>({
    name: 'talent_profile',
    schema: PROFILE_SCHEMA,
    maxTokens: 1200,
    system: `${VOICE} You are the Profile agent. From an AI talent's own accounts, you write the talent's niche and character story. The app uses them to suggest brands and write pitches, so they must say what the talent posts and who watches it. Use only what the bios and posts show. When the accounts show little, write a short, plain story and do not invent details such as an age, a job or a city.`,
    user: `AI talent: ${name}\n\n${lines.join('\n\n')}\n\nWrite the niche and the character story. Refer to the talent as ${name}.${avoidLine(avoid)}`,
  });
  return { niche: out.niche.trim(), story: out.story.trim() };
}
