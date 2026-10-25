import { Stack, useRouter } from "expo-router";
import { CloudOff, Film as FilmIcon, LayoutGrid, List, Plus, RefreshCw, Search, SearchX, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { FilmCard } from "@/components/FilmCard";
import { FilmRow } from "@/components/FilmRow";
import { GridSkeleton, ListSkeleton, StateMessage } from "@/components/StateViews";
import { SortMenu } from "@/components/SortMenu";
import { IconButton } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { API_URL, DEMO } from "@/lib/config";
import { filterFilms, genresInUse, sortFilms } from "@/lib/films";
import { colors } from "@/lib/theme";
import { useGetFilmsQuery } from "@/store/filmsApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSortOrder, setViewMode } from "@/store/preferencesSlice";
import type { Genre } from "@/types/film";

const MAX_WIDTH = 1200;
const GAP = 12;
const SIDE = 16;

function columnsFor(width: number): number {
  if (width >= 1100) return 6;
  if (width >= 900) return 5;
  if (width >= 768) return 4;
  if (width >= 520) return 3;
  return 2;
}

export default function FilmsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { viewMode, sortOrder } = useAppSelector((state) => state.preferences);
  const { data: films, isLoading, isError, refetch } = useGetFilmsQuery();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<Genre | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = Math.min(windowWidth, MAX_WIDTH);
  const columns = columnsFor(contentWidth);
  const cardWidth = Math.floor((contentWidth - SIDE * 2 - GAP * (columns - 1)) / columns);

  const genres = useMemo(() => genresInUse(films ?? []), [films]);
  const visible = useMemo(
    () => sortFilms(filterFilms(films ?? [], { query, genre }), sortOrder),
    [films, query, genre, sortOrder],
  );
  const filtered = query.trim() !== "" || genre !== null;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setQuery("");
    setGenre(null);
  };

  const header = (
    <View className="gap-3 pb-4 pt-2">
      <View className="flex-row items-end justify-between gap-3 px-4">
        <View className="flex-1">
          <Text className="font-semibold text-xl text-ink">Filmler</Text>
          <Text className="font-sans text-sm text-muted">
            {films ? (filtered ? `${films.length} filmden ${visible.length} tanesi` : `${films.length} film`) : " "}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <SortMenu value={sortOrder} onChange={(value) => dispatch(setSortOrder(value))} />
          {Platform.OS === "web" && <IconButton icon={RefreshCw} label="Listeyi yenile" onPress={onRefresh} />}
        </View>
      </View>

      <View className="flex-row items-center gap-2 px-4">
        <View className="min-h-11 flex-1 flex-row items-center gap-2 rounded border border-border bg-surface px-3">
          <Search size={18} color={colors.muted} strokeWidth={1.75} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Film adı ara"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Film adı ara"
            returnKeyType="search"
            autoCorrect={false}
            className="flex-1 py-2 font-sans text-base text-ink"
          />
          {query !== "" && (
            <Pressable onPress={() => setQuery("")} accessibilityLabel="Aramayı temizle" hitSlop={10}>
              <X size={18} color={colors.muted} strokeWidth={1.75} />
            </Pressable>
          )}
        </View>
        <IconButton
          icon={LayoutGrid}
          label="Afiş görünümü"
          active={viewMode === "grid"}
          onPress={() => dispatch(setViewMode("grid"))}
        />
        <IconButton
          icon={List}
          label="Liste görünümü"
          active={viewMode === "list"}
          onPress={() => dispatch(setViewMode("list"))}
        />
      </View>

      <View className="flex-row items-center gap-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-4"
          className="flex-1"
        >
          <Chip label="Tümü" selected={genre === null} onPress={() => setGenre(null)} />
          {genres.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={genre === item}
              onPress={() => setGenre(genre === item ? null : item)}
            />
          ))}
        </ScrollView>
      </View>
      {DEMO && (
        <Text className="px-4 font-sans text-xs text-muted" testID="demo-note">
          Demo: eklediğin ve düzenlediğin filmler yalnızca bu tarayıcıda saklanır.
        </Text>
      )}
    </View>
  );

  let body: React.ReactElement | null = null;
  if (isLoading) {
    body = viewMode === "grid" ? <GridSkeleton columns={columns} width={cardWidth} /> : <ListSkeleton />;
  } else if (isError && !films) {
    body = (
      <StateMessage
        icon={CloudOff}
        title="Filmler yüklenemedi"
        description={`Sunucuya ulaşılamadı. json-server'ın ${API_URL} adresinde çalıştığından emin ol.`}
        actionLabel="Tekrar dene"
        onAction={refetch}
      />
    );
  } else if (films && films.length === 0) {
    body = (
      <StateMessage
        icon={FilmIcon}
        title="Arşiv henüz boş"
        description="İzlediğin ya da izlemek istediğin ilk filmi ekleyerek başla."
        actionLabel="Film ekle"
        onAction={() => router.push("/films/new")}
      />
    );
  } else if (visible.length === 0) {
    body = (
      <StateMessage
        icon={SearchX}
        title="Eşleşen film yok"
        description="Aramayı ya da tür filtresini değiştirerek tekrar dene."
        actionLabel="Filtreleri temizle"
        onAction={clearFilters}
      />
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/films/new")}
              accessibilityRole="button"
              accessibilityLabel="Film ekle"
              className="min-h-11 flex-row items-center gap-1.5 rounded bg-primary px-3 active:opacity-80"
              style={Platform.OS === "web" ? { marginRight: 16 } : undefined}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={2} />
              <Text className="font-medium text-sm text-white">Ekle</Text>
            </Pressable>
          ),
        }}
      />
      <FlatList
        key={viewMode === "grid" ? `grid-${columns}` : "list"}
        data={body ? [] : visible}
        keyExtractor={(film) => film.id}
        numColumns={viewMode === "grid" ? columns : 1}
        columnWrapperStyle={viewMode === "grid" && columns > 1 ? { gap: GAP, paddingHorizontal: SIDE } : undefined}
        ItemSeparatorComponent={viewMode === "grid" ? () => <View style={{ height: 20 }} /> : undefined}
        renderItem={({ item }) =>
          viewMode === "grid" ? <FilmCard film={item} width={cardWidth} /> : <FilmRow film={item} />
        }
        ListHeaderComponent={header}
        ListEmptyComponent={body ?? undefined}
        ListFooterComponent={<View style={{ height: 32 }} />}
        refreshControl={
          Platform.OS === "web" ? undefined : (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.muted} />
          )
        }
        keyboardShouldPersistTaps="handled"
        style={{ width: "100%", maxWidth: MAX_WIDTH, alignSelf: "center" }}
      />
    </View>
  );
}
