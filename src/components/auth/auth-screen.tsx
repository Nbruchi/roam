import { useCanGoBack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Wordmark } from "@/components/onboarding/brand";
import { IconButton, Text } from "@/components/ui";

/** Shell shared by sign-up, verify and sign-in: header, headline, body, form, footer pinned to the bottom. */
export function AuthScreen({
  title,
  body,
  children,
  footer,
}: {
  title: string;
  body: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      className="bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View className="h-12 flex-row items-center justify-between">
            {canGoBack ? (
              <IconButton icon={ChevronLeft} label="Back" variant="outline" size="nav" onPress={() => router.back()} />
            ) : (
              <View />
            )}
            <Wordmark height={28} />
          </View>
          <Text variant="hero" accessibilityRole="header" className="mt-8">
            {title}
          </Text>
          <Text className="mt-3">{body}</Text>
          <View className="mt-6">{children}</View>
        </View>
        <View className="mt-10">{footer}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
