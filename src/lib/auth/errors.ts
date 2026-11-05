import { isClerkAPIResponseError } from "@clerk/expo";

const FALLBACK = "Something went wrong. Please try again.";

const MESSAGES: Record<string, string> = {
  form_identifier_exists: "That email is already in use.",
  form_identifier_not_found: "Email or password is incorrect.",
  form_password_incorrect: "Email or password is incorrect.",
  form_code_incorrect: "That code isn't right. Check your email and try again.",
  verification_expired: "That code has expired. Tap Resend to get a new one.",
  verification_failed: "That code has expired. Tap Resend to get a new one.",
  form_password_pwned: "This password has appeared in a data breach. Choose a different one.",
  form_password_length_too_short: "Use at least 8 characters for your password.",
};

/** Clerk codes whose own long message is already guest-facing (lockouts, rate limits). */
const USE_CLERK_MESSAGE = new Set(["too_many_requests", "user_locked"]);

/** Guest-facing copy for an error from a Clerk method (or anything thrown). */
export function authErrorMessage(error: unknown) {
  if (!error) return FALLBACK;
  const first = isClerkAPIResponseError(error) ? error.errors[0] : undefined;
  const code = first?.code ?? (error as { code?: string }).code;
  if (!code) return FALLBACK;
  if (MESSAGES[code]) return MESSAGES[code];
  if (USE_CLERK_MESSAGE.has(code)) return first?.longMessage ?? first?.message ?? FALLBACK;
  return FALLBACK;
}

/** "Ada Lovelace King" → { firstName: "Ada", lastName: "Lovelace King" }. */
export function splitName(full: string) {
  const name = full.trim().replace(/\s+/g, " ");
  const space = name.indexOf(" ");
  if (space === -1) return { firstName: name };
  return { firstName: name.slice(0, space), lastName: name.slice(space + 1) };
}
