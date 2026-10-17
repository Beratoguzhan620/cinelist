import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { colors } from "@/lib/theme";

import { Button } from "./ui/Button";

type MessageProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StateMessage({ icon: Icon, title, description, actionLabel, onAction }: MessageProps) {
  return (
    <View className="items-center gap-3 px-8 py-16">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-surface-2">
        <Icon size={22} color={colors.muted} strokeWidth={1.75} />
      </View>
      <Text className="text-center font-semibold text-base text-ink">{title}</Text>
      <Text className="max-w-[320px] text-center font-sans text-sm text-muted">{description}</Text>
      {actionLabel && onAction && <Button label={actionLabel} onPress={onAction} variant="secondary" className="mt-1" />}
    </View>
  );
}

export function GridSkeleton({ columns, width }: { columns: number; width: number }) {
  return (
    <View className="flex-row flex-wrap gap-x-3 gap-y-5 px-4 pt-2" accessibilityLabel="Filmler yükleniyor">
      {Array.from({ length: columns * 2 }, (_, index) => (
        <View key={index} style={{ width }} className="gap-2">
          <View className="w-full rounded bg-surface-2" style={{ aspectRatio: 2 / 3 }} />
          <View className="h-3.5 w-3/4 rounded bg-surface-2" />
          <View className="h-3 w-1/2 rounded bg-surface-2" />
        </View>
      ))}
    </View>
  );
}

export function ListSkeleton() {
  return (
    <View accessibilityLabel="Filmler yükleniyor">
      {Array.from({ length: 6 }, (_, index) => (
        <View key={index} className="flex-row items-center gap-3 border-b border-border bg-surface px-4 py-3">
          <View className="w-12 rounded bg-surface-2" style={{ aspectRatio: 2 / 3 }} />
          <View className="flex-1 gap-2">
            <View className="h-4 w-2/3 rounded bg-surface-2" />
            <View className="h-3 w-1/3 rounded bg-surface-2" />
          </View>
        </View>
      ))}
    </View>
  );
}
