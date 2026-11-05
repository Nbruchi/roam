import { View } from "react-native";

import { Text } from "@/components/ui";
import { cx } from "@/components/ui/cx";

export function OrDivider({ className }: { className?: string }) {
  return (
    <View className={cx("flex-row items-center gap-5", className)}>
      <View className="h-px flex-1 bg-line" />
      <Text variant="caption">or</Text>
      <View className="h-px flex-1 bg-line" />
    </View>
  );
}
