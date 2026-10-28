-- The platform user who granted a token. Facebook's deauthorize and data deletion callbacks name that
-- user, not the Page, so the server finds the tokens to delete by owner. For Instagram the owner is the account itself.

alter table public.account_tokens add column owner text;
update public.account_tokens set owner = ref where owner is null;
create index account_tokens_owner on public.account_tokens (platform, owner);
