# 01 · Design system

Status: done

## Goal
Every Roam screen draws from one token theme (colors, type, spacing, radii, shadows, motion) and a shared component set that matches the attached design system sheet exactly. Verified on a dev-only preview screen that renders every section.

## Decisions
Answers from the user:
- Font: Plus Jakarta Sans (static weights via `@expo-google-fonts/plus-jakarta-sans`, the reference's "Geometric Sans").
- Icons: `lucide-react-native` (needs `react-native-svg`).
- Scope: everything in the reference, all 15 sections.
- Tokens live in `global.css` `@theme` (NativeWind v5), plus a small `src/theme/index.ts` for values JS needs (icon colors, shadows, motion).

Defaults picked:
- Light theme only. The sheet has no dark values, so `userInterfaceStyle` stays `automatic` but tokens have no dark pairs yet. Dark mode is a later change.
- Fonts are loaded in `src/app/_layout.tsx` with `useFonts` and the splash screen held until ready (no runtime `fontWeight`; weight comes from `fontFamily`).
- Components use `className`, not StyleSheet. Variants via a small lookup object per component, `className` prop merged last.
- Glass tab bar uses `expo-glass-effect` (already installed) on iOS, a blurred translucent View elsewhere.
- Components live in `src/components/ui/`, one file each, plus `src/components/ui/index.ts`.
- Preview screen at `src/app/design-system.tsx`, reachable by deep link `roam://design-system`; removed or gated behind `__DEV__` before release.
- Google "G" logo for "Continue with Google" is an asset: needs `assets/images/google.png` (or SVG). Placeholder until provided.
- Sample listing photo is a remote placeholder image (allowed by AGENTS.md).

Tokens (all estimated from the image, not measured):
- Colors: primary `#FFC629`, lavender `#C9B4FF`, text `#0B0B1A`, text-secondary `#6B7280`, surface `#FFFFFF`, surface-gray `#F4F5F7`, border `#E5E7EB`, glass `rgba(255,255,255,0.7)`.
- Proposed new tokens (not in the palette, seen in the design): lavender-soft `#F1ECFF` (focused input / policy icon tile), success `#16A34A` with soft bg `#E6F6EC`, danger `#E5484D` with soft bg `#FDECEC`, tag tints for New (green soft), 20% off (red soft), Superhost (blue soft `#E8EEFF`, text `#3B5BDB`), Guest favorite (yellow soft `#FFF6DD`).
- Type: display 56–64/1.0 Bold, heading 28–32/1.2 Bold, body 16/1.5 Regular, caption 14 Medium, button 17–18 Medium. Fixed sizes: display 56, heading 28, body 16, caption 14, button 17.
- Spacing: 4-point scale (4, 8, 12, 16, 20, 24, 32, 48) as Tailwind v4's default spacing; screen padding 16.
- Radii: sm 8, md 12, lg 16, xl 24, full (pills, icon buttons, chips). Use `borderCurve: continuous` for non-full.
- Shadow: soft card shadow `0 1px 2px rgba(0,0,0,0.05)`, raised `0 4px 12px rgba(0,0,0,0.10)`.

## Out of scope
- Dark mode values.
- Real screens (search, listing detail, trips, profile), data, auth, and analytics.
- Real Google sign-in wiring (button is visual only).
- Map view behind the "Map" segment.

## Steps
### 1. Dependencies and fonts
Ask-free (already approved here). Run `npx expo install @expo-google-fonts/plus-jakarta-sans expo-font lucide-react-native react-native-svg`. In `src/app/_layout.tsx`, load Regular, Medium, SemiBold, Bold with `useFonts`, keep the splash up until loaded. In `global.css` `@theme` add `--font-sans: "PlusJakartaSans_400Regular"`, `--font-medium`, `--font-semibold`, `--font-bold` (names match the package exports). Done when a `<Text className="font-bold">` renders in Plus Jakarta Sans.

### 2. Tokens
Add colors, radii, shadows and type sizes to `global.css` `@theme` (names: `--color-primary`, `--color-lavender`, `--color-ink`, `--color-ink-muted`, `--color-surface`, `--color-surface-alt`, `--color-line`, `--color-glass`, plus the proposed soft/status colors; `--radius-*`). Create `src/theme/index.ts` exporting the same colors as constants for JS use (icon `color`, glass tint), `shadows`, and `motion` (150/250/400 ms). Done when `bg-primary`, `text-ink-muted`, `rounded-lg` work and `npx tsc --noEmit` passes.

### 3. Text and icons
`src/components/ui/text.tsx`: `Text` with `variant` (display, heading, body, caption, button) mapping to size, line height, font. `src/components/ui/icon.tsx`: thin wrapper over lucide with default size 24, stroke 1.75, color token. Done when all variants match section 03 and the 8 icons of section 11 render.

### 4. Inputs and buttons
`Button` (primary yellow with arrow, secondary outlined with leading icon/Google logo; sizes; pressed, disabled, loading), `IconButton` (circular 56 with outline icon), `Input` (default, focused lavender border + soft bg, search with filter icon, password with show/hide toggle, leading icon, label for a11y). Done when sections 04 and 05 match, with pressed and focused states.

### 5. Chips, tags, alerts, controls
`Chip` (filled lavender selected, outlined default; with optional leading icon variant for All Stays/Cabins/Beach/City/Villas), `Tag` (variants guest-favorite, new, discount, superhost), `Alert` (success, error, dismiss), `SegmentedControl` (dark selected pill, List/Map), `Switch` (yellow track, native `Switch` styled via props), `Stepper` (− 1 +). Done when sections 06, 12, 13, 14, 15 match.

### 6. Cards, rows, tab bar
`ListingCard` (image with heart button, title, location, rating, amenity pills, price per night), `PolicyCard` (lavender icon tile, title, caption, chevron; variants for "Ask about policies" and "Free cancellation"), `ProfileRow` (icon, label, chevron, hairline dividers in a grouped container), `GlassTabBar` (Home active yellow capsule, Search, Trips, Profile; glass blur). Done when sections 07, 08, 09, 10 match. The tab bar is a presentational component; wiring into Expo Router tabs is a later feature.

### 7. Preview screen and compare
Build `src/app/design-system.tsx` showing sections 01–15 in the sheet's order. Open it in the iOS simulator via `xcrun simctl openurl booted roam://design-system`, screenshot, compare to the attached sheet, list every difference, fix, repeat. Done when no unexplained differences remain.

## Verification
- `npx tsc --noEmit` and `npx expo lint` pass.
- `npx expo export --platform ios` bundles.
- Grep: no hex colors or raw font sizes in `src/components/ui/` or `src/app/` outside tokens.
- Preview screen compared with the sheet section by section (screenshots), listing estimated values.
- Press, focus, disabled, loading states exercised on Button, Input, Chip, SegmentedControl, Switch, Stepper.
- Large text size check on Button and Chip (rows grow instead of clipping).
- Icon-only controls have accessibility labels.

## AGENTS.md updates
- Add a **Design system** section: tokens live in `global.css` `@theme` and `src/theme/index.ts`; components in `src/components/ui/`; font Plus Jakarta Sans; icons from lucide-react-native; no hardcoded colors, sizes, or fonts in screens.
- Add `@expo-google-fonts/plus-jakarta-sans`, `lucide-react-native`, `react-native-svg` to the allowed dependencies noted there.

## Result
Tokens, Plus Jakarta Sans, 15 shared components and a preview screen built. Type check, lint and iOS export pass. Simulator comparison not done (Windows machine); values are estimated from the image.
