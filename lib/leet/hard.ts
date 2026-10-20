/**
 * 🔤 ZOR LEET SÖZLÜĞÜ
 * Birden fazla alternatif içeren dizi. Çeviri motoru her karakter için
 * rastgele bir alternatif seçer — aynı metin her seferinde farklı çıkar.
 *
 * Sembol seçim kuralı: yalnızca yaygın hacker/leet yazımlarında gerçekten
 * kullanılan, klavyeden erişilebilir karakterler.
 *
 * Kaçınılanlar ve nedenleri:
 *   • Cyrillic / Yunan harfleri (Я, ß, ∂, є) — Türkçe okuyucu için
 *     anlamsız, "bozuk karakter" izlenimi veriyor.
 *   • Latin-Extended semboller (Þ, Đ, ß, ſ) — Türkçe klavyede yok,
 *     yazması zor, çıktıyı okunaksızlaştırıyor.
 *   • Emoji ve dekoratif semboller — kopyala-yapıştırı bozar.
 */

export const HARD_LEET_OPTIONS: Record<string, string[]> = {
  // Standart İngilizce harfleri — 2–4 alternatif
  a: ["@", "4", "/-\\", "^"],
  b: ["8", "|3", "b"],
  c: ["(", "[", "<", "{"],
  d: ["|)", "d"],
  e: ["3", "&"],
  f: ["f"],
  g: ["9", "6", "&"],
  h: ["#", "|-|", "}{"],
  i: ["1", "!", "|"],
  j: ["j"],
  k: ["|{", "k"],
  l: ["1", "|"],
  m: ["|\\/|", "/\\/\\", "m"],
  n: ["|\\|", "/\\/", "n"],
  o: ["0", "()", "[]"],
  p: ["|>", "p"],
  q: ["q"],
  r: ["|2", "r"],
  s: ["$", "5"],
  t: ["7", "+", "†"],
  u: ["|_|", "u"],
  v: ["\\/", "v"],
  w: ["\\/\\/", "vv", "w"],
  x: ["×", "><"],
  y: ["'/", "y"],
  z: ["2", "z"],

  // Türkçe küçük harfler
  ç: ["c", "C", "(,"],
  ğ: ["g", "G", "9"],
  ş: ["§", "$", "5h", "sh"],
  ö: ["0", "()", "o"],
  ü: ["v", "u", "|_|"],
  ı: ["1", "i", "|"],

  // Standart İngilizce büyük harfler
  A: ["@", "4", "/-\\", "^"],
  B: ["8", "|3", "B"],
  C: ["(", "[", "<", "{"],
  D: ["|)", "D"],
  E: ["3", "&"],
  F: ["F"],
  G: ["9", "6", "&"],
  H: ["#", "|-|", "}{"],
  I: ["1", "!", "|"],
  J: ["J"],
  K: ["|{", "K"],
  L: ["1", "|"],
  M: ["|\\/|", "/\\/\\", "M"],
  N: ["|\\|", "/\\/", "N"],
  O: ["0", "()", "[]"],
  P: ["|>", "P"],
  Q: ["Q"],
  R: ["|2", "R"],
  S: ["$", "5"],
  T: ["7", "+", "†"],
  U: ["|_|", "U"],
  V: ["\\/", "V"],
  W: ["\\/\\/", "VV", "W"],
  X: ["×", "><"],
  Y: ["'/", "Y"],
  Z: ["2", "Z"],

  // Türkçe büyük harfler
  Ç: ["C", "(,", "Ç"],
  Ğ: ["G", "9", "Ğ"],
  Ş: ["§", "SH", "$", "5H"],
  Ö: ["0", "()", "Ö"],
  Ü: ["|_|", "U", "Ü"],
};

/**
 * Zor seviyede kelime kısaltmaları — uzun kelimeler kısa sembolik karşılığa.
 * Kısaltmalar zaten leet formundadır; çeviri motoru bunları harf çevirisinden
 * muaf tutar, böylece çift dönüşüm oluşmaz.
 */
export const HARD_WORDS: Record<string, string> = {
  // İngilizce
  the: "7|-|",
  and: "4|\\|&",
  you: "y0||_>",
  are: "4|\\|3",
  for: "f0|\\|",
  with: "w17|-|4",
  this: "7|-|15",
  that: "7|-|47",
  have: "|-|4\\/3",
  from: "f|\\|0|\\|",
  hacker: "|-|4(|<3|\\|",
  secret: "53(\\/\\|37",
  password: "p4$$w0|\\|d",
  security: "53(/\\|1 7y",

  // Türkçe
  bir: "8!\\|\\|",
  ben: "83|\\|",
  sen: "53|\\|",
  var: "v4\\|\\|",
  yok: "y0|<",
  için: "1(/\\|!|\\|",
  olan: "0!4|\\|",
  sifreleme: "51f|\\|3!3|\\|3",
  güvenlik: "9\\/\\/3|\\|!|<",
  çalışıyor: "(4|/\\|5iy0|\\|",
  güzel: "9\\/\\/z3!",
  bugün: "8\\/\\/9|\\|",
};