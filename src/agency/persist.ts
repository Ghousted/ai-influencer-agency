// Keeps the signed-in agency in this browser until a real backend exists.
const KEY = 'aia-state-v1';

export function loadState<K extends string>(keys: readonly K[]): Partial<Record<K, unknown>> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const out: Partial<Record<K, unknown>> = {};
    keys.forEach((k) => { if (k in data) out[k] = data[k]; });
    return out;
  } catch {
    return null;
  }
}

let pending: ReturnType<typeof setTimeout> | undefined;

export function saveState<K extends string>(state: Record<K, unknown>, keys: readonly K[]) {
  clearTimeout(pending);
  pending = setTimeout(() => {
    try {
      if (!(state as Record<string, unknown>).signedIn) { localStorage.removeItem(KEY); return; }
      const out: Partial<Record<K, unknown>> = {};
      keys.forEach((k) => { out[k] = state[k]; });
      localStorage.setItem(KEY, JSON.stringify(out));
    } catch {
      /* storage full or blocked: the app still works for this visit */
    }
  }, 300);
}

// Mock accounts: one saved agency per email, so logging back in restores it.
const ACCOUNTS = 'aia-accounts-v1';

function readAccounts(): Record<string, Record<string, unknown>> {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS) || '{}');
  } catch {
    return {};
  }
}

export function saveAccount<K extends string>(email: string, state: Record<K, unknown>, keys: readonly K[]) {
  try {
    const all = readAccounts();
    const out: Record<string, unknown> = {};
    keys.forEach((k) => { out[k] = state[k]; });
    all[email.trim().toLowerCase()] = out;
    localStorage.setItem(ACCOUNTS, JSON.stringify(all));
  } catch {
    /* storage full or blocked */
  }
}

export function loadAccount(email: string): Record<string, unknown> | null {
  return readAccounts()[email.trim().toLowerCase()] || null;
}

export function deleteSavedAccount(email: string) {
  try {
    const all = readAccounts();
    delete all[email.trim().toLowerCase()];
    localStorage.setItem(ACCOUNTS, JSON.stringify(all));
    localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
}
