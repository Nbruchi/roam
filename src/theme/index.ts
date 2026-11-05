// JS mirror of the tokens in global.css @theme. Use only where a class can't reach
// (icon `color`, glass tint, animation). Keep values in sync with global.css.
export const colors = {
  primary: "#FFC629",
  lavender: "#C9B4FF",
  ink: "#0B0B1A",
  inkMuted: "#6B7280",
  surface: "#FFFFFF",
  surfaceAlt: "#F4F5F7",
  line: "#E5E7EB",
  glass: "rgba(255, 255, 255, 0.7)",
  lavenderSoft: "#F1ECFF",
  success: "#16A34A",
  danger: "#E5484D",
  info: "#3B5BDB",
  scrim: "rgba(0, 0, 0, 0.45)",
  white: "#FFFFFF",
} as const;

export const fonts = {
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  semibold: "PlusJakartaSans-SemiBold",
  bold: "PlusJakartaSans-Bold",
} as const;

export const shadows = {
  card: "0 1px 2px rgba(0, 0, 0, 0.05)",
  raised: "0 4px 12px rgba(0, 0, 0, 0.1)",
} as const;

export const motion = { fast: 150, base: 250, slow: 400 } as const;
