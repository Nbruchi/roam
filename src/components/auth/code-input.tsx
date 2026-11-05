import { useRef, useState } from "react";
import { Pressable, TextInput, View, type TextInputInstance } from "react-native";

import { Text } from "@/components/ui";
import { cx } from "@/components/ui/cx";

const LENGTH = 6;

/** Six cells over one transparent input, so paste and one-time-code autofill work. */
export function CodeInput({
  value,
  onChange,
  invalid,
  editable = true,
}: {
  value: string;
  onChange: (code: string) => void;
  invalid?: boolean;
  editable?: boolean;
}) {
  const input = useRef<TextInputInstance>(null);
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, LENGTH - 1);

  return (
    <Pressable onPress={() => input.current?.focus()} accessible={false}>
      <View className="flex-row gap-2.5" pointerEvents="none">
        {Array.from({ length: LENGTH }, (_, i) => (
          <View
            key={i}
            className={cx(
              "h-16 flex-1 items-center justify-center rounded-lg border-2",
              invalid
                ? "border-danger bg-danger-soft"
                : focused && i === active
                  ? "border-lavender bg-lavender-soft"
                  : "border-transparent bg-surface-alt",
            )}
          >
            <Text variant="title">{value[i] ?? ""}</Text>
          </View>
        ))}
      </View>
      <TextInput
        ref={input}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, "").slice(0, LENGTH))}
        editable={editable}
        autoFocus
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={LENGTH}
        accessibilityLabel="6-digit code"
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, opacity: 0 }}
      />
    </Pressable>
  );
}
