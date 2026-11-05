import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

const variants = {
  highlight: { box: "bg-highlight-soft", text: "text-ink" },
  success: { box: "bg-success-soft", text: "text-success" },
  danger: { box: "bg-danger-soft", text: "text-danger" },
  info: { box: "bg-info-soft", text: "text-info" },
  /** Neutral amenity pill on listing cards. */
  neutral: { box: "bg-surface-alt", text: "text-ink" },
} as const;

export function Tag({
  title,
  variant = "neutral",
  icon,
  className,
}: {
  title: string;
  variant?: keyof typeof variants;
  icon?: LucideIcon;
  className?: string;
}) {
  const v = variants[variant];
  return (
    <View
      className={cx("h-9 flex-row items-center gap-2 self-start rounded-full px-4", v.box, className)}
    >
      {icon && <Icon icon={icon} size={16} fill={variant === "highlight" ? "primary" : undefined} />}
      <Text variant="caption" className={v.text}>
        {title}
      </Text>
    </View>
  );
}
