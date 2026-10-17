import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { formatRating } from "@/lib/format";
import type { Film } from "@/types/film";

import { Poster } from "./Poster";

export function FilmCard({ film, width }: { film: Film; width: number }) {
  return (
    <Link href={{ pathname: "/films/[id]", params: { id: film.id } }} asChild>
      <Pressable style={{ width }} className="gap-2 active:opacity-80" accessibilityRole="link">
        <Poster film={film} className="w-full" />
        <View className="gap-0.5">
          <Text className="font-semibold text-sm text-ink" numberOfLines={1}>
            {film.title}
          </Text>
          <View className="flex-row items-center justify-between gap-2">
            <Text className="flex-1 font-sans text-xs text-muted" numberOfLines={1}>
              {film.year} · {film.genre}
            </Text>
            <Text className="font-mono-medium text-xs text-ink">{formatRating(film.rating)}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
