import type { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

export type Segment<T extends string> = { value: T; label: string; icon?: LucideIcon };

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  className,
}: {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <View
      accessibilityRole="tablist"
      className={cx("h-14 flex-row rounded-full border border-line bg-surface-alt p-1", className)}
    >
      {segments.map((s) => {
        const active = s.value === value;
        return (
          <Pressable
            key={s.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(s.value)}
            className={cx(
              "flex-1 flex-row items-center justify-center gap-2 rounded-full",
              active && "bg-ink",
            )}
          >
            {s.icon && <Icon icon={s.icon} size={20} color={active ? "surface" : "ink"} />}
            <Text variant="button" className={active ? "text-surface" : "text-ink"}>
              {s.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
