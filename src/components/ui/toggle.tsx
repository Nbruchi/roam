import { Minus, Plus } from "lucide-react-native";
import { Switch, View } from "react-native";

import { colors } from "@/theme";
import { IconButton } from "./icon-button";
import { Text } from "./text";

export function Toggle({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <Switch
      accessibilityLabel={label}
      value={value}
      onValueChange={onValueChange}
      trackColor={{ true: colors.primary, false: colors.line }}
      thumbColor={colors.surface}
    />
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ now: value, min, max }}
      className="h-14 flex-row items-center self-start rounded-full border border-line bg-surface px-1"
    >
      <IconButton
        icon={Minus}
        label={`Decrease ${label}`}
        size="sm"
        bordered={false}
        className="bg-transparent"
        disabled={value <= min}
        onPress={() => onChange(value - 1)}
      />
      <Text variant="label" className="w-10 text-center">
        {value}
      </Text>
      <IconButton
        icon={Plus}
        label={`Increase ${label}`}
        size="sm"
        bordered={false}
        className="bg-transparent"
        disabled={value >= max}
        onPress={() => onChange(value + 1)}
      />
    </View>
  );
}
