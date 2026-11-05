import { useClerk, useUser } from "@clerk/expo";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Alert, Button, Text } from "@/components/ui";
import { authErrorMessage } from "@/lib/auth/errors";

/** Stub home until the real one is built. Signing out sends the (app) guard back to sign in. */
export default function Home() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string>();
  const name = user?.firstName || user?.primaryEmailAddress?.emailAddress;

  const onSignOut = async () => {
    setSigningOut(true);
    setError(undefined);
    try {
      await signOut();
    } catch (e) {
      setError(authErrorMessage(e));
      setSigningOut(false);
    }
  };

  return (
    <View
      className="flex-1 justify-between bg-surface px-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }}
    >
      <View className="gap-3">
        <Text variant="heading">{name ? `Hi, ${name}` : "You're signed in"}</Text>
        <Text>Your stays will show up here.</Text>
      </View>
      <View className="gap-4">
        {error && <Alert variant="error" message={error} />}
        <Button title="Sign out" variant="secondary" loading={signingOut} onPress={onSignOut} />
      </View>
    </View>
  );
}
