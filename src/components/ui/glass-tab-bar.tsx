import type { LucideIcon } from "lucide-react-native";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { Pressable, View } from "react-native";

import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

export type TabItem<T extends string> = { key: T; label: string; icon: LucideIcon };

/** Presentational liquid-glass tab bar. Wiring to Expo Router tabs is a later feature. */
export function GlassTabBar<T extends string>({
  items,
  active,
  onChange,
  className,
}: {
  items: TabItem<T>[];
  active: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  const glass = isGlassEffectAPIAvailable();
  const Container = glass ? GlassView : View;
  return (
    <Container
      {...(glass ? { glassEffectStyle: "regular" as const } : {})}
      className={cx(
        "h-20 flex-row items-center justify-between rounded-full border border-line px-3",
        !glass && "bg-glass",
        className,
      )}
    >
      {items.map((item) => {
        const on = item.key === active;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: on }}
            onPress={() => onChange(item.key)}
            className={cx(
              "size-16 items-center justify-center gap-1 rounded-full",
              on && "bg-primary",
              !on && "mx-2",
            )}
          >
            <Icon icon={item.icon} size={24} />
            <Text variant="caption" className="text-ink text-[12px]">
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </Container>
  );
}
