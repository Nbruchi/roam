import { MapPin } from "lucide-react-native";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { Icon, Text } from "@/components/ui";

export function LocationPill({ label, style }: { label: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      className="h-10 flex-row items-center gap-2 self-start rounded-full bg-scrim px-4"
      style={[{ borderWidth: 1, borderColor: "rgba(255,255,255,0.35)" }, style]}
    >
      <Icon icon={MapPin} size={18} color="white" fill="white" />
      <Text variant="caption" className="text-surface">
        {label}
      </Text>
    </View>
  );
}
