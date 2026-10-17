import { FlatList, Pressable, Text, View } from "react-native";

import { FilmRow } from "@/components/FilmRow";
import { API_URL } from "@/lib/config";
import { useGetFilmsQuery } from "@/store/filmsApi";

export default function FilmsScreen() {
  const { data: films, isLoading, isError, refetch } = useGetFilmsQuery();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Text className="font-sans text-sm text-muted">Filmler yükleniyor…</Text>
      </View>
    );
  }

  if (isError || !films) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-bg px-8">
        <Text className="font-semibold text-base text-ink">Sunucuya ulaşılamadı</Text>
        <Text className="text-center font-sans text-sm text-muted">
          json-server çalışıyor mu? Beklenen adres: {API_URL}
        </Text>
        <Pressable
          onPress={refetch}
          accessibilityRole="button"
          className="min-h-11 justify-center rounded bg-primary px-4"
        >
          <Text className="font-medium text-sm text-white">Tekrar dene</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={films}
      keyExtractor={(film) => film.id}
      renderItem={({ item }) => <FilmRow film={item} />}
      ListHeaderComponent={
        <View className="px-4 pb-3 pt-2">
          <Text className="font-semibold text-xl text-ink">Filmler</Text>
          <Text className="font-sans text-sm text-muted">{films.length} film arşivde</Text>
        </View>
      }
      className="flex-1 bg-bg"
    />
  );
}
