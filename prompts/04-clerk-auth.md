# 04 · Clerk auth

Status: done

## Goal
Guests create an account with email, password and name, confirm it with an emailed 6-digit code, sign in with email and password (plus a code when Clerk asks for new-device checks), or continue with Google. Sessions survive app restarts, `/home` is only reachable when signed in, and guests can sign out. The custom screens in `src/app/(auth)/` stay as designed. `src/lib/auth/mock.ts` is removed.

## Decisions
- Clerk app `roam` (`app_3LgwhqPE24wPC6ZnOfLbFqNk6xK`), development instance. `.env.local` already holds its publishable key (`pk_test_c2Vuc2libGUtcm9iaW4tMzQ0Ni5jbGVyay5hY2NvdW50cy5kZXYk`) and secret key. `ClerkProvider` + `tokenCache` are already in `src/app/_layout.tsx`.
- SDK: installed `@clerk/expo` 4.15.1. Use the current method-based custom-flow API only (`useSignIn`/`useSignUp` → `signIn.password()`, `signIn.mfa.sendEmailCode()/verifyEmailCode()`, `signUp.password()`, `signUp.verifications.sendEmailCode()/verifyEmailCode()`, `finalize({ navigate })`). Never `@clerk/expo/legacy`, `prepareFirstFactor`, or `setActive` (except after SSO). Verify param shapes against `node_modules/@clerk/shared/dist/types/signInFuture.d.ts` and `signUpFuture.d.ts`.
- Sign-in = email + password (user choice). Codes are used to verify the email at sign-up, and for Clerk's new-device check (`signIn.status === 'needs_client_trust'` → `signIn.mfa.sendEmailCode()` → Verify screen).
- Clerk config changes through the Clerk MCP (`patch_instance_config`, dry run first): password allowed as a sign-in strategy (currently `auth_email.sign_in_strategies` is `["email_code"]` only), `auth_password.min_length` 15 → 8 (matches the app's check and "At least 8 characters" copy), `user_model.first_name` and `last_name` enabled, not required. Read `get_instance_config_schema` first for the exact keys.
- Name: the full name is split at the first space → `firstName` / `lastName` (lastName omitted if there's no space), sent with `signUp.password(...)`.
- Google: real, through `useSSO()` + `startSSOFlow({ strategy: 'oauth_google' })` (browser flow, works in Expo Go). Then `setActive({ session: createdSessionId })`. A cancelled flow (no session) is not an error. `signUp.status === 'missing_requirements'` after Google (shouldn't happen, password isn't required for OAuth users) shows the generic error.
- New dependencies via `npx expo install`: `expo-secure-store` (needed by `tokenCache`, otherwise sessions don't persist), `expo-auth-session` and `expo-crypto` (needed by `useSSO`). `expo-web-browser` is already installed. All three ship in Expo Go, so no development build is needed.
- Route guards (Expo Router, `useAuth()`; always check `isLoaded` first and return `null` while loading so the splash stays):
  - New group `src/app/(app)/` with a `_layout.tsx` that redirects signed-out guests to `/sign-in`. `home.tsx` moves into it; its URL stays `/home`.
  - `src/app/(auth)/_layout.tsx` redirects signed-in guests to `/home`.
  - `src/app/index.tsx` (onboarding) redirects signed-in guests to `/home`, so a restart skips onboarding.
  - `design-system.tsx` stays public (dev-only).
- Verify screen serves both flows via a `flow` param: `flow=sign-up` (current copy) or `flow=sign-in` (body: "We sent a 6-digit code to {email}. Enter it below to finish signing in."; new copy, not in the design). If there's no matching in-progress attempt (`signUp.status !== 'missing_requirements'` / `signIn.status !== 'needs_client_trust'`), redirect to the flow's start screen.
- After any finished auth: `finalize({ navigate })`. If `session.currentTask` is set, show the generic error (no session tasks are configured). Otherwise `finishAuth(router)` (existing helper: dismiss the auth stack, replace with `/home`).
- Errors: `src/lib/auth/errors.ts` replaces `mock.ts`'s `errorMessage`, mapping Clerk error codes to guest-facing copy. `form_identifier_exists` → "That email is already in use."; `form_identifier_not_found` / `form_password_incorrect` → "Email or password is incorrect."; `form_code_incorrect` → "That code isn't right. Check your email and try again."; `verification_expired` → "That code has expired. Tap Resend to get a new one."; `form_password_pwned` → "This password has appeared in a data breach. Choose a different one."; `form_password_length_too_short` → "Use at least 8 characters for your password."; `too_many_requests` / `user_locked` → Clerk's `longMessage`; anything else → "Something went wrong. Please try again." Errors come from the `{ error }` result of each method; unexpected throws use the fallback.
- Captcha: sign-up renders `<View nativeID="clerk-captcha" />` (bot protection is off now, but this is the required mount point).
- Sign out: Home shows the guest's name (or email) and a "Sign out" button calling `useClerk().signOut()`. The `(app)` guard then redirects to `/sign-in`.
- `.env.example` (new) lists `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=` and `CLERK_SECRET_KEY=` (secret is for API routes and scripts only).

## Out of scope
Forgot password, MFA/TOTP, native Google sheet (`useSignInWithGoogle`), Apple, `AuthView`, Clerk session verification in API routes (none exist yet), PostHog identify, production instance, and persisting onboarding.

## Steps
### 1. Dependencies and Clerk config
`npx expo install expo-secure-store expo-auth-session expo-crypto`. With the Clerk MCP: `get_instance_config_schema`, then `patch_instance_config` with `dry_run` → apply: password sign-in on, `auth_password.min_length: 8`, `user_model.first_name/last_name.enabled: true`. Re-fetch `<frontendApi>/v1/environment?_is_native=true` to confirm `password.used_for_first_factor: true`, min_length 8, first/last name enabled. Create `.env.example`. Done when tsc passes and the environment shows the new settings.

### 2. Auth helpers
Delete `src/lib/auth/mock.ts`. Add `src/lib/auth/errors.ts` (`authErrorMessage(error)`, mapping above) and `splitName(full)`. Keep `validate.ts` and `finish.ts`.

### 3. Sign up + Verify
`sign-up.tsx`: `useSignUp()`. On submit: `signUp.password({ emailAddress, password, firstName, lastName })` → `signUp.verifications.sendEmailCode()` → `router.push({ pathname: '/verify', params: { email, flow: 'sign-up' } })`. Add the captcha view. Show errors via `authErrorMessage`. `verify.tsx`: read `flow`. For sign-up use `signUp.verifications.verifyEmailCode({ code })`, resend `sendEmailCode()`. For sign-in use `signIn.mfa.verifyEmailCode({ code })`, resend `signIn.mfa.sendEmailCode()`. On `status === 'complete'` → `finalize` → `finishAuth`. Keep the existing UI, timer, and auto-submit at 6 digits.

### 4. Sign in
`sign-in.tsx`: `useSignIn()`. `signIn.password({ emailAddress, password })`. `complete` → finalize. `needs_client_trust` (or `needs_second_factor` with an `email_code` factor) → `signIn.mfa.sendEmailCode()` → `/verify?flow=sign-in`. Any other status → generic error.

### 5. Google
Rewrite `src/components/auth/google-button.tsx` around `useSSO()`. Same props (`onSuccess`, `onError`, `disabled`, `className`). The onboarding "Continue with Google" button keeps routing to `/sign-in` (unchanged).

### 6. Guards, home, sign out
Create `src/app/(app)/_layout.tsx` and move `src/app/home.tsx` to `src/app/(app)/home.tsx`. Add the signed-in redirect to `(auth)/_layout.tsx` and `index.tsx`. Home uses `useUser()` for the greeting and `signOut()`. Remove the "Auth is mocked" copy.

## Verification
- `npx tsc --noEmit`, `npx expo lint`, `npx expo export --platform android` pass. `grep -r "auth/mock" src` returns nothing.
- On the phone (Expo Go):
  1. Sign up with a real inbox, a name with a space, and an 8+ character password → code email → Verify → Home shows the first name. Check the user in Clerk (MCP `list_users`) has first/last name.
  2. A wrong code shows the code error; Resend after 30s sends a new email.
  3. Sign up again with the same email → "That email is already in use."
  4. A short password is blocked by the app's check; a breached one (e.g. `password123`) shows the breach message.
  5. Sign out → Sign in screen. Back doesn't return to Home.
  6. Sign in with the wrong password → error. With the right one → Home (or Verify with `flow=sign-in` if Clerk asks for a device check → Home).
  7. Kill and reopen the app → lands on Home with no flash of onboarding (persistent session).
  8. Signed out, open `roam://home` → redirected to Sign in.
  9. Continue with Google → browser → Home. Cancelling the browser does nothing.

## AGENTS.md updates
- **Who owns what → Auth:** replace the mock sentence. Custom screens in `src/app/(auth)/` call Clerk's method-based hooks (`@clerk/expo` v4, never `/legacy`). Email + password sign-in, email codes for sign-up verification and new-device checks, Google through `useSSO`. Clerk dev instance: password min 8, optional first/last name.
- **Rules:** protected screens live in `src/app/(app)/`, guarded by `useAuth()` (check `isLoaded` first). `(auth)` and onboarding redirect signed-in guests to `/home`. Clerk errors map to copy in `src/lib/auth/errors.ts`.
- Drop the mock test values (`taken@example.com`, `424242`, `wrong-password`).
- **Design system:** "Home is a stub at `src/app/home.tsx`" → `src/app/(app)/home.tsx`.

## Result
Built as planned. `mock.ts` is gone, and every screen calls Clerk. tsc, lint and `expo export --platform android` pass. Changes from the plan:
- Google uses `useSSO` from `@clerk/expo/experimental` (the v4 Core 3 variant that finalizes the session itself), not `setActive`.
- Password sign-in was already on. `used_for_first_factor: false` in `/v1/environment` is misleading; a test user's sign-in offers `password` as a first factor (checked via the Frontend API). No Dashboard change needed.
- Follow-up fixes: first/last name were later made required in the Dashboard, which stranded one-word-name sign-ups after the code step; set back to optional and auth errors are now logged in dev. Google hung in Expo Go because SDK 58 Expo Go reports `executionEnvironment: "bare"`, so the default redirect was `roam://`; `ssoRedirectUrl()` now returns `exp://<hostUri>/--/sso-callback` in dev, and Google sign-in works on the phone.
- On-device flows (Verification 1–9) not yet run.
