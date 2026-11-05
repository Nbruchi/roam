<div align="center">

<img src="assets/images/roam-wordmark.svg" alt="roam" height="48" />

### Describe your stay in one sentence. Get stays that fit.

*"quiet pet friendly cabin with a hot tub under $300 a night"*

![Expo SDK 58](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)
![React Native 0.88](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![NativeWind 5](https://img.shields.io/badge/NativeWind-5-38BDF8?logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)
![Sanity](https://img.shields.io/badge/Content-Sanity-F03E2F?logo=sanity&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-3DDC84?logo=android&logoColor=white)

</div>

---

## 📖 About

**Roam** is an Expo React Native app for renting stays. Guests type what they want in plain words and get stays ranked to match. They can also ask booking and policy questions about a stay. Answers quote Roam's own content word for word and name their source; **no LLM writes answer text in the app**.

| | What it does | How |
|---|---|---|
| 🔎 | **One-sentence search** | Hard limits (price, guests, type, amenities, pets, place) become GROQ filters. Soft wishes ("quiet", "cozy") rank results with Sanity Dataset Embeddings. |
| 💬 | **Policy answers** | A Sanity Context endpoint (Knowledge Base mode) finds the policy. The app shows its exact text and source. |
| 🧭 | **Typed decisions** | Jev answers typed questions (which topic, which policy) with probabilities. Code builds every query from those answers. |
| 🔐 | **Accounts** | Clerk: email + password with emailed codes, Google sign-in, persistent sessions. |

## ✨ Status

| | Feature | Plan |
|:-:|---|---|
| ✅ | Design system: tokens, Plus Jakarta Sans, shared UI components | [`01-design-system`](prompts/01-design-system.md) |
| ✅ | Onboarding carousel | [`02-onboarding`](prompts/02-onboarding.md) |
| ✅ | Custom auth screens: sign up, verify, sign in | [`03-auth-screens`](prompts/03-auth-screens.md) |
| ✅ | Clerk auth: email codes, Google, protected routes, sign out | [`04-clerk-auth`](prompts/04-clerk-auth.md) |
| 🚧 | Stay search, stay details, policy answers, analytics | Planned |

## 🧱 Tech stack

| Area | Tool |
|---|---|
| 📱 App | [Expo](https://docs.expo.dev) SDK 58 · React Native 0.88 · React 19 · [Expo Router](https://docs.expo.dev/router/introduction) |
| 🎨 Styling | [NativeWind v5](https://www.nativewind.dev) (Tailwind v4 `@theme` tokens) · [Lucide](https://lucide.dev) icons · Reanimated |
| 🔐 Auth | [Clerk](https://clerk.com/docs/expo/getting-started/quickstart) (`@clerk/expo`) |
| 🗂️ Content | [Sanity](https://www.sanity.io): properties, hosts, policies, house rules |
| 🧭 Decisions | Jev via the AI SDK (`@ai-sdk/typesafe-ai`), in API routes only |
| 📊 Analytics | PostHog, identified through Clerk |

## 🚀 Getting started

> [!NOTE]
> Roam is tested on a **physical Android phone** with Expo Go (iOS is secondary). No emulators are needed.

**Prerequisites:** Node.js LTS, the [Expo Go](https://expo.dev/go) app on your phone, and a [Clerk](https://dashboard.clerk.com) application.

```bash
# 1. Install dependencies
npm install

# 2. Add your keys
cp .env.example .env.local   # then fill in the values

# 3. Start the dev server and scan the QR code with Expo Go
npx expo start
```

### 🔑 Environment variables

| Variable | Where it's used | In the app bundle? |
|---|---|:-:|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | `ClerkProvider` in the app | ✅ |
| `CLERK_SECRET_KEY` | API routes and local scripts only | ❌ |

> [!WARNING]
> Secret keys must never use the `EXPO_PUBLIC_` prefix: anything with it is bundled into the app. Never commit `.env` or `.env.local`.

## 🛠️ Commands

| Command | Purpose |
|---|---|
| `npx expo start` | Dev server (scan the QR code on your phone) |
| `npx expo install <package>` | Add a package at an SDK-compatible version (use instead of `npm install <package>`) |
| `npx tsc --noEmit` | Type check |
| `npx expo lint` | Lint |
| `npx expo export --platform android` | Bundle check |
| `npx expo-doctor` | Diagnose dependency and config issues |

## 🗺️ Project structure

```text
roam/
├── src/
│   ├── app/                  # Expo Router: every file is a screen
│   │   ├── _layout.tsx       # ClerkProvider, fonts, splash
│   │   ├── index.tsx         # Onboarding
│   │   ├── (auth)/           # Sign up, verify, sign in (signed-out only)
│   │   ├── (app)/            # Signed-in screens (home)
│   │   └── design-system.tsx # Dev-only component preview
│   ├── components/
│   │   ├── ui/               # Shared design-system components
│   │   ├── auth/             # Auth screen pieces
│   │   └── onboarding/       # Onboarding pieces
│   ├── lib/auth/             # Validation, Clerk error copy, finish helpers
│   └── theme/                # JS mirror of the design tokens
├── assets/                   # Fonts and brand images
├── global.css                # Design tokens (@theme)
├── prompts/                  # Feature plans, one per feature
└── AGENTS.md                 # Project rules and decisions for AI agents
```

## 🤝 How we work

Each feature starts as a plan in [`prompts/`](prompts/) (from [`TEMPLATE.md`](prompts/TEMPLATE.md)) and is built only after the plan is approved. [`AGENTS.md`](AGENTS.md) holds every decision that is still true: who owns what, rules, design system, and reporting.

All development happens on the `dev` branch. Changes reach `main` through pull requests.

---

<div align="center">
<sub>Built with Expo · Clerk · Sanity</sub>
</div>
