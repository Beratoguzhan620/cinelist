import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { CalendarDays, Clock3, CloudOff, Pencil, Tag, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Poster } from "@/components/Poster";
import { StateMessage } from "@/components/StateViews";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { formatDuration, formatRating } from "@/lib/format";
import { colors } from "@/lib/theme";
import { useDeleteFilmMutation, useGetFilmQuery } from "@/store/filmsApi";

function Fact({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <View className="flex-1 gap-1 px-3 py-3">
      <View className="flex-row items-center gap-1.5">
        <Icon size={14} color={colors.muted} strokeWidth={1.75} />
        <Text className="font-sans text-xs text-muted">{label}</Text>
      </View>
      <Text className="font-medium text-sm text-ink" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default function FilmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const { data: film, isLoading, isError, refetch } = useGetFilmQuery(id);
  const [deleteFilm] = useDeleteFilmMutation();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color={colors.muted} />
      </View>
    );
  }

  if (isError || !film) {
    return (
      <View className="flex-1 bg-bg">
        <Stack.Screen options={{ title: "Film" }} />
        <StateMessage
          icon={CloudOff}
          title="Film bulunamadı"
          description="Bu film silinmiş olabilir ya da sunucuya şu an ulaşılamıyor."
          actionLabel="Tekrar dene"
          onAction={refetch}
        />
      </View>
    );
  }

  const remove = async () => {
    setConfirming(false);
    // The list drops the film right away; if the request fails the film comes back.
    const request = deleteFilm(film.id).unwrap();
    if (router.canGoBack()) router.back();
    else router.replace("/");
    try {
      await request;
      toast(`"${film.title}" silindi.`);
    } catch {
      toast("Film silinemedi, listeye geri eklendi.", "error");
    }
  };

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="items-center px-4 pb-10 pt-2">
      <Stack.Screen options={{ title: film.title }} />
      <View className="w-full max-w-[720px] gap-6 sm:flex-row sm:items-start">
        <Poster film={film} className="w-40 self-center sm:w-56 sm:self-start" />

        <View className="flex-1 gap-5">
          <View className="gap-2">
            <Text className="font-semibold text-2xl text-ink">{film.title}</Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="font-mono-medium text-xl text-ink">{formatRating(film.rating)}</Text>
              <Text className="font-sans text-sm text-muted">/ 10 puan</Text>
            </View>
          </View>

          <View className="flex-row rounded-card border border-border bg-surface">
            <Fact icon={CalendarDays} label="Yıl" value={String(film.year)} />
            <View className="w-px bg-border" />
            <Fact icon={Clock3} label="Süre" value={formatDuration(film.durationMinutes)} />
            <View className="w-px bg-border" />
            <Fact icon={Tag} label="Tür" value={film.genre} />
          </View>

          <View className="gap-1.5">
            <Text className="font-semibold text-base text-ink">Özet</Text>
            <Text className="font-sans text-base text-ink">{film.description}</Text>
          </View>

          <View className="flex-row gap-2 border-t border-border pt-5">
            <Button
              label="Düzenle"
              icon={Pencil}
              variant="secondary"
              className="flex-1 sm:flex-none"
              onPress={() => router.push({ pathname: "/films/[id]/edit", params: { id: film.id } })}
            />
            <Button
              label="Sil"
              icon={Trash2}
              variant="secondary"
              className="flex-1 sm:flex-none"
              onPress={() => setConfirming(true)}
            />
          </View>
        </View>
      </View>

      <ConfirmDialog
        visible={confirming}
        title="Film silinsin mi?"
        message={`"${film.title}" arşivden kalıcı olarak silinecek.`}
        confirmLabel="Sil"
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </ScrollView>
  );
}
