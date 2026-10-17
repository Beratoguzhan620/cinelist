import { CircleAlert, CircleCheck } from "lucide-react-native";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Tone = "success" | "error";
type ToastState = { id: number; message: string; tone: Tone };
type ShowToast = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ShowToast>(() => {});

export function useToast(): ShowToast {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const show = useCallback<ShowToast>((message, tone = "success") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [toast]);

  const value = useMemo(() => show, [show]);
  const Icon = toast?.tone === "error" ? CircleAlert : CircleCheck;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <View
          pointerEvents="none"
          className="absolute left-4 right-4 items-center sm:left-auto sm:items-end"
          style={{ bottom: insets.bottom + 16 }}
        >
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            className="max-w-[420px] flex-row items-center gap-2.5 rounded bg-primary px-4 py-3"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
          >
            <Icon size={18} color={toast.tone === "error" ? "#F2B8B0" : "#A9D8BC"} strokeWidth={1.75} />
            <Text className="font-medium text-sm text-white">{toast.message}</Text>
          </View>
        </View>
      )}
    </ToastContext.Provider>
  );
}
