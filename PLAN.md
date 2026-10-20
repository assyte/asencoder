# asEncoder — Proje Planı

> Durum: **v1.0 tamamlandı.** Next.js 16 + React 19 + static export.
> Bu belge mimari kararları, düzeltme geçmişini ve gelecek fikirleri içerir.
> Güncel kullanım için [README.md](./README.md).

## 🎯 Hedef

Türkçe & İngilizce metni **Leet 1337** diline çeviren, **3 zorluk seviyesi** olan,
**AES-256-GCM** ile korunan, **client-side çalışan** bir çevirici/şifreleyici araç.

**Temel ilke:** Veri tarayıcıdan çıkmaz. Sunucu yok, hesap yok, telemetri yok.

---

## ✅ Tamamlananlar

| Faz | İş | Durum |
|---|---|---|
| 0 | Next.js kurulumu + TS + Tailwind | ✅ |
| 1 | Tema sistemi (CSS değişkenleri, flash önleme script'i) | ✅ |
| 2 | Tasarım sistemi (NeuButton, Toast, HackerBackground) | ✅ |
| 3 | Leet motoru — 3 sözlük + kelime kısaltmaları | ✅ |
| 4 | AES-GCM şifreleme/çözme (Web Crypto API) | ✅ |
| 5 | `.txt` dosya yükleme/indirme | ✅ |
| 6 | Dashboard entegrasyonu (3 panel) | ✅ |
| 7 | Polish — animasyon, mobil, README, görsel optimizasyonu | ✅ |
| 8 | **Next.js 16 + React 19 yükseltmesi** | ✅ |
| 9 | **ESLint 9 flat config** | ✅ |
| 10 | **Static export** (sunucu katmanı tamamen kaldırıldı) | ✅ |

---

## 🔧 Yayın Öncesi Yapılan Düzeltmeler

### Kritik mantık hataları

**1. Çift çeviri hatası (`translateToLeet`)**

Kelime kısaltmaları (`the → 7h3`) önce uygulanıp sonra tüm metin harf harf
çevrildiği için kısaltma bozuluyordu. Ayrıca `applyWordShortcuts` içindeki
placeholder mekanizması 32 satırlık yarım kod olarak kalmıştı — derlenmiyordu.

**Çözüm:** Metin kelime + ayraç parçalarına bölünüyor (`split(/([\s\p{P}\p{S}]+)/u)`).
Her kelime için: kısaltma varsa olduğu gibi ekleniyor, yoksa harf çevirisi uygulanıyor.
Bu ayrıca `there`/`the` kelime sınırı çakışmasını da engelliyor.

| Tuzak | Eski | Yeni |
|---|---|---|
| Çift çeviri | `the` → `7h3` → `7h15` | `the` → `7h3` ✅ |
| Alt-kelime | `there` → `7h3r3` | `there` değişmez ✅ |

**2. `NeuPanel.tsx` ölü kod** — hiçbir yerde kullanılmıyordu, silindi.

**3. `FileHandler` imza tutarsızlığı** — `onLoad(content, filename)` imzalıydı
ama `TranslatorPanel` tek argüman geçiyordu. `canDownload`/`onDownload`
prop'ları gereksiz ve her yerde `false`/`() => {}` geçiliyordu.
**Çözüm:** `download?: { getText, filename } | null` olarak sadeleştirildi.
Ayrıca 1 MB dosya limiti ve UTF-8 okuma eklendi.

**4. `REVERSE_LEET` tekrar eden anahtar** — `}{` hem `h` hem `x` için tanımlıydı
(TypeScript derlemeyi engelliyordu). Türkçe karşılıklar hiç yoktu.
**Çözüm:** Çakışma giderildi, benzersiz Türkçe semboller (`¢ § v ¶`) eklendi.
Belirsiz olanlar (`9`, `0`, `1`) **bilinçli olarak tanımlanmadı** ve nedeni
kodda yorum olarak açıklandı — `1` hem `l` hem `ı` olabilir, tek seçim yanlış olurdu.

### React 19 / Next.js 16 yükseltmesi

**5. `ThemeToggle` hydration hatası** — `useEffect` içinde `setState` çağrısı
hem cascading render üretiyor hem de hydration mismatch riski taşıyordu.
**Çözüm:** `useSyncExternalStore` kullanıldı. Sunucu snapshot'ı ile istemci
snapshot'ı karşılaştırılıyor, hydration sırasında doğru değer kullanılıyor,
dış sistem değişimlerine abone olunuyor.

**6. ESLint 9 flat config** — `eslint-config-next@16` ESLint 9 gerektiriyor.
`.eslintrc.json` → `eslint.config.mjs` dönüşümü yapıldı.
`next lint` kaldırıldı (Next 16'da deprecated), doğrudan `eslint .` çağrılıyor.

**7. BOM hataları** — Windows `Set-Content` ile yazılan dosyalarda UTF-8 BOM
oluşmuştu; ESLint JSON parse hatası veriyordu. BOM temizlendi.

**8. Static export** — `output: "export"` ile sunucu katmanı tamamen kaldırıldı.
`npm start` yerine `npm run preview` (statik sunucu).
Artık herhangi bir statik host'a deploy edilebilir.

### Güvenlik

**9. Next.js güvenlik açıkları** — 14.2.5 sürümünde 15+ kritik advisory vardı
(Server Actions, middleware, RSC cache, image optimizer).
Tüm bu açıkların **kaynağı sunucu katmanıdır**. 16.4.2'ye yükseltildi ve
static export ile sunucu tarafı tamamen devre dışı bırakıldı.

**Sonuç:** `npm audit --omit=dev` → **0 açık**.

### Kalite

**10. Görsel optimizasyonu** — `logo-character.png` 272 KB → **22 KB** (%92),
`icon.png` 272 KB → 75 KB, `bg-character.png` 270 KB → 121 KB.

**11. CI/CD** — type-check → lint → build zinciri + statik çıktı doğrulama
(`out/index.html` kontrolü) + ayrı `npm audit --omit=dev` job'ı.

**12. README yeniden yazıldı** — Data Flow diyagramı, çift çeviri tuzağı
açıklaması, cipher format detayları, deploy seçenekleri, roadmap.

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
| `npm run build` | ✅ Başarılı — Turbopack, ~800ms |
| `npm audit --omit=dev` | ✅ **0 açık** |
| Dev sunucusu | ✅ HTTP 200, sayfa düzgün render |
| Static export | ✅ `out/index.html` üretildi |

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
- [ ] **Web Worker** ile `Math.random()` yerine `crypto.getRandomValues()`
      (zor seviye için CSPRNG — demo yeterli ama üretimde doğru olan bu)

---

## 🧠 Mimari Kararlar ve Gerekçeler

| Karar | Gerekçe |
|---|---|
| **AES-GCM, XOR değil** | XOR kaba kuvvetle kırılır ve bütünlük doğrulaması yok. GCM hem şifreler hem doğrular (auth tag). Videoda "neden XOR değil" diye anlatılacak. |
| **Web Crypto API, kütüphane değil** | `crypto.subtle` tarayıcının tamamında var. Ekstra 200 KB paket gerekmez, bağımlılık zinciri olmaz, güvenlik açığı yüzeyi küçük kalır. |
| **PBKDF2 100.000 iterasyon** | OWASP önerisi. Salt uzunluğu 16 bayt. |
| **Parça bazlı çeviri** | Regex ile kelime bulmak hem `there`/`the` çakışması üretir hem de kısaltma bozulmasına yol açar. `split(/([\s\p{P}\p{S}]+)/u)` hem kelime sınırı hem ayraç koruması verir. |
| **Zor seviye `Math.random()`** | Demo için yeterli. Üretimde `crypto.getRandomValues()` kullanılmalı. |
| **Tema flash önleme** | `localStorage`'a erişim `useEffect`'ten **önce** olamaz (hydration uyuşmazlığı). Çözüm: `<head>` içinde küçük bir inline script. |
| **`useSyncExternalStore` (TemaToggle)** | Tema `<head>` script'i ile hydrate ÖNCESİ uygulanır. Bu yüzden React ilk render'da doğru değeri bilmeli. `useEffect`+`setState` ikisini de çözmüyor. |
| **`REVERSE_LEET` belirsizlikler** | `1` hem `l` hem `ı` olabilir. Tekrarlı anahtar tanımlamak TypeScript'i kırar ve yanlış sonuç verir. Belirsiz semboller **atlanır**, kodda yorumlanır. |
| **`.txt` dosya boyut limiti** | `FileHandler` 1 MB üzeri dosyaları reddeder — tarayıcıyı kilitlememek için. |
| **Static export** | Şifreleme tarayıcıda yapılıyor, sunucu katmanına ihtiyaç yok. `output: "export"` ile saldırı yüzeyi sıfır ve herhangi bir statik host'a deploy edilebilir. |
| **Next.js 16 + React 19** | 14.x serisindeki güvenlik açıkları sunucu katmanından geliyordu. Yükseltme + static export birlikte bunları tamamen ortadan kaldırdı. |
| **`npm audit --omit=dev` (CI)** | Kalan uyarıların tamamı build-time araçlardan geliyor (`chokidar`, `fast-glob`, `glob`) ve tarayıcıya paketlenmiyor. CI'yı kırmaz, bilgi amaçlı ayrı rapor çalışır. |

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
│   ├── ThemeToggle.tsx      # useSyncExternalStore ile tema
│   ├── TranslatorPanel.tsx  # Sol panel: giriş + dil + seviye
│   ├── OutputPanel.tsx      # Sağ panel: 3 varyasyon + sekmeler
│   ├── CryptoPanel.tsx      # Şifrele / çöz
│   ├── FileHandler.tsx      # .txt yükle / indir (1 MB limit)
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
├── .github/
│   ├── workflows/ci.yml     # type-check → lint → build + audit
│   ├── social-preview.png   # 1280x640
│   └── og-image.png         # 1200x630
├── eslint.config.mjs        # ESLint 9 flat config
├── next.config.mjs          # static export
└── out/                     # build çıktısı (gitignore)
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
8. **Next.js güvenlik açıkları** — audit'te çıkan 15+ advisory, static export
   ile nasıl tamamen ortadan kaldırıldığı.
9. **`useSyncExternalStore`** — React 19'da neden `useEffect` yerine bu.

**Seri adı:** YAPAY ZEKA İLE ŞUNU YAPTIM
**Bölüm:** #1 — Leet 1337 Translator & AES Cipher
**Geliştirici:** [@assyte](https://github.com/assyte)
**Canlı demo:** https://github.com/assyte/asencoder

---

## 📄 Lisans

[MIT](./LICENSE) © 2026 [assyte](https://github.com/assyte)