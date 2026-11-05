import { useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

export const SHEET_CURVE_HEIGHT = 64;

/** The sheet's curved top edge: high at the left, sweeping down into a wide corner on the right. */
export function SheetCurve() {
  const { width: w } = useWindowDimensions();
  const h = SHEET_CURVE_HEIGHT;
  const d = [
    `M0 ${h}`,
    "L0 28",
    "Q0 2 28 1",
    `C${w * 0.45} -2 ${w * 0.72} 6 ${w - 44} 30`,
    `Q${w} 50 ${w} ${h}`,
    "Z",
  ].join(" ");
  return (
    <Svg width={w} height={h} style={{ position: "absolute", top: 0 }}>
      <Path d={d} fill={colors.surface} />
    </Svg>
  );
}
