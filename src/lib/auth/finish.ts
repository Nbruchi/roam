import type { SetActiveNavigate } from "@clerk/expo/types";
import type { useRouter } from "expo-router";

type Router = ReturnType<typeof useRouter>;

/** Leave the auth flow for home so Back can't return to the forms. */
export function finishAuth(router: Router) {
  if (router.canDismiss()) router.dismissAll();
  router.replace("/home");
}

/**
 * `navigate` for `signIn.finalize()` / `signUp.finalize()`. No session tasks are configured,
 * so a pending task is reported through onTask instead of navigating.
 */
export function afterFinalize(router: Router, onTask: () => void): SetActiveNavigate {
  return async ({ session }) => {
    if (session?.currentTask) return onTask();
    finishAuth(router);
  };
}
