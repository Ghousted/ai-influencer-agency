// Errors and result shape shared by the platform readers (src/server/accounts.ts, youtube.ts, ...).
import type { AccountStats } from '@/agency/types';

export type AccountErrorCode = 'bad_request' | 'not_found' | 'not_configured' | 'timeout' | 'upstream';

export class AccountError extends Error {
  constructor(public code: AccountErrorCode, message: string, public status?: number) {
    super(message);
    this.name = 'AccountError';
  }
}

export type AccountRead = {
  /** The handle as the platform spells it, with "@". */
  handle: string;
  /** The platform's own id for the account. Later reads use it, so a handle change does not lose the account. */
  ref: string;
  stats: AccountStats;
  /** Very few posts: Grow gives starter ideas. */
  few: boolean;
};
