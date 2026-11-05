import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";

import { cx } from "./cx";
import { Icon, type IconColor } from "./icon";

const sizes = { sm: "size-10", nav: "size-12", md: "size-14" } as const;
const iconSizes = { sm: 20, nav: 22, md: 24 } as const;
const variants = { filled: "bg-surface-alt", outline: "bg-surface" } as const;

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "filled",
  bordered = true,
  iconColor = "ink",
  fill,
  className,
  ...props
}: Omit<PressableProps, "children"> & {
  icon: LucideIcon;
  /** Required: icon-only controls need an accessible name. */
  label: string;
  size?: keyof typeof sizes;
  /** outline: white fill with a hairline border (auth back button). */
  variant?: keyof typeof variants;
  bordered?: boolean;
  iconColor?: IconColor;
  fill?: IconColor;
  className?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className={cx(
        "items-center justify-center rounded-full active:opacity-70",
        variants[variant],
        bordered && "border border-line",
        sizes[size],
        className,
      )}
      {...props}
    >
      <Icon icon={icon} size={iconSizes[size]} color={iconColor} fill={fill} />
    </Pressable>
  );
}
