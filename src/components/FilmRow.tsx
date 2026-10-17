import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { formatDuration, formatRating } from "@/lib/format";
import type { Film } from "@/types/film";

import { Poster } from "./Poster";

export function FilmRow({ film }: { film: Film }) {
  return (
    <Link href={{ pathname: "/films/[id]", params: { id: film.id } }} asChild>
      <Pressable
        accessibilityRole="link"
        className="flex-row items-center gap-3 border-b border-border bg-surface px-4 py-3 active:bg-surface-2"
      >
        <Poster film={film} className="w-12" compact />
        <View className="flex-1 gap-0.5">
          <Text className="font-semibold text-base text-ink" numberOfLines={1}>
            {film.title}
          </Text>
          <Text className="font-sans text-sm text-muted" numberOfLines={1}>
            {film.genre} · {film.year} · {formatDuration(film.durationMinutes)}
          </Text>
        </View>
        <Text className="font-mono-medium text-base text-ink">{formatRating(film.rating)}</Text>
      </Pressable>
    </Link>
  );
}
