import { isClerkAPIResponseError } from "@clerk/expo";

const FALLBACK = "Something went wrong. Please try again.";

const MESSAGES: Record<string, string> = {
  form_identifier_exists: "That email is already in use.",
  form_identifier_not_found: "Email or password is incorrect.",
  form_password_incorrect: "Email or password is incorrect.",
  form_code_incorrect: "That code isn't right. Check your email and try again.",
  verification_expired: "That code has expired. Tap Resend to get a new one.",
  verification_failed: "Too many incorrect codes. Tap Resend to get a new one.",
  verification_already_verified: "Your email is already confirmed. Go back and sign up again to finish.",
  client_state_invalid: "This sign-up has expired. Go back and start again.",
  form_password_pwned: "This password has appeared in a data breach. Choose a different one.",
  form_password_length_too_short: "Use at least 8 characters for your password.",
};

/** Clerk codes whose own long message is already guest-facing (lockouts, rate limits). */
const USE_CLERK_MESSAGE = new Set(["too_many_requests", "user_locked"]);

/**
 * Dev-only: print what actually went wrong, since guests only see friendly copy.
 * Never runs in release builds, so emails and codes don't reach production logs.
 */
export function logAuthIssue(where: string, details: unknown) {
  if (!__DEV__) return;
  if (isClerkAPIResponseError(details)) {
    console.warn(`[auth] ${where}`, {
      status: details.status,
      traceId: details.clerkTraceId,
      errors: details.errors.map((e) => ({ code: e.code, message: e.longMessage ?? e.message, meta: e.meta })),
    });
  } else if (details instanceof Error) {
    console.warn(`[auth] ${where}`, { name: details.name, code: (details as { code?: string }).code, message: details.message });
  } else {
    console.warn(`[auth] ${where}`, details);
  }
}

/** Guest-facing copy for an error from a Clerk method (or anything thrown). Logs the raw error in dev. */
export function authErrorMessage(error: unknown, where = "auth error") {
  if (!error) return FALLBACK;
  logAuthIssue(where, error);
  const first = isClerkAPIResponseError(error) ? error.errors[0] : undefined;
  const code = first?.code ?? (error as { code?: string }).code;
  if (!code) return FALLBACK;
  if (MESSAGES[code]) return MESSAGES[code];
  if (USE_CLERK_MESSAGE.has(code)) return first?.longMessage ?? first?.message ?? FALLBACK;
  return FALLBACK;
}

/** Shown when Clerk wants sign-up fields the app doesn't collect (an instance setting changed). */
export const MISSING_FIELDS_MESSAGE = "We couldn't create your account right now. Please try again later.";

/** "Ada Lovelace King" → { firstName: "Ada", lastName: "Lovelace King" }. */
export function splitName(full: string) {
  const name = full.trim().replace(/\s+/g, " ");
  const space = name.indexOf(" ");
  if (space === -1) return { firstName: name };
  return { firstName: name.slice(0, space), lastName: name.slice(space + 1) };
}
