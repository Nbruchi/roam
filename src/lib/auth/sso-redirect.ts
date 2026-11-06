import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";

const PATH = "sso-callback";

/**
 * Where the browser sends the guest back after Google. Every URL must be allowlisted in Clerk
 * (Native applications → Allowlist for mobile SSO redirect).
 *
 * In development the app is loaded from the dev server (`hostUri`, e.g. `192.168.1.65:8081`), so
 * Expo Go is reached at `exp://<hostUri>/--/sso-callback`. We build that ourselves because Expo Go on
 * SDK 58 reports `executionEnvironment: "bare"`, which makes `makeRedirectUri()` return the app
 * scheme (`roam://`) that Expo Go doesn't handle, and the browser hangs. Release builds have no
 * dev server and use `roam://sso-callback`.
 */
export function ssoRedirectUrl() {
  const hostUri = Constants.expoConfig?.hostUri;
  if (__DEV__ && hostUri) return `exp://${hostUri}/--/${PATH}`;
  return makeRedirectUri({ path: PATH });
}
