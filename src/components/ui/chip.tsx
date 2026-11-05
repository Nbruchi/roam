import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";

import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

const variants = {
  /** Text filter (Cabins, Under $300). */
  filter: {
    on: "bg-lavender border-lavender",
    off: "bg-surface-alt border-line",
  },
  /** Category with icon (All Stays, Beach). */
  category: {
    on: "bg-primary border-primary",
    off: "bg-surface-alt border-line",
  },
} as const;

export function Chip({
  title,
  selected,
  variant = "filter",
  icon,
  className,
  ...props
}: Omit<PressableProps, "children"> & {
  title: string;
  selected?: boolean;
  variant?: keyof typeof variants;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      className={cx(
        "h-11 flex-row items-center gap-2 self-start rounded-full border px-5 active:opacity-70",
        variants[variant][selected ? "on" : "off"],
        icon && "px-4",
        className,
      )}
      {...props}
    >
      {icon && <Icon icon={icon} size={20} fill={selected ? "ink" : undefined} />}
      <Text variant="button" className={cx("text-body", selected ? "font-jakarta-bold" : "font-jakarta")}>
        {title}
      </Text>
    </Pressable>
  );
}
