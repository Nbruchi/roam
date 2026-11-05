import type { LucideIcon } from "lucide-react-native";

import { colors } from "@/theme";

export type IconColor = keyof typeof colors;

/** Lucide icon with design-system defaults: 24px, 1.75 stroke, ink color. */
export function Icon({
  icon: Glyph,
  size = 24,
  color = "ink",
  strokeWidth = 1.75,
  fill,
}: {
  icon: LucideIcon;
  size?: number;
  color?: IconColor;
  strokeWidth?: number;
  fill?: IconColor;
}) {
  return (
    <Glyph
      size={size}
      color={colors[color]}
      strokeWidth={strokeWidth}
      fill={fill ? colors[fill] : "none"}
    />
  );
}
