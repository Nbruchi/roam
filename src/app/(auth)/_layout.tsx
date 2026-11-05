import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

/** Sign up, verify, sign in. Signed-in guests go straight home. */
export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/home" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
