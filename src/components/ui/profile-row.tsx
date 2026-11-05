import type { LucideIcon } from "lucide-react-native";
import { ChevronRight } from "lucide-react-native";
import { Children } from "react";
import { Pressable, View } from "react-native";

import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

export function ProfileRow({
  icon,
  title,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-4 px-4 active:bg-surface-alt"
    >
      <Icon icon={icon} />
      <Text variant="label" className="flex-1 text-body">
        {title}
      </Text>
      <Icon icon={ChevronRight} size={20} />
    </Pressable>
  );
}

/** Groups rows with hairline dividers instead of a card per row. */
export function ProfileGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const rows = Children.toArray(children);
  return (
    <View className={cx("overflow-hidden rounded-xl bg-surface", className)}>
      {rows.map((row, i) => (
        <View key={i} className={i > 0 ? "border-t border-line" : undefined}>
          {row}
        </View>
      ))}
    </View>
  );
}
