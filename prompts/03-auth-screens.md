# 03 · Auth screens (mocked)

Status: done

## Goal
A guest can create an account, confirm their email with a 6-digit code, and sign in, on screens that match the sign-up design. Auth is mocked behind functions shaped like Clerk's flow (loading, success, test errors), so Clerk can replace the mock later without changing the screens.

## Decisions
User answers:
- No Apple button on any platform. Google only. This is an approved drift from the design.

Defaults picked (reference: `../airbnb-clone/prompts/04-auth-screens.md`, same design):
- Source: the sign-up design, attached in chat (ask again in a new session). There are no designs for verify and sign-in; both reuse the sign-up shell and components with copy written here. Values marked * are estimated from the image.
- Mock auth in `src/lib/auth/mock.ts`, ~800 ms per call, throws `AuthError` with a guest-facing `message`:
  - `signUp({ name, email, password })`: "That email is already in use." for `taken@example.com`.
  - `verifyEmail({ email, code })`: accepts only `424242` (Clerk's test code); otherwise "That code isn't right. Check your email and try again."
  - `resendCode({ email })`: always succeeds.
  - `signIn({ email, password })`: "Email or password is incorrect." when the password is `wrong-password`.
  - `signInWithGoogle()`: always succeeds.
  - Nothing is stored; no session yet.
- Validation runs on submit, in code, before the mock: name required, email matches `x@y.z`, password ≥ 8 characters, code exactly 6 digits. The first error shows in a danger `Alert` above the primary button and invalid fields get a danger border. Editing a field clears its error. The primary button stays enabled; it shows its loading state during a call.
- Navigation:
  - Onboarding "Get started" → `/sign-up`; "Continue with Google" and "Skip" → `/sign-in` (unchanged).
  - Sign up → `router.push({ pathname: "/verify", params: { email } })`.
  - Verify or sign-in (or Google) succeeds → `router.dismissAll()` then `router.replace("/home")`, so Back can't return to the forms (check the SDK 58 router docs for the exact API).
  - Footer links between sign-in and sign-up use `replace`.
  - Back button: `router.back()`, shown only when `router.canGoBack()`.
- `/home` (`src/app/home.tsx`) becomes a stub: "You're signed in" (`heading`), muted "Auth is mocked until Clerk is set up.", secondary "Sign out" → replace to `/sign-in`.
- Verify auto-submits on the 6th digit and also has a "Verify" button. Resend is disabled for 30 s ("Resend in 0:30", counting down), restarting after each resend; a successful resend shows a success `Alert` ("We sent a new code to …").
- Keyboard: each screen is a `ScrollView` with `keyboardShouldPersistTaps="handled"` and `automaticallyAdjustKeyboardInsets`; on Android, `KeyboardAvoidingView` if the keyboard covers the button (check on the phone). Fields chain with `returnKeyType="next"`; the last submits. Autofill: `name`/`email`/`new-password` (sign-up), `email`/`current-password` (sign-in), `one-time-code` (verify); Android `autoComplete` equivalents.
- `Input` gets an optional `label` (two-line field from the design) and `invalid`. Without `label`, the current single-line layout is unchanged.
- `IconButton` gets an `outline` variant (`border-line bg-surface`) and an `nav` size (`size-12`, icon 22).
- Auth-only pieces in `src/components/auth/`: `AuthScreen` (shell), `GoogleButton`, `OrDivider`, `CodeInput`, `AuthFooter`. `src/components/onboarding/auth-stub.tsx` is deleted.
- Wordmark (real SVG) gets used at a smaller `height` in the header. Google "G" reuses `GoogleG`.

### Shared shell (`AuthScreen`), pt
- `bg-surface`, status bar dark, content `px-6`; footer at the bottom (`flexGrow: 1`, `justify-between`), scrolls on short screens.
- Header row: top = safe-area top + 8*, `flex-row justify-between items-center`. Left: `IconButton variant="outline" size="nav"` with `ChevronLeft`. Right: `Wordmark height={28}`*.
- Headline: `mt-8`*, `hero` (44, ExtraBold), two lines via `\n`.
- Body: `mt-3`*, `body` (16/24, regular, muted), three lines.
- Form: `mt-6`*, fields `gap-3.5`*.
- Primary: `mt-6`*, `Button` primary with `ArrowRight`.
- `OrDivider`: `mt-5`*, row `items-center gap-5`*, 1 pt `bg-line` lines `flex-1`, "or" `caption` muted.
- `GoogleButton`: `mt-3`*, the existing secondary `Button` with `GoogleG` (h-14; design ~h-12*, kept at the design-system size).
- `AuthFooter`: `mt-10`*, bottom = safe-area bottom + 16*, centered row `gap-2`: prompt `caption`/`body` muted + link (new `Text` variant `link`: `font-jakarta-semibold text-body text-ink underline`).

### Labelled field (`Input` with `label`)
- h-16* (design ~66), `rounded-lg`, `px-5`, `gap-5`* between icon (24, ink) and the text column; default/focus colors unchanged; `invalid` → `border-danger bg-danger-soft`.
- Text column: label (`font-jakarta-medium` 15*, ink; uses `text-caption` size 14 if no 15 token — proposed token `--text-field-label: 15px` / 1.33), then the input (`font-jakarta text-body`, placeholder `ink-muted`, `py-0`, fixed line height). The fields in the design have no visible border: default `border-transparent bg-surface-alt` for the labelled variant*.
- Password toggle unchanged (EyeOff while masked).

### Screens and copy
- Sign up (design): "Create\nyour account" / "Join roam to save your stays, get personalized recommendations and access them across all your devices." Fields: `User` "Full name" ("e.g. Adrian Hajdin"), `Mail` "Email address" ("you@example.com"), `Lock` "Password" ("At least 8 characters", secure). Button "Create account". Or divider, Google. Footer "Already have an account?" / "Sign in".
- Verify: "Check your\nemail" / "We sent a 6-digit code to {email}. Enter it below to finish creating your account." `CodeInput`: 6 cells `gap-2.5`*, each `flex-1` h-16 `rounded-lg border-2`, digit in `title`; active cell gets focus colors, all cells danger when invalid. One transparent `TextInput` (`number-pad`, `oneTimeCode`, `maxLength 6`) covers the cells so paste/autofill work. Button "Verify". No social. Footer "Didn't get a code?" / "Resend" (or "Resend in 0:SS", muted, not underlined).
- Sign in: "Welcome\nback" / "Sign in to see your saved stays and pick up where you left off." Fields: email, password ("Your password"). Button "Sign in". Or, Google. Footer "New to roam?" / "Create an account".

### Proposed tokens
- `--text-field-label: 15px; --text-field-label--line-height: 1.3333` (ratio).
- No new colors or radii.

## Out of scope
Clerk, real Google OAuth, sessions and protected routes, persisting onboarding, forgot password, Apple sign-in, analytics.

## Steps
### 1. Mock and primitives
`src/lib/auth/mock.ts` (+ `AuthError`, validators in `src/lib/auth/validate.ts`). `Input` `label`/`invalid`; `IconButton` `outline`/`nav`; `Text` `link`; field-label token. Lint/tsc pass; `design-system` preview still renders.

### 2. Auth components
`src/components/auth/`: `AuthScreen`, `OrDivider`, `GoogleButton`, `AuthFooter`, `CodeInput`.

### 3. Screens and routes
`(auth)/sign-up.tsx`, `(auth)/verify.tsx`, `(auth)/sign-in.tsx`, `home.tsx` stub; delete `auth-stub.tsx`. Wire navigation and form state per Decisions.

### 4. Check on the phone
tsc, lint, `npx expo export --platform android`. The user opens each screen on their Android phone and compares sign-up with the design; fix reported differences.

## Verification
- `npx tsc --noEmit`, `npx expo lint`, Android bundle export pass.
- On the phone: onboarding → Get started → sign-up. Submit empty → name error; bad email → email error; short password → password error; `taken@example.com` → in-use error. Valid → verify with the email shown. Wrong code → error; `424242` → home, Back doesn't return. Resend counts down from 0:30 and shows the success alert.
- Sign-in: `wrong-password` → error; any other valid → home. Google → home. Footer links swap sign-in ↔ sign-up.
- Keyboard doesn't cover the primary button on Android; fields chain with Next.

## AGENTS.md updates
- Who owns what → Auth: screens in `src/app/(auth)/` call `src/lib/auth/mock.ts` until Clerk replaces it; test values (`taken@example.com`, `424242`, `wrong-password`).
- Design system: `Input` `label`/`invalid`, `IconButton` `outline`/`nav`, `Text` `link`, `text-field-label` token.
- Replace the "auth screens are stubs" note in the onboarding line.

## Result
Built as planned. Changes while building:
- `Input` takes `showLabel` (two-line field) plus `invalid` and a `ref` (React 19 prop) typed `TextInputInstance` (RN 0.88).
- `IconButton` got `variant` (`filled` default, `outline`) and size `nav`; `Text` got `link` and `fieldLabel`.
- Success leaves the auth stack with `finishAuth` (`src/lib/auth/finish.ts`: `dismissAll` when possible, then `replace("/home")`). Back from home can still reach onboarding until Clerk adds protected routes.
- Back button visibility uses the `useCanGoBack` hook (correct during render).
- `KeyboardAvoidingView` (`padding` on iOS, `height` on Android) wraps the scroll view.
tsc, lint and the Android bundle export pass. Checked on the phone (Expo Go) against the design: matches, nothing failed.
