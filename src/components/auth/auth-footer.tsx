import { Pressable, View } from "react-native";

import { Text } from "@/components/ui";

export function AuthFooter({
  prompt,
  action,
  onPress,
  disabled,
}: {
  prompt: string;
  action: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View className="flex-row flex-wrap items-center justify-center gap-2">
      <Text>{prompt}</Text>
      <Pressable
        accessibilityRole="link"
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPress={onPress}
        hitSlop={8}
        className="active:opacity-60"
      >
        {disabled ? <Text>{action}</Text> : <Text variant="link">{action}</Text>}
      </Pressable>
    </View>
  );
}
