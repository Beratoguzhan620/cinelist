import type { LucideIcon } from "lucide-react-native";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { colors } from "@/lib/theme";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const containers: Record<Variant, string> = {
  primary: "bg-primary border-primary",
  secondary: "bg-surface border-border",
  danger: "bg-danger border-danger",
  ghost: "bg-transparent border-transparent",
};

const labels: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-ink",
  danger: "text-white",
  ghost: "text-ink",
};

const iconColors: Record<Variant, string> = {
  primary: "#FFFFFF",
  secondary: colors.ink,
  danger: "#FFFFFF",
  ghost: colors.ink,
};

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({ label, onPress, variant = "primary", icon: Icon, loading, disabled, className }: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      className={`min-h-11 flex-row items-center justify-center gap-2 rounded border px-4 active:opacity-80 ${containers[variant]} ${inactive ? "opacity-60" : ""} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColors[variant]} />
      ) : (
        Icon && <Icon size={18} color={iconColors[variant]} strokeWidth={1.75} />
      )}
      <Text className={`font-medium text-sm ${labels[variant]}`}>{label}</Text>
    </Pressable>
  );
}

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  active?: boolean;
};

export function IconButton({ icon: Icon, label, onPress, active }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={4}
      className={`h-11 w-11 items-center justify-center rounded border ${active ? "border-primary bg-primary" : "border-border bg-surface"}`}
    >
      <Icon size={18} color={active ? "#FFFFFF" : colors.ink} strokeWidth={1.75} />
    </Pressable>
  );
}
