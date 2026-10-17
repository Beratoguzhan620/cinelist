import { useLocalSearchParams, useRouter } from "expo-router";
import { CloudOff } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

import { FilmForm } from "@/components/FilmForm";
import { StateMessage } from "@/components/StateViews";
import { useToast } from "@/components/Toast";
import { colors } from "@/lib/theme";
import { filmToForm } from "@/lib/validation";
import { useGetFilmQuery, useUpdateFilmMutation } from "@/store/filmsApi";

export default function EditFilmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data: film, isLoading, isError, refetch } = useGetFilmQuery(id);
  const [updateFilm, { isLoading: saving }] = useUpdateFilmMutation();

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
        <StateMessage
          icon={CloudOff}
          title="Film yüklenemedi"
          description="Film silinmiş ya da sunucuya ulaşılamıyor olabilir."
          actionLabel="Tekrar dene"
          onAction={refetch}
        />
      </View>
    );
  }

  return (
    <FilmForm
      initialValues={filmToForm(film)}
      submitLabel="Değişiklikleri kaydet"
      submitting={saving}
      onCancel={() => router.back()}
      onSubmit={async (changes) => {
        // The cache is patched optimistically, so the detail screen already shows the new values.
        const request = updateFilm({ id: film.id, ...changes }).unwrap();
        router.back();
        try {
          await request;
          toast("Değişiklikler kaydedildi.");
        } catch {
          toast("Değişiklikler kaydedilemedi, eski hâline döndürüldü.", "error");
        }
      }}
    />
  );
}
