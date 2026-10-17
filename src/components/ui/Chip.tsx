import { Pressable, Text } from "react-native";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={{ top: 4, bottom: 4 }}
      className={`min-h-9 justify-center rounded-full border px-3.5 ${selected ? "border-accent bg-accent" : "border-border bg-surface"}`}
    >
      <Text className={`font-medium text-sm ${selected ? "text-white" : "text-ink"}`}>{label}</Text>
    </Pressable>
  );
}
