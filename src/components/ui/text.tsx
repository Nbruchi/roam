import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { cx } from "./cx";

const variants = {
  hero: "font-jakarta-bold text-hero text-ink",
  lead: "font-jakarta-medium text-body text-ink-muted",
  display: "font-jakarta-bold text-display text-ink",
  heading: "font-jakarta-bold text-heading text-ink",
  title: "font-jakarta-bold text-title text-ink",
  body: "font-jakarta text-body text-ink-muted",
  label: "font-jakarta-semibold text-body text-ink",
  caption: "font-jakarta-medium text-caption text-ink-muted",
  button: "font-jakarta-semibold text-button text-ink",
  link: "font-jakarta-semibold text-body text-ink underline",
  fieldLabel: "font-jakarta-medium text-field-label text-ink",
} as const;

export type TextVariant = keyof typeof variants;

export function Text({
  variant = "body",
  className,
  ...props
}: RNTextProps & { variant?: TextVariant; className?: string }) {
  return <RNText className={cx(variants[variant], className)} {...props} />;
}
