# asEncoder — Proje Planı

> Durum: **v1.0 tamamlandı.** Bu belge artık tarihsel plan ve gelecek fikirler içerir.
> Güncel mimari için [README.md](./README.md) → Architecture bölümüne bak.

## 🎯 Hedef

Türkçe & İngilizce metni **Leet 1337** diline çeviren, **3 zorluk seviyesi** olan,
**AES-256-GCM** ile korunan, **client-side çalışan** bir çevirici/şifreleyici araç.

**Temel ilke:** Veri tarayıcıdan çıkmaz. Sunucu yok, hesap yok, telemetri yok.

---

## ✅ Tamamlananlar (Faz 0–7)

| Faz | İş | Durum |
|---|---|---|
| 0 | Next.js 14 + TS + Tailwind kurulumu | ✅ |
| 1 | Tema sistemi (CSS değişkenleri, flash önleme script'i) | ✅ |
| 2 | Tasarım sistemi (NeuButton, Toast, HackerBackground) | ✅ |
| 3 | Leet motoru — 3 sözlük + kelime kısaltmaları | ✅ |
| 4 | AES-GCM şifreleme/çözme (Web Crypto API) | ✅ |
| 5 | `.txt` dosya yükleme/indirme | ✅ |
| 6 | Dashboard entegrasyonu (3 panel) | ✅ |
| 7 | Polish — animasyon, mobil, README, görsel optimizasyonu | ✅ |

---

## 🔧 Yayın Öncesi Yapılan Düzeltmeler

Bu turda bulunan ve giderilen gerçek hatalar:

### Kritik hatalar

1. **Çift çeviri hatası (`translateToLeet`)**
   Kelime kısaltmaları (`the → 7h3`) önce uygulanıp sonra tüm metin harf harf
   çevrildiği için kısaltma bozuluyordu. Ayrıca `applyWordShortcuts` içinde
   placeholder mekanizması **32 satırlık yarım kod** olarak kalmıştı — derlenmiyordu.

   **Çözüm:** Metin kelime + ayraç parçalarına bölünüyor. Her kelime için:
   kısaltma varsa olduğu gibi ekleniyor, yoksa harf çevirisi uygulanıyor.

2. **`NeuPanel.tsx` ölü kod** — hiçbir yerde kullanılmıyordu, silindi.

3. **`FileHandler` imza tutarsızlığı** — `onLoad(content, filename)` imzalıydı
   ama `TranslatorPanel` tek argüman geçiyordu. Ayrıca `canDownload`/`onDownload`
   prop'ları gereksiz ve her yerde `false`/`() => {}` geçiliyordu.
   **Çözüm:** `download?: { getText, filename } | null` olarak sadeleştirildi.

4. **`REVERSE_LEET` tekrar eden anahtar** — `}{` hem `h` hem `x` için tanımlıydı
   (TypeScript derlemeyi engelliyordu). Ayrıca Türkçe karşılıklar hiç yoktu.
   **Çözüm:** Çakışma giderildi, benzersiz Türkçe semboller (`¢ § v ¶`) eklendi.
   Belirsiz olanlar (`9`, `0`, `1`) **bilinçli olarak tanımlanmadı** ve nedeni
   kodda yorum olarak açıklandı.

### Kalite iyileştirmeleri

5. **Görsel optimizasyonu** — `logo-character.png` 272 KB → **22 KB** (%92),
   `icon.png` 272 KB → 75 KB, `bg-character.png` 270 KB → 121 KB.
   Logo 56px görüntülendiği için 607px gereksizdi.

6. **CI/CD eklendi** — `.github/workflows/ci.yml`: type-check → lint → build
   zinciri + ayrı `npm audit` job'ı.

7. **ESLint kuruldu** — `eslint@8` + `eslint-config-next@14.2.5`. CI'da
   `npm run lint` çalışıyordu ama bağımlılık eksikti, her seferinde patlardı.

8. **README yeniden yazıldı** — Data Flow diyagramı, çift çeviri tuzağı
   açıklaması, güvenlik/cipher format detayları, Roadmap eklendi.

9. **`.gitignore` doğrulandı** — `*.tsbuildinfo` ve `next-env.d.yaml` ignore ediliyor.

---

## 📋 Doğrulama Sonuçları

### AES-256-GCM (Node Web Crypto ile test edildi)

| Test | Sonuç |
|---|---|
| Gidiş-dönüş (Türkçe karakterler dahil) | ✅ `Merhaba dünya! ğüşıöç İĞÜŞÖÇ` → şifre → çöz → **aynı** |
| Non-determinizm (salt+IV rastgele) | ✅ Aynı metin iki kez → **farklı** şifreler |
| Yanlış şifre reddi | ✅ `OperationError` — sahte düz metin dönmedi |
| Format doğrulama | ✅ 16B salt + 12B IV + ciphertext + 16B tag |
| Boş metin | ✅ Gidiş-dönüş çalışıyor |

### Çeviri Motoru

| Test | Sonuç |
|---|---|
| Çift çeviri koruması | ✅ `the` → `7h3` (**`7h15` değil**) |
| Kelime sınırı | ✅ `there` değişmiyor, sadece `the` → `7h3` |
| Kısa-vade eşleşme | ✅ `hackers` bozulmuyor (tam kelime eşleşmesi) |
| Türkçe karakterler | ✅ `çğıöşü ÇĞİÖŞÜ` korunuyor/çevriliyor |
| Noktalama koruması | ✅ `, . ! ?` değişmiyor |
| Zor seviye rastgeleliği | ✅ Her render farklı |
| Performans | ✅ 10.400 karakter → **3 ms** |

### Build

| Kontrol | Sonuç |
|---|---|
| `npm run type-check` | ✅ Hatasız |
| `npm run lint` | ✅ Uyarısız |
| `npm run build` | ✅ Başarılı — `/` 14.4 kB, First Load 101 kB |

---

## 🚀 Gelecek Fikirler

### Yüksek öncelik
- [ ] **Kısaltma sözlüğünü genişlet** — şu an ~25 kelime, yüzlerce kelime eklenebilir
- [ ] **Web Worker** — 100 KB+ metinlerde UI bloklanmasını önle
- [ ] **PWA** — çevrimdışı kullanım, `manifest.json` + service worker

### Orta öncelik
- [ ] **Çeviri geçmişi** — son 10 çeviriyi kopyalayabilir çıktı olarak sun
- [ ] **Leet → düz metin geri çeviri arayüzü** — `REVERSE_LEET` sözlüğü var,
      şu an sadece export ediliyor, UI'da kullanılmıyor
- [ ] **Kaydedilen şifreli notlar** — `localStorage` + yedekleme uyarısı
- [ ] **Klavye kısayolları** — `Cmd+Enter` çevir, `Cmd+C` kopyala

### Düşük öncelik
- [ ] **İki dilli arayüz** — TR/EN UI toggle (şu an sadece içerik dili)
- [ ] **Özel leet profilleri** — kullanıcı kendi harf eşlemesini tanımlayabilir
- [ ] **Toplu dönüştürme** — klasördeki tüm `.txt` dosyalarını toplu işle

---

## 🧠 Mimari Kararlar ve Gerekçeler

| Karar | Gerekçe |
|---|---|
| **AES-GCM, XOR değil** | XOR kaba kuvvetle kırılır ve bütünlük doğrulaması yok. GCM hem şifreler hem doğrular (auth tag). Videoda "neden XOR değil" diye anlatılacak. |
| **Web Crypto API, kütüphane değil** | `crypto.subtle` tarayıcının tamamında var. Ekstra 200 KB paket gerekmez, bağımlılık zinciri olmaz, güvenlik açığı yüzeyi küçük kalır. |
| **PBKDF2 100.000 iterasyon** | OWASP önerisi. SALT uzunluğu 16 bayt. |
| **Parça bazlı çeviri** | Regex ile kelime bulmak hem `there`/`the` çakışması üretir hem de kısaltma bozulmasına yol açar. `split(/([\s\p{P}\p{S}]+)/u)` hem kelime sınırı hem ayraç koruması verir. |
| **Zor seviye `Math.random()`** | Demo için yeterli. Üretimde `crypto.getRandomValues()` kullanılmalı — not eklendi. |
| **Tema flash önleme** | `localStorage`'a erişim `useEffect`'ten **önce** olamaz (hydration uyuşmazlığı). Çözüm: `<head>` içinde küçük bir inline script. |
| **`REVERSE_LEET` belirsizlikler** | `1` hem `l` hem `ı` olabilir. Sözlükte tekrarlı anahtar tanımlamak TypeScript'i kırar ve yanlış sonuç verir. Bu yüzden belirsiz semboller **atlanır**, kodda yorumlanır. |
| **`.txt` dosya boyut limiti** | `FileHandler` 1 MB üzeri dosyaları reddeder — tarayıcıyı kilitlememek için. |

---

## 📁 Klasör Yapısı

```
asencoder/
├── app/
│   ├── layout.tsx           # Fontlar + tema başlatma script'i
│   ├── page.tsx             # Dashboard (tek sayfa, tüm state)
│   ├── globals.css          # Tema değişkenleri + 3D bileşenler
│   └── icon.png             # Favicon (512px, 75 KB)
├── components/
│   ├── HackerBackground.tsx # Izgara + karakter arka planı
│   ├── ThemeToggle.tsx
│   ├── TranslatorPanel.tsx  # Sol panel: giriş + dil + seviye
│   ├── OutputPanel.tsx      # Sağ panel: 3 varyasyon + sekmeler
│   ├── CryptoPanel.tsx      # Şifrele / çöz
│   ├── FileHandler.tsx      # .txt yükle / indir
│   ├── NeuButton.tsx
│   └── Toast.tsx
├── lib/
│   ├── leet/
│   │   ├── basic.ts         # Tek değerli sözlük
│   │   ├── medium.ts        # Semboller + kelime kısaltmaları
│   │   ├── hard.ts          # Rastgele alternatifler
│   │   ├── translator.ts    # translateToLeet() + REVERSE_LEET
│   │   └── index.ts
│   ├── crypto/
│   │   ├── aes.ts           # AES-GCM + PBKDF2 sarmalayıcı
│   │   └── utils.ts
│   └── index.ts
├── public/
│   ├── logo-character.png   # 256px, 22 KB
│   └── bg-character.png     # 1920px, 121 KB
├── .github/workflows/ci.yml
└── docs/                    # (gelecekte) ek dokümantasyon
```

---

## 📺 Video Materyali Notu

Bu proje "YAPAY ZEKA İLE ŞUNU YAPTIM" serisinin **1. bölümü** için hazırlandı.

Videoda anlatılabilecek güçlü noktalar:

1. **Çift çeviri tuzağı** — gerçek bir hata, gerçek bir çözüm. "AI yazdı,
   ben test ettim, çalışmadı, sebebini buldum" hikâyesi.
2. **Kelime sınırı problemi** — `there` vs `the`. Regex'in neden yetmediği.
3. **Neden AES, neden XOR değil** — XOR kırılabilir, GCM bütünlük doğrular.
4. **PBKDF2'nin ne yaptığı** — şifreden anahtar türetme, 100.000 tur.
5. **Salt + IV neden gerekli** — aynı metin iki kez şifrelenince farklı çıkmalı.
6. **Tema flash sorunu** — hydration'dan önce `<head>`'e script koyma tekniği.
7. **Görsel optimizasyonu** — 272 KB → 22 KB.

**Seri adı:** YAPAY ZEKA İLE ŞUNU YAPTIM
**Bölüm:** #1 — Leet 1337 Translator & AES Cipher
**Geliştirici:** [@assyte](https://github.com/assyte)

---

## 📄 Lisans

[MIT](./LICENSE) © 2026 [assyte](https://github.com/assyte)