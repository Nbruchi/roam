import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Wordmark } from "@/components/onboarding/brand";
import { GoogleG } from "@/components/onboarding/google-g";
import { LocationPill } from "@/components/onboarding/location-pill";
import { PageDots } from "@/components/onboarding/page-dots";
import { SheetCurve } from "@/components/onboarding/sheet-curve";
import { slides } from "@/components/onboarding/slides";
import { Button, Text } from "@/components/ui";
import { motion } from "@/theme";

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(0);
  const { isLoaded, isSignedIn } = useAuth();
  const slide = slides[index];

  // A restored session skips onboarding.
  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/home" />;

  const onPageChange = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Photos page; the header and sheet stay fixed on top. */}
      <ScrollView
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onPageChange}
      >
        {slides.map((s) => (
          <View key={s.location} style={{ width, height }} className="bg-surface-alt">
            <Image
              source={{ uri: s.image }}
              contentFit="cover"
              transition={motion.base}
              accessibilityIgnoresInvertColors
              style={StyleSheet.absoluteFill}
            />
            {sheetHeight > 0 && (
              <LocationPill label={s.location} style={{ position: "absolute", left: 24, bottom: sheetHeight + 20 }} />
            )}
          </View>
        ))}
      </ScrollView>

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 flex-row items-center justify-between px-6"
        style={{ top: insets.top + 16 }}
      >
        <Wordmark />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip"
          onPress={() => router.push("/sign-in")}
          className="h-10 justify-center rounded-full bg-glass px-4 active:opacity-70"
        >
          <Text variant="caption" className="text-ink">
            Skip
          </Text>
        </Pressable>
      </View>

      <View className="absolute inset-x-0 bottom-0" onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}>
        <SheetCurve />
        <View className="absolute inset-x-0 bottom-0 bg-surface" style={{ top: 63 }} />
        <View className="px-6 pb-6 pt-7" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <View className="px-1.5">
            <PageDots count={slides.length} index={index} />
          </View>
          <Animated.View key={slide.location} entering={FadeIn.duration(motion.base)} className="px-1.5">
            <Text variant="hero" accessibilityRole="header" className="mt-6">
              {slide.title}
            </Text>
            <Text variant="lead" className="mt-3 min-h-[72px]">{slide.body}</Text>
          </Animated.View>
          <View className="mt-4 gap-3">
            <Button title="Get started" trailingIcon={ArrowRight} onPress={() => router.push("/sign-up")} />
            <Button
              title="Continue with Google"
              variant="secondary"
              leadingNode={<GoogleG />}
              onPress={() => router.push("/sign-in")}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
