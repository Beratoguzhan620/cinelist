import { Text, TextInput, View, type TextInputProps } from "react-native";

import { colors } from "@/lib/theme";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  help?: string;
};

export function TextField({ label, error, help, multiline, ...input }: TextFieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="font-medium text-sm text-ink">{label}</Text>
      <TextInput
        multiline={multiline}
        placeholderTextColor={colors.muted}
        aria-invalid={error ? true : undefined}
        accessibilityLabel={label}
        className={`min-h-11 rounded border bg-surface px-3 font-sans text-base text-ink ${multiline ? "min-h-[120px] py-2.5" : "py-2"} ${error ? "border-danger" : "border-border"}`}
        style={multiline ? { textAlignVertical: "top" } : undefined}
        {...input}
      />
      {error ? (
        <Text className="font-sans text-xs text-danger">{error}</Text>
      ) : help ? (
        <Text className="font-sans text-xs text-muted">{help}</Text>
      ) : null}
    </View>
  );
}
