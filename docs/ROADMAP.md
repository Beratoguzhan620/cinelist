# CineList — Yol Haritası

Film ekleme, düzenleme, silme ve listeleme yapan mobil film arşivi (Redux Toolkit + RTK Query + json-server).

- **Önerilen repo adı:** `cinelist`
- **Teknoloji:** Expo (managed), React Native, TypeScript, NativeWind, expo-router
- **Kurallar:** `CONTRIBUTING.md` · **Tasarım:** `docs/DESIGN.md`

Her aşama ayrı bir branch ve PR olarak yapılır (`stage/<no>-<kisa-ad>`). Bir aşama ancak tüm maddeleri bitince, build/testler geçince ve ekran görüntüleri eklenince tamamlanmış sayılır. Biten maddeler `[x]` yapılır.

> Orijinal ödev metni yalnızca yerelde `docs/brief/` klasöründe durur (git'e girmez); bütün gereksinimler bu dosyaya işlenmiştir. Gereksinim: Redux Toolkit + RTK Query + json-server; film adı, yıl, görsel, tür, puan, açıklama, süre.

## Aşama 1 — Kurulum
- [x] Expo (expo-router, TypeScript, NativeWind) projesi bu klasöre kurulur; pnpm
- [x] Redux store + redux-persist, RTK Query `baseUrl: http://localhost:5174`, `db.json` (20 film seed)
- [x] `package.json` script'leri (concurrently ile expo + json-server)
- [x] `docs/DESIGN.md` token'ları `tailwind.config.js`'e işlenir; özel font

## Aşama 2 — Özellikler
- [x] Liste (poster grid/list geçişi, arama, tür filtresi, puana göre sıralama, pull-to-refresh)
- [x] Detay ekranı; ekleme ve düzenleme formu (doğrulama, görsel URL opsiyonel); silme onayı
- [x] Yükleniyor / hata / boş durumları; optimistic update

## Aşama 3 — Cila ve teslim
- [ ] App icon + splash; `npx tsc --noEmit` ve lint temiz
- [ ] Expo web çıktısı yayında (canlı demo) + ekran görüntüleri/GIF
- [ ] README (TR + EN)
