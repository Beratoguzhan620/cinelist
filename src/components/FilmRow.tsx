import { Image, Text, View } from "react-native";

import { resolvePosterUrl } from "@/lib/config";
import type { Film } from "@/types/film";

export function FilmRow({ film }: { film: Film }) {
  const poster = resolvePosterUrl(film.posterUrl);

  return (
    <View className="flex-row items-center gap-3 border-b border-border bg-surface px-4 py-3">
      {poster ? (
        <Image source={{ uri: poster }} className="h-[72px] w-12 rounded bg-surface-2" accessibilityIgnoresInvertColors />
      ) : (
        <View className="h-[72px] w-12 rounded bg-surface-2" />
      )}
      <View className="flex-1">
        <Text className="font-semibold text-base text-ink" numberOfLines={1}>
          {film.title}
        </Text>
        <Text className="font-sans text-sm text-muted">
          {film.genre} · {film.year} · {film.durationMinutes} dk
        </Text>
      </View>
      <Text className="font-mono-medium text-base text-ink">{film.rating.toFixed(1)}</Text>
    </View>
  );
}
