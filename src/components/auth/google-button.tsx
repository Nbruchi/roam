import { useSSO } from "@clerk/expo/experimental";
import { useState } from "react";

import { GoogleG } from "@/components/onboarding/google-g";
import { Button } from "@/components/ui";
import { authErrorMessage } from "@/lib/auth/errors";

/**
 * Google through Clerk's browser SSO flow (works in Expo Go). The Core 3 `useSSO` activates the
 * session itself. Calls onSuccess once signed in, or onError with a guest-facing message.
 * Closing the browser is not an error.
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
          const { createdSessionId, authSessionResult } = await startSSOFlow({ strategy: "oauth_google" });
          if (createdSessionId) return onSuccess();
          // Cancelled or dismissed browser: stay put silently. Anything else didn't finish.
          if (authSessionResult?.type === "success") onError(authErrorMessage(null));
        } catch (e) {
          onError(authErrorMessage(e));
        } finally {
          setLoading(false);
        }
      }}
    />
  );
}
