/** Join class names, skipping falsy values. Caller classes go last so they win. */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
