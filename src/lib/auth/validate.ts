export type FieldErrors<K extends string> = Partial<Record<K, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (v: string) => (v.trim() ? undefined : "Enter your full name.");
export const validateEmail = (v: string) => (EMAIL.test(v.trim()) ? undefined : "Enter a valid email address.");
export const validateNewPassword = (v: string) =>
  v.length >= 8 ? undefined : "Use at least 8 characters for your password.";
export const validatePassword = (v: string) => (v ? undefined : "Enter your password.");
export const validateCode = (v: string) => (/^\d{6}$/.test(v) ? undefined : "Enter the 6-digit code.");

/** The first message in field order, for the form's error alert. */
export function firstError<K extends string>(errors: FieldErrors<K>, order: K[]) {
  for (const k of order) if (errors[k]) return errors[k];
  return undefined;
}
