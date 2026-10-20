/**
 * ÇEVİRİ MOTORU
 * Metni seçilen seviyeye göre Leet'e çevirir.
 */

import { BASIC_LEET } from "./basic";
import { MEDIUM_LEET, MEDIUM_WORDS } from "./medium";
import { HARD_LEET_OPTIONS, HARD_WORDS } from "./hard";

export type LeetLevel = "basic" | "medium" | "hard";
export type Language = "tr" | "en";

/**
 * Mevcut çevrilebilir karakterler (Türkçe + İngilizce).
 * UI süslemesi için kullanılır.
 */
function getCharPool(): string[] {
  return [
    ..."abcdefghijklmnopqrstuvwxyz",
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "ç", "ğ", "ş", "ö", "ü", "ı",
    "Ç", "Ğ", "Ş", "Ö", "Ü", "I",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    " ", ".", ",", "!", "?", "-", "_", "(", ")", "[", "]",
    "@", "#", "$", "%", "&", "*", "+", "=", "/", "\\",
  ];
}

/**
 * Diziden rastgele bir eleman seçer.
 * Hard seviyesi için kullanılır.
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Kelime bazlı kısaltmalar için hazırlanmış lookup tablosu.
 * Anahtarlar küçük harfe normalize edilir (Türkçe locale ile).
 */
function buildShortcutMap(
  shortcuts: Record<string, string>
): Map<string, string> {
  const map = new Map<string, string>();
  Object.entries(shortcuts).forEach(([word, short]) => {
    map.set(word.toLocaleLowerCase("tr"), short);
  });
  return map;
}

/**
 * Metni "kelime" ve "ayraç" parçalarına böler.
 * Ayraç = boşluk, noktalama işaretleri ve semboller.
 */
function splitWordsAndSeparators(text: string): string[] {
  return text.split(/([\s\p{P}\p{S}]+)/u);
}

/**
 * Bir parçanın kelime (harf) içerip içermediğini kontrol eder.
 * Ayraçlar (noktalama, boşluk) false döner.
 */
function isWord(part: string): boolean {
  return /\p{L}/u.test(part);
}

/**
 * Kelime bazlı kısaltmaları uygular.
 *
 * Tasarım notu: Sözlükteki kısaltmalar zaten *leet formundadır*
 * (`the` → `7h3`). Eğer önce kelime kısaltması uygulanıp sonra
 * tüm metin harf harf çevirilirse, `7h3` yeniden işlenir ve
 * kısaltma bozulur.
 *
 * Doğru sıra şudur:
 *   1. Metni kelime + ayraç parçalarına böl.
 *   2. Her kelime için: kısaltma varsa **olduğu gibi** ekle,
 *      yoksa harf çevirisi uygula.
 *
 * Bu yaklaşım "the" kelimesinin "there" içinde yanlışlıkla
 * eşleşmesini de engeller (parça bazlı tam kelime eşleşmesi).
 */
function applyShortcutsAndTranslate(
  parts: string[],
  shortcuts: Map<string, string>,
  level: LeetLevel
): string {
  return parts
    .map((part) => {
      if (part === "") return part;

      // Ayraç (boşluk / noktalama / sembol) — olduğu gibi geçir
      if (!isWord(part)) return part;

      // Kelime kısaltması eşleşti mi?
      const shortcut = shortcuts.get(part.toLocaleLowerCase("tr"));
      if (shortcut) return shortcut;

      // Eşleşme yok → harf harf çevir
      let translated = "";
      for (const char of part) {
        translated += translateChar(char, level);
      }
      return translated;
    })
    .join("");
}

/**
 * Ana çeviri fonksiyonu.
 *
 * @param text     Kaynak metin
 * @param level    Zorluk seviyesi (basic | medium | hard)
 * @param language Kaynak dil ipucu (şu an her iki dil için de aynı kurallar)
 */
export function translateToLeet(
  text: string,
  level: LeetLevel,
  language: Language = "tr"
): string {
  if (!text) return "";

  // Kelime kısaltmaları yalnızca medium ve hard seviyelerde devrede
  const useShortcuts = level === "medium" || level === "hard";
  const shortcutMap = useShortcuts
    ? buildShortcutMap(level === "medium" ? MEDIUM_WORDS : HARD_WORDS)
    : new Map<string, string>();

  const parts = splitWordsAndSeparators(text);
  return applyShortcutsAndTranslate(parts, shortcutMap, level);
}

/**
 * Tek bir karakteri çevirir.
 */
function translateChar(char: string, level: LeetLevel): string {
  if (level === "basic") {
    // Basit: tek değer
    if (char in BASIC_LEET) {
      return BASIC_LEET[char];
    }
    return char;
  }

  if (level === "medium") {
    // Orta: çoklu sembollerden biri ama tek seçenek
    if (char in MEDIUM_LEET) {
      return MEDIUM_LEET[char];
    }
    return char;
  }

  // Hard: diziden rastgele seç
  if (char in HARD_LEET_OPTIONS) {
    const options = HARD_LEET_OPTIONS[char];
    return pickRandom(options);
  }

  return char;
}

/**
 * Mevcut Leet pool'undan rastgele karakterler - UI süslemesi için.
 */
export function getRandomLeetString(length: number): string {
  const pool = getCharPool();
  let s = "";
  for (let i = 0; i < length; i++) {
    s += pool[Math.floor(Math.random() * pool.length)];
  }
  return s;
}

/**
 * Leet'ten düz metne ÇEVİRME (decoder).
 * Karakter düzeltmesi yapar; bilinen tüm leet sembollerini orijinal harfe çevirir.
 *
 * NOT: %100 doğruluk garantisi yoktur. Geri dönüşüm lossy olabilir
 * (örneğin "|" hem "l" hem "i" olabilir). Güvenli çözme için AES kullanın.
 */
export const REVERSE_LEET: Record<string, string> = {
  // --- İngilizce harfler ---
  "@": "a",
  "4": "a",
  "8": "b",
  "(": "c",
  "[": "c",
  "<": "c",
  "|)": "d",
  "3": "e",
  "9": "g",
  "6": "g",
  "&": "g",
  "#": "h",
  "|-|": "h",
  "}{": "h",
  "!": "i",
  "|": "i",
  "_|": "j",
  "1": "l",
  "|\\/|": "m",
  "/\\/\\": "m",
  "|\\|": "n",
  "/\\/": "n",
  "0": "o",
  "()": "o",
  "[]": "o",
  "|>": "p",
  "|2": "r",
  "$": "s",
  "5": "s",
  "7": "t",
  "+": "t",
  "|_|": "u",
  "\\/": "v",
  "\\/\\/": "w",
  "vv": "w",
  "><": "x",
  "2": "z",

  // --- Türkçe karakterler (benzersiz semboller) ---
  // Dikkat: "9" zaten "g", "0" zaten "o", "1" zaten "l" olduğu için
  // Türkçe karşılıkları burada tekrar tanımlanmaz — belirsizlik oluştururdu.
  "¢": "ç",
  "§": "ş",
  "v": "ü",
  "¶": "ğ",
};

/**
 * Aynı metinden 3 farklı seviyede varyasyon üretir.
 * Kullanıcıya yan yana sunulur.
 */
export function generateThreeVariations(
  text: string,
  language: Language = "tr"
): { basic: string; medium: string; hard: string } {
  return {
    basic: translateToLeet(text, "basic", language),
    medium: translateToLeet(text, "medium", language),
    hard: translateToLeet(text, "hard", language),
  };
}