// What the student reads when a call to the server fails. One message per error code from the API routes.
import type { AgentErrorCode } from './api';

/** A message about a problem: it stays on screen until the student closes it. */
export function isProblem(text: string) {
  return /could not|couldn't|can't|cannot|failed|did not load|not connected|session ended|lost its connection|check the|check your|please /i.test(text);
}

/** The message for an error code. `what` names the thing that failed, for example "that Instagram account". */
export function errorText(code: AgentErrorCode | string, what = 'that account'): string {
  switch (code) {
    case 'unauthorized': return 'Your session ended. Log in again.';
    case 'network': return 'The app could not reach the server. Check your connection, then try again.';
    case 'timeout': return 'This took too long. Try again.';
    case 'not_found': return "I couldn't find " + what + '. Check the handle.';
    case 'reconnect': return what[0].toUpperCase() + what.slice(1) + ' lost its connection. Press Reconnect and log in again.';
    case 'not_configured': case 'no_key': return 'The app cannot read ' + what + ' yet.';
    case 'upstream': case 'bad_output': return 'The service did not answer well. Try again in a minute.';
    case 'needs_account': return 'Connect an account first, so the app can read its numbers.';
    case 'bad_request': return 'The app sent something the server could not read. Reload the page, then try again.';
    default: return 'Something went wrong on the server. Try again.';
  }
}
