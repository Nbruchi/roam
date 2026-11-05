import type { LucideIcon } from "lucide-react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useState, type Ref } from "react";
import { Pressable, TextInput, View, type TextInputInstance, type TextInputProps } from "react-native";

import { colors } from "@/theme";
import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

export function Input({
  ref,
  icon,
  trailing,
  label,
  showLabel = false,
  invalid,
  secureTextEntry,
  className,
  onFocus,
  onBlur,
  ...props
}: TextInputProps & {
  ref?: Ref<TextInputInstance>;
  icon?: LucideIcon;
  /** Pressable content on the right, such as a filter IconButton. */
  trailing?: React.ReactNode;
  /** Accessible name. Shown above the value when `showLabel` is set (two-line field). */
  label: string;
  showLabel?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  const state = invalid
    ? "border-danger bg-danger-soft"
    : focused
      ? "border-lavender bg-lavender-soft"
      : showLabel
        ? "border-transparent bg-surface-alt"
        : "border-line bg-surface-alt";

  const input = (
    <TextInput
      ref={ref}
      accessibilityLabel={label}
      placeholderTextColor={colors.inkMuted}
      secureTextEntry={hidden}
      className={cx("font-jakarta text-body text-ink", !showLabel && "flex-1")}
      // Android adds its own vertical padding to TextInput, which pushed the label out of the field.
      style={showLabel ? { height: 24, paddingVertical: 0, includeFontPadding: false } : undefined}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );

  return (
    <View
      className={cx(
        "flex-row items-center rounded-lg border",
        showLabel ? "h-16 gap-5 px-5" : "h-14 gap-3 px-4",
        state,
        className,
      )}
    >
      {icon && <Icon icon={icon} />}
      {showLabel ? (
        <View className="flex-1 justify-center">
          <Text variant="fieldLabel" importantForAccessibility="no" accessibilityElementsHidden>
            {label}
          </Text>
          {input}
        </View>
      ) : (
        input
      )}
      {secureTextEntry ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? "Show password" : "Hide password"}
          onPress={() => setHidden((h) => !h)}
          hitSlop={8}
        >
          <Icon icon={hidden ? EyeOff : Eye} />
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );
}
