import type { LucideIcon } from "lucide-react-native";
import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

/** Tappable row with a lavender icon tile: policy entry points and summaries. */
export function PolicyCard({
  icon,
  title,
  description,
  onPress,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress?: () => void;
  className?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      onPress={onPress}
      className={cx(
        "flex-row items-center gap-4 rounded-xl bg-lavender-soft p-4 active:opacity-80",
        className,
      )}
    >
      <View className="size-14 items-center justify-center rounded-lg bg-lavender/40">
        <Icon icon={icon} color="ink" />
      </View>
      <View className="flex-1 gap-1">
        <Text variant="label">{title}</Text>
        <Text variant="caption">{description}</Text>
      </View>
      <Icon icon={ChevronRight} size={20} color="info" />
    </Pressable>
  );
}
