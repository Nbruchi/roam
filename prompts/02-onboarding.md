# 02 · Onboarding

Status: done

## Goal
A first-launch onboarding screen matching the attached design: a 3-slide swipeable carousel (full-bleed photo, wordmark, Skip, location pill, white bottom sheet with progress dashes, headline, copy, "Get started" and "Continue with Google"). Buttons lead into placeholder auth screens.

## Decisions
User answers:
- 3 swipeable slides; same layout, photo, location pill, headline and body change per slide.
- Placeholder auth routes: Get started → sign-up, Continue with Google → sign-in, Skip → home. Clerk wiring is a later feature.
- Wordmark and Google "G" are marked placeholders, listed in the report.

Defaults picked:
- Onboarding is the app's first route (`src/app/index.tsx`). No "seen" persistence yet (would need storage); every launch shows it. Revisit when Clerk lands (signed-in users skip it).
- Home moves to `src/app/home.tsx` (the current "Welcome" stub). Auth stubs in `src/app/(auth)/sign-in.tsx` and `sign-up.tsx`, each with a back link to onboarding.
- Photos are Unsplash URLs via `expo-image` (already installed), 1200px wide, with a lavender-grey blurhash-free `bg-surface-alt` fallback. Candidates (verified to resolve; subject checked visually while building):
  1. cabin at sunset (`photo-1449158743715-0a90ebb6d2d8`), "Whistler, BC"
  2. beach villa (`photo-1520250497591-112f2f40a3f4`), "Tulum, Mexico"
  3. city loft (`photo-1502784444187-359ac186c5bb`), "Lisbon, Portugal"
- Swipe via a horizontal paging `FlatList` (no new dependency) with the sheet content per slide; dashes animate with Reanimated (installed). Last slide keeps both buttons; Get started is always shown.
- Copy slide 1 is from the design. Slides 2 and 3 (proposed):
  - "Stay somewhere that fits your pace" / "Describe the trip in one sentence and roam ranks stays that match, from quiet retreats to lively city lofts."
  - "Book with clear, honest policies" / "Ask about cancellation, pets, and house rules and get the host's exact words, never a guess."
- Sheet shape: white, top corners 40px radius with a slight rise on the right (design shows an asymmetric curve); built as a rounded-top view, asymmetry estimated and noted.

Proposed new tokens (values in the design with no token yet): `--radius-sheet: 40px`, `--color-scrim` (dark pill behind location: `rgba(0,0,0,0.45)` + white text), `--text-hero: 40px / 40px` (headline; bold, tight tracking). Added to `global.css` and `src/theme/index.ts`.

## Out of scope
Clerk, real Google sign-in, auth forms, persistence of "seen onboarding", dark mode, analytics events.

## Steps
### 1. Tokens, routes, placeholders
Add the proposed tokens. Move the current Index to `src/app/home.tsx`. Create `(auth)/_layout.tsx` (Stack, no header), `sign-in.tsx`, `sign-up.tsx` as stubs (title, short copy, `Button` back to onboarding). Add `src/components/onboarding/` for non-route code. Done when `roam://sign-in`, `roam://sign-up`, `roam://home` open.

### 2. Slide data and components
`src/components/onboarding/slides.ts` (typed array: image, location, title, body). `Wordmark` (placeholder bold text "roam", 48px, ink; marked TODO asset), `GoogleG` placeholder mark (replaces with `assets/images/google.png` when supplied), `ProgressDashes` (3 dashes, active lavender wide, others `surface-alt`, animated width/color). Done when each renders in isolation on `design-system` preview or onboarding.

### 3. Onboarding screen
`src/app/index.tsx`: full-screen paging FlatList of photos behind; overlay with safe-area aware wordmark (top-left), Skip (glass pill top-right, `router.replace('/home')`), location pill (scrim, MapPin icon, white text) above the sheet; bottom sheet with dashes, `heading`/hero title, body, `Button` "Get started" (trailing arrow → `/sign-up`) and secondary "Continue with Google" (→ `/sign-in`). Use existing `Button`, `Text`, `Icon`. Images load with loading fallback; load failure shows the plain surface color (error state), no empty state needed (static data). Status bar light. Done when it matches the design at iPhone 15/16 sizes.

### 4. Compare and fix
Open in the iOS simulator, screenshot, compare to the design, list differences, fix, repeat.

## Verification
- `npx tsc --noEmit` and `npx expo lint` pass.
- Simulator screenshot vs design: list differences and which values were estimated.
- Swipe through the 3 slides: photo, location, copy, dashes change; Get started → sign-up; Continue with Google → sign-in; Skip → home; back from stubs returns to onboarding.
- Airplane mode: photos fail gracefully, text and buttons still usable.

## AGENTS.md updates
Add under Design system: onboarding tokens (`radius-sheet`, `scrim`, `text-hero`); note onboarding is the first route and is not yet persisted; replace "Pending assets" with the wordmark and Google "G" placeholders.

## Result
Built as planned. tsc, lint and an iOS bundle export pass. The simulator comparison (step 4) was not run: no `xcrun` on this Windows machine, so photo subjects, spacing and the sheet curve are unverified against the design. Sheet is a symmetric 40px rounded top (design curve is asymmetric).

## Revision (after first phone test on Android)
First build rendered with no photos, blank button labels and invisible dashes. Reworked using the public airbnb-clone as reference: photos page in a plain `ScrollView` with explicit page width/height; header, sheet and buttons are fixed; the sheet text cross-fades (Reanimated `FadeIn`); dots are state-driven `View`s; the sheet top is an asymmetric `react-native-svg` curve; Skip goes to `/sign-in`. Font classes renamed `font-jakarta*` so they can't collide with Tailwind weight classes. tsc, lint and an Android bundle export pass. Checked on the phone (Expo Go) against the design: matches, nothing failed.
