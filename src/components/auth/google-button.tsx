import { useSSO } from "@clerk/expo";
import { useState } from "react";

import { GoogleG } from "@/components/onboarding/google-g";
import { Button } from "@/components/ui";
import { authErrorMessage, logAuthIssue } from "@/lib/auth/errors";
import { ssoRedirectUrl } from "@/lib/auth/sso-redirect";

/**
 * Google through Clerk's browser SSO flow (stable `useSSO`, as in the airbnb-clone), returning to
 * the URL from `ssoRedirectUrl()`. Calls onSuccess once signed in, or onError with a guest-facing
 * message. Closing the browser is not an error.
 */
export function GoogleButton({
  onSuccess,
  onError,
  disabled,
  className,
}: {
  onSuccess: () => void;
  onError: (message: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);
  return (
    <Button
      title="Continue with Google"
      variant="secondary"
      leadingNode={<GoogleG />}
      loading={loading}
      disabled={disabled}
      className={className}
      onPress={async () => {
        setLoading(true);
        try {
          const redirectUrl = ssoRedirectUrl();
          logAuthIssue("google: starting", { redirectUrl });
          const { createdSessionId, setActive, signUp, authSessionResult } = await startSSOFlow({
            strategy: "oauth_google",
            redirectUrl,
          });
          logAuthIssue("google: browser closed", {
            type: authSessionResult?.type ?? "no session",
            createdSessionId: !!createdSessionId,
          });
          if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });
            return onSuccess();
          }
          if (signUp?.status === "missing_requirements") {
            logAuthIssue("google: sign-up missing fields", { missingFields: signUp.missingFields });
            onError("We couldn't finish setting up your account. Try signing up with email.");
          }
          // Otherwise the guest closed the browser, which isn't an error.
        } catch (e) {
          onError(authErrorMessage(e, "google: startSSOFlow()"));
        } finally {
          setLoading(false);
        }
      }}
    />
  );
}
