import Svg, { Path } from "react-native-svg";

import type { IconColor } from "@/components/ui/icon";
import { colors } from "@/theme";

import { WORDMARK_ASPECT, WORDMARK_PATH, WORDMARK_VIEWBOX } from "./wordmark-path";

/** "roam" wordmark: Plus Jakarta Sans ExtraBold outlines (also at assets/images/roam-wordmark.svg). */
export function Wordmark({ height = 44, color = "ink" }: { height?: number; color?: IconColor }) {
  return (
    <Svg
      width={height * WORDMARK_ASPECT}
      height={height}
      viewBox={WORDMARK_VIEWBOX}
      accessibilityRole="header"
      accessibilityLabel="roam"
    >
      <Path d={WORDMARK_PATH} fill={colors[color]} />
    </Svg>
  );
}
