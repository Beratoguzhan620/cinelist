import { ArrowDownUp, Check } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { SORT_OPTIONS } from "@/lib/films";
import { colors } from "@/lib/theme";
import type { SortOrder } from "@/store/preferencesSlice";

type SortMenuProps = {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
};

export function SortMenu({ value, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Sıralama: ${current.label}`}
        className="min-h-11 flex-row items-center gap-2 rounded border border-border bg-surface px-3"
      >
        <ArrowDownUp size={16} color={colors.muted} strokeWidth={1.75} />
        <Text className="font-medium text-sm text-ink" numberOfLines={1}>
          {current.label}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 items-center justify-end px-4 pb-8 sm:justify-center">
          <Pressable
            onPress={() => setOpen(false)}
            accessibilityLabel="Kapat"
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(26, 26, 26, 0.45)" }}
          />
          <View className="w-full max-w-[400px] overflow-hidden rounded-card border border-border bg-surface">
            <Text className="border-b border-border px-4 py-3 font-semibold text-base text-ink">Sırala</Text>
            {SORT_OPTIONS.map((option) => {
              const selected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  className="min-h-12 flex-row items-center justify-between px-4 active:bg-surface-2"
                >
                  <Text className={`text-sm ${selected ? "font-semibold text-ink" : "font-sans text-ink"}`}>
                    {option.label}
                  </Text>
                  {selected && <Check size={18} color={colors.accent} strokeWidth={2} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}
