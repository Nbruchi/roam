import { CircleAlert, CircleCheck, X } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { cx } from "./cx";
import { Icon } from "./icon";
import { Text } from "./text";

const variants = {
  success: { box: "bg-success-soft", icon: CircleCheck, color: "success" },
  error: { box: "bg-danger-soft", icon: CircleAlert, color: "danger" },
} as const;

export function Alert({
  message,
  variant = "success",
  onDismiss,
  className,
}: {
  message: string;
  variant?: keyof typeof variants;
  onDismiss?: () => void;
  className?: string;
}) {
  const v = variants[variant];
  return (
    <View
      accessibilityRole="alert"
      className={cx("min-h-14 flex-row items-center gap-3 rounded-lg px-4 py-3", v.box, className)}
    >
      <Icon icon={v.icon} color={v.color} />
      <Text variant="body" className="flex-1 text-ink">
        {message}
      </Text>
      {onDismiss && (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onDismiss} hitSlop={8}>
          <Icon icon={X} size={20} />
        </Pressable>
      )}
    </View>
  );
}
