# Roam

Expo React Native rental app. Guests describe a stay in one sentence ("quiet pet friendly cabin with a hot tub under $300 a night") and get ranked stays back. They can also ask booking and policy questions about a stay, answered with exact text from Roam's own content.

This file is the project's memory: it holds every decision that is still true. Plans in `prompts/` are history.

## Commands

~~~bash
npx expo install <package>  # ALWAYS use instead of npm install: resolves SDK-compatible versions
npx expo start              # dev server; the user scans the QR code on their phone (no emulators)
npx expo lint               # lint
npx tsc --noEmit            # type check
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
npx eas-cli@latest <cmd>    # EAS builds, submits, and updates (use instead of bare `eas`)
~~~

## Expo

- Expo ships breaking changes every SDK release, so don't trust memory. Before touching an Expo, EAS, or React Native API, check the `expo` major version in `package.json` and read `https://docs.expo.dev/versions/v<major>.0.0/`. For anything else, start from https://docs.expo.dev/llms.txt and follow its links.
- Routes live in `src/app/`: every file is a screen and `_layout.tsx` files define navigators. API routes are `src/app/api/*+api.ts`. Keep components, hooks, and utils outside `src/app/`.
- `ios/` and `android/` are generated. Never create or edit them by hand; configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, switch to a development build (an EAS Android development build installed on the user's phone; no local emulator or Android toolchain).

## Who owns what

Each tool has one job. Ask before moving a responsibility to a different tool.

- **Auth:** Clerk is the source of truth (app `roam`, dev instance). The custom screens in `src/app/(auth)/` (sign-up, verify, sign-in) use `@clerk/expo` v4's method-based hooks (`useSignIn`/`useSignUp`, `finalize({ navigate })`; never `@clerk/expo/legacy`). Email + password sign-in. Emailed codes verify sign-ups and new-device sign-ins (`verify?flow=sign-up|sign-in`). Google uses `useSSO` from `@clerk/expo/experimental`. Instance settings: password min 8, optional first/last name. Change them through the Clerk MCP and keep the app's checks in `src/lib/auth/validate.ts` in sync. Use the Clerk MCP for current Expo patterns.
- **Content:** Sanity (properties, hosts, policies, house rules). Studio is a standalone app in `studio/`. Schema deploys and content changes go through the Sanity MCP, and generated property copy uses Agent Actions.
- **Exact constraints** (price, guests, type, amenities, pets, place): GROQ filters, with values always passed as params.
- **Soft intent** (quiet, cozy, secluded): Dataset Embeddings via `text::semanticSimilarity()` inside `score()`.
- **Policy knowledge:** a Sanity Context endpoint in Knowledge Base mode. Context endpoints are created in the Dashboard's Context app and read with an organization token (Context Viewer), per https://www.sanity.io/docs/ai/context-migration-guide. One endpoint serves one mode. The Context skill still describes `sanity.agentContext` Studio documents with a project token; that route is deprecated, so don't use it.
- **Typed decisions** (which stay topics and policies answer a question): Jev, called from API routes through the AI SDK's `experimental_evaluate` with the `@ai-sdk/typesafe-ai` provider and `TYPESAFE_AI_API_KEY`. No Vercel AI Gateway. Keep `ai` and `@ai-sdk/typesafe-ai` pinned to exact versions, since the API is experimental.
- **Answer text:** none generated. Answers show the stay's own fields and policy text word for word, with their source. No LLM runs in the app.
- **Analytics:** PostHog, identified through Clerk.

## Rules

- Secret keys (Clerk secret key, TypeSafe key, Sanity organization token, Sanity write token) never reach the app bundle. Use them only in API routes and local scripts such as seeding. Never put them behind `EXPO_PUBLIC_`, which is bundled into the app. Never commit `.env`. Keep variable names, without values, in `.env.example`.
- Sanity Context needs a deployed Studio for the dataset. Redeploy Studio from `studio/` after schema changes.
- Jev is not an agent. It answers typed questions (Choice, Noul, Score) with probabilities. It never writes GROQ, calls tools, or generates text. Code builds queries from its answers.
- Prices, guest counts, and dates are parsed in code. Jev may choose between candidates code found, but never produces the value.
- Embeddings rank, they don't filter, and they only see the document itself (no references). Hard constraints are always GROQ filters, and text that should affect ranking lives on the property document.
- Policy answers show only text from the stay's data and Roam's policies, word for word. If nothing answers the question, say so and point to support.
- API routes verify the Clerk session before doing any work.
- Signed-in screens live in `src/app/(app)/`, guarded by `useAuth()` in its layout (check `isLoaded` first). `(auth)` and onboarding redirect signed-in guests to `/home`. Sessions persist through `tokenCache` (`expo-secure-store`). Clerk errors become guest-facing copy only through `src/lib/auth/errors.ts`.
- PostHog failures never block the app. Never send what guests type, tokens, or personal data in events.
- Let Sanity generate document IDs. Model relationships as references.
- Ask before adding a dependency or service, changing the Sanity schema once content exists, or deleting data. Prefer Expo modules over third-party libraries.
- Whenever you need input from the user, ask through your tool's built-in question panel so they pick from options instead of typing. Give two to four clear options with the recommended one first. Fall back to plain text only if no such panel exists.

## How we build features

For a new feature or a change across several files. Small fixes and questions skip this.

1. **Understand.** Read the code involved. Open an earlier plan only if this feature builds directly on it (pick by file name). Read the current docs pages for the APIs you'll use, and load a matching skill if one exists (e.g. the Expo, Clerk, Sanity, Sanity Context, or TypeSafe skills). Don't write version-specific APIs from memory.
2. **Ask.** If a real decision is unclear (scope, visible behavior, data shape), ask in the question panel, batching questions into one round and following up only if the answers raise new ones. Pick defaults for the rest and list them. If a decision in this file looks wrong, raise it instead of changing it.
3. **Plan.** Copy `prompts/TEMPLATE.md` to `prompts/NN-feature-name.md` (next number) and fill it in. The plan must be self-contained, so a fresh session can build it from this file plus the plan alone.
4. **IMPORTANT: stop and wait.** Write no app code until the user approves the plan. Ask for approval in the question panel (approve, or request changes). If they request changes, update the plan and ask again. On approval, set `Status: approved`.
5. **Build** step by step, checking each one. If a step turns out wrong, stop and explain instead of redesigning.
6. **Close out.**
   - Run the plan's Verification and give the report described under Reporting.
   - Add a short `## Result` to the plan and set `Status: done`.
   - Update this file: put each lasting decision in the section it belongs to. Replace or remove rules that are no longer true instead of appending. Keep this file under 150 lines.

## Git and GitHub

Remote: `origin` = https://github.com/Nbruchi/roam.

- **Ask before every commit and every push**, in the question panel, listing the commits (message + files) and what will be pushed. Approval covers only that commit or push.
- Work on `dev`. Push it with `git push origin dev`. Never commit to, push, merge into, or rebase `main`, never force-push, and never open or merge PRs: the user merges `dev` into `main` through a PR on GitHub.
- When the user says they've merged and pulled, run `git fetch origin`, check out `dev`, and confirm it matches `origin/main`. If it doesn't, ask before updating it.
- One logical change per commit. Usually one per feature plan, with the plan file in the same commit. Stage files by path (no `git add -A`), and run tsc and lint first. Never stage `.env*` files other than `.env.example`.
- Commit messages follow Conventional Commits: `type(scope): summary`. Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`, `perf`, `build`. The summary is imperative, lowercase, at most 72 characters, with no period. After a blank line, the body says what changed and why, wrapped at 72 characters, and names the plan (e.g. `Plan: prompts/04-clerk-auth.md`).

## Design system

- Line heights in `@theme` are unitless ratios (NativeWind multiplies by font size); never px.
- Tokens live in `global.css` `@theme` (NativeWind v5) with a JS mirror in `src/theme/index.ts` for values classes cannot reach (icon color, glass tint). Keep both in sync. Light theme only for now.
- Font: Plus Jakarta Sans, one family per weight (`font-jakarta`, `font-jakarta-medium`, `font-jakarta-semibold`, `font-jakarta-bold`; the `jakarta` names avoid Tailwind's own weight classes), loaded in `src/app/_layout.tsx` with `expo-font` from `assets/fonts/PlusJakartaSans-{Regular,Medium,SemiBold,Bold}.ttf` (relative `require`; the `@/` alias points at `src/`). `metro.config.js` lets `expo-asset`/`expo-font` import the real `react-native`, since NativeWind's wrapper loses `AssetRegistry` and breaks every bundled asset. Never use `fontWeight` with it.
- Icons: `lucide-react-native` through `Icon`. Shared components are in `src/components/ui/` (import from `@/components/ui`); screens use them and never hardcode colors, sizes, or fonts.
- `Input` `showLabel`/`invalid`/`ref`, `IconButton` `variant="outline"` and size `nav`, `Text` `link` and `fieldLabel` (`text-field-label` token). Use `TextInputInstance` for input refs.
- `src/app/design-system.tsx` is a dev-only preview of every component. Gate or remove it before release.
- Onboarding tokens: `radius-sheet`, `color-scrim`, `text-hero`. Onboarding is the first route (`src/app/index.tsx`), not yet persisted: photos page in a plain `ScrollView` (explicit page height), the sheet is fixed with an SVG curve. Reanimated and third-party views ignore `className`, so size them with `style`. Home is a stub at `src/app/(app)/home.tsx` (greeting + sign out).
- Brand assets are real: `assets/images/roam-wordmark.svg` (drawn by `Wordmark`) and `assets/images/google.svg` (drawn by `GoogleG`), both through `react-native-svg`.

## Building from designs

Designs are attached in the chat. Screens must match them exactly: layout, spacing, sizes, colors, type, radii, icons, and copy.

- Icons, fonts, and brand images come from `assets/` or the chosen icon library, never recreated from a screenshot. Sample property photos may be remote placeholder images. If an asset is missing, use a marked placeholder and list it.
- Map every color, font, spacing value, and radius to a design-system token. List values with no token in the plan as proposed new tokens instead of hardcoding them. When creating the design system itself, derive the tokens from the designs.
- UI plans describe the design (elements, states, tokens, assets) well enough to build without the image. If building in a new session, ask for the design to be attached again.
- The user tests on a physical Android phone (Expo Go or a development build); Android is the main platform, iOS is secondary. Never open or install an Android or iOS emulator or simulator, and don't use Android Studio, `xcrun`, or `adb`. After building, run tsc, lint, and a bundle check (`npx expo export --platform android`), then give the user the route or deep link (scheme in `app.json`) to open on their phone and ask them to compare it with the design. List every value estimated from an image so they know what to look at.

## Reporting

End every piece of work that changes code (features and fixes, not answers to questions) with this report. Use these headings in this order, and leave out any section that would be empty.

- **Done:** one line on the outcome, then the files changed and what changed in each.
- **Verified:** each check with ✅ or ❌ and its evidence (command output, screenshot). List what wasn't checked as ❌ with the reason. Never mark something ✅ without running it.
- **You need to:** numbered actions only the user can take, such as keys, dashboard settings, manual steps in Sanity, or assets to provide.
- **Test it yourself:** numbered steps to reproduce the result from a fresh start, ending with `Expected:` and what the user should see.
- **Notes:** defaults picked, trade-offs, and anything left for later.

## Checks

- Lint and type check pass before any task is called done.
- Screens that load data handle loading, error, and empty states.
- AI features are tried against realistic inputs, and failures are explained by cause: missing data, the decision Jev made, the query, or the code.