import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

/** Signed-in screens. Signed-out guests go to sign in; nothing renders until Clerk restores the session. */
export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
