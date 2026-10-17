import { Clapperboard } from "lucide-react-native";
import { useState } from "react";
import { Image, Text, View } from "react-native";

import { resolvePosterUrl } from "@/lib/config";
import { colors } from "@/lib/theme";
import type { Film } from "@/types/film";

type PosterProps = {
  film: Pick<Film, "title" | "posterUrl">;
  className?: string;
  compact?: boolean;
};

export function Poster({ film, className, compact }: PosterProps) {
  const uri = resolvePosterUrl(film.posterUrl);
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View
        className={`items-center justify-center gap-2 overflow-hidden rounded bg-surface-2 p-2 ${className ?? ""}`}
        style={{ aspectRatio: 2 / 3 }}
        accessibilityLabel={`${film.title} afişi yok`}
      >
        <Clapperboard size={compact ? 18 : 28} color={colors.muted} strokeWidth={1.5} />
        {!compact && (
          <Text className="text-center font-medium text-xs text-muted" numberOfLines={3}>
            {film.title}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      onError={() => setFailed(true)}
      accessibilityLabel={`${film.title} afişi`}
      className={`rounded bg-surface-2 ${className ?? ""}`}
      style={{ aspectRatio: 2 / 3 }}
      resizeMode="cover"
    />
  );
}
