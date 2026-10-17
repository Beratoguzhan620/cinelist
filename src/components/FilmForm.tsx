import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

import { formatDuration } from "@/lib/format";
import {
  validateField,
  validateFilm,
  type FilmFormErrors,
  type FilmFormField,
  type FilmFormValues,
} from "@/lib/validation";
import { GENRES, type FilmInput } from "@/types/film";

import { Poster } from "./Poster";
import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { TextField } from "./ui/TextField";

type FilmFormProps = {
  initialValues: FilmFormValues;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (film: FilmInput) => void;
  onCancel: () => void;
};

export function FilmForm({ initialValues, submitLabel, submitting, onSubmit, onCancel }: FilmFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FilmFormErrors>({});

  const change = (field: FilmFormField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Once a field shows an error, re-check it while the user types so the message clears as soon as it is fixed.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateField(field, next) }));
  };

  const blur = (field: FilmFormField) => {
    if (values[field] !== "" || errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, values) }));
    }
  };

  const submit = () => {
    const result = validateFilm(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSubmit(result.value);
  };

  const minutes = Number(values.durationMinutes);
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="items-center px-4 pb-10 pt-4">
        <View className="w-full max-w-[560px] gap-5">
          {hasErrors && (
            <View accessibilityRole="alert" className="rounded border border-danger bg-surface px-4 py-3">
              <Text className="font-medium text-sm text-danger">Kaydetmeden önce işaretli alanları düzelt.</Text>
            </View>
          )}

          <TextField
            label="Film adı"
            value={values.title}
            onChangeText={(text) => change("title", text)}
            onBlur={() => blur("title")}
            error={errors.title}
            placeholder="Örn. Yıldızlararası"
            maxLength={120}
            autoCapitalize="sentences"
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextField
                label="Yıl"
                value={values.year}
                onChangeText={(text) => change("year", text.replace(/\D/g, ""))}
                onBlur={() => blur("year")}
                error={errors.year}
                placeholder="2014"
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
            <View className="flex-1">
              <TextField
                label="Süre (dakika)"
                value={values.durationMinutes}
                onChangeText={(text) => change("durationMinutes", text.replace(/\D/g, ""))}
                onBlur={() => blur("durationMinutes")}
                error={errors.durationMinutes}
                help={minutes > 0 ? formatDuration(minutes) : undefined}
                placeholder="169"
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>

          <View className="gap-1.5">
            <Text className="font-medium text-sm text-ink">Tür</Text>
            <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
              {GENRES.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  selected={values.genre === genre}
                  onPress={() => change("genre", genre)}
                />
              ))}
            </View>
            {errors.genre && <Text className="font-sans text-xs text-danger">{errors.genre}</Text>}
          </View>

          <TextField
            label="Puan"
            value={values.rating}
            onChangeText={(text) => change("rating", text.replace(/[^\d.,]/g, ""))}
            onBlur={() => blur("rating")}
            error={errors.rating}
            help="0 ile 10 arası, en fazla bir ondalık (ör. 8,5)."
            placeholder="8,5"
            keyboardType="decimal-pad"
            maxLength={4}
          />

          <TextField
            label="Açıklama"
            value={values.description}
            onChangeText={(text) => change("description", text)}
            onBlur={() => blur("description")}
            error={errors.description}
            help={`${values.description.trim().length}/1000`}
            placeholder="Filmin kısa özeti"
            multiline
            maxLength={1000}
          />

          <View className="flex-row items-start gap-3">
            <View className="flex-1">
              <TextField
                label="Afiş adresi (isteğe bağlı)"
                value={values.posterUrl}
                onChangeText={(text) => change("posterUrl", text.trim())}
                onBlur={() => blur("posterUrl")}
                error={errors.posterUrl}
                help="Boş bırakırsan sade bir yer tutucu gösterilir."
                placeholder="https://"
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Poster
              key={values.posterUrl}
              film={{ title: values.title || "Afiş", posterUrl: errors.posterUrl ? null : values.posterUrl || null }}
              className="mt-7 w-16"
              compact
            />
          </View>

          <View className="flex-row justify-end gap-2 border-t border-border pt-5">
            <Button label="Vazgeç" variant="secondary" onPress={onCancel} disabled={submitting} />
            <Button label={submitLabel} onPress={submit} loading={submitting} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
