-- Access tokens for connected social accounts (Instagram now; TikTok and Facebook later).
-- Tokens are encrypted by the server (AES-256-GCM, TOKEN_ENCRYPTION_KEY) before they reach this table.
-- Row-level security is on with no policies, so only the server's secret key reads or writes it.
-- The browser never sees a token: it keeps only the account's `ref` in the talent's data.

create table public.account_tokens (
  user_id       uuid not null references auth.users (id) on delete cascade,
  platform      text not null check (platform in ('TikTok', 'Instagram', 'YouTube', 'Facebook')),
  -- The platform's own id for the account, the same value as Account.ref in the app.
  ref           text not null,
  token         text not null,
  refresh_token text,
  expires_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (user_id, platform, ref)
);

-- Deauthorize and data deletion callbacks from a platform name the account, not the student.
create index account_tokens_ref on public.account_tokens (platform, ref);

create trigger account_tokens_touch before update on public.account_tokens for each row execute function public.touch_updated_at();

alter table public.account_tokens enable row level security;
revoke all on public.account_tokens from anon, authenticated;
