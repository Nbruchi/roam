import type { LucideIcon } from "lucide-react-native";
import { ActivityIndicator, Pressable, View, type PressableProps } from "react-native";

import { colors } from "@/theme";
import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

const variants = {
  primary: "bg-primary border-primary active:opacity-80",
  secondary: "bg-surface border-line active:bg-surface-alt",
} as const;

export function Button({
  title,
  variant = "primary",
  leading,
  leadingNode,
  trailingIcon,
  loading,
  disabled,
  className,
  ...props
}: Omit<PressableProps, "children"> & {
  title: string;
  variant?: keyof typeof variants;
  leading?: LucideIcon;
  /** Custom leading content, e.g. a brand logo. */
  leadingNode?: React.ReactNode;
  trailingIcon?: LucideIcon;
  loading?: boolean;
  className?: string;
}) {
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      disabled={off}
      className={cx(
        "h-14 flex-row items-center justify-center gap-3 rounded-full border px-6",
        variants[variant],
        off && "opacity-50",
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <>
          {leadingNode ?? (leading && <Icon icon={leading} />)}
          <Text variant="button">{title}</Text>
          {trailingIcon && (
            <View className="absolute right-6">
              <Icon icon={trailingIcon} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
