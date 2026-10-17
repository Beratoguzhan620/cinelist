import { useRouter } from "expo-router";

import { FilmForm } from "@/components/FilmForm";
import { useToast } from "@/components/Toast";
import { emptyFilmForm } from "@/lib/validation";
import { useAddFilmMutation } from "@/store/filmsApi";

export default function NewFilmScreen() {
  const router = useRouter();
  const toast = useToast();
  const [addFilm, { isLoading }] = useAddFilmMutation();

  return (
    <FilmForm
      initialValues={emptyFilmForm}
      submitLabel="Filmi ekle"
      submitting={isLoading}
      onCancel={() => router.back()}
      onSubmit={async (film) => {
        try {
          const created = await addFilm(film).unwrap();
          toast(`"${created.title}" arşive eklendi.`);
          router.replace({ pathname: "/films/[id]", params: { id: created.id } });
        } catch {
          toast("Film eklenemedi. Sunucu bağlantısını kontrol et.", "error");
        }
      }}
    />
  );
}
