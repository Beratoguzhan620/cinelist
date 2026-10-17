import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "./ui/Button";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
};

export function ConfirmDialog({ visible, title, message, confirmLabel, onConfirm, onCancel, busy }: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          onPress={onCancel}
          accessibilityLabel="Kapat"
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(26, 26, 26, 0.45)" }}
        />
        <View accessibilityRole="alert" className="w-full max-w-[400px] gap-4 rounded-card border border-border bg-surface p-6">
          <View className="gap-1.5">
            <Text className="font-semibold text-lg text-ink">{title}</Text>
            <Text className="font-sans text-sm text-muted">{message}</Text>
          </View>
          <View className="flex-row justify-end gap-2">
            <Button label="Vazgeç" variant="secondary" onPress={onCancel} disabled={busy} />
            <Button label={confirmLabel} variant="danger" onPress={onConfirm} loading={busy} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
