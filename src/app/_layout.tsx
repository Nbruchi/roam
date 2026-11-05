import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import "../../global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { fonts } from "@/theme";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.local.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.");
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Font files live in assets/fonts; the keys (fonts.*) must match the family names in global.css.
  const [loaded, error] = useFonts({
    [fonts.regular]: require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    [fonts.medium]: require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    [fonts.semibold]: require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    [fonts.bold]: require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  useEffect(() => {
    if (error) console.warn("Plus Jakarta Sans failed to load; falling back to the system font.", error);
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}