/**
 * 🔤 BASİT LEET SÖZLÜĞÜ
 * Temel harf değişimleri — en okunabilir hali.
 * Hem Türkçe hem İngilizce karakterleri kapsar.
 *
 * Tasarım kararı — Türkçe harfler neden indirgeniyor:
 *   `ş` doğrudan `$` olsaydı, çıktı orta seviyeye kayardı. "Basit"
 *   seviyenin sözü okunabilirlik olduğu için Türkçe harfler önce
 *   Latin karşılıklarına indirgenir (`ş → s`), sonra o harf kendi
 *   dönüşümünü alır (`s → 5`). Sonuç: `şifre → s1fr3`.
 *
 *   Bu iki adımlı yol kasıtlıdır; Türkçe harflerin kendine ait leet
 *   karşılıkları (`ş → §`, `ü → v`) orta ve zor seviyelerde devreye girer.
 */

export const BASIC_LEET: Record<string, string> = {
  // Standart İngilizce harfleri
  a: "@",
  b: "b",
  c: "c",
  d: "d",
  e: "3",
  f: "f",
  g: "g",
  h: "h",
  i: "1",
  j: "j",
  k: "k",
  l: "1",
  m: "m",
  n: "n",
  o: "0",
  p: "p",
  q: "q",
  r: "r",
  s: "5",
  t: "7",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",

  // Türkçe küçük harfler → Latin karşılıkları
  ç: "c",
  ğ: "g",
  ş: "s",
  ö: "o",
  ü: "u",
  ı: "i",

  // Büyük harfler
  A: "@",
  B: "B",
  C: "C",
  D: "D",
  E: "3",
  F: "F",
  G: "G",
  H: "H",
  I: "1",
  J: "J",
  K: "K",
  L: "1",
  M: "M",
  N: "N",
  O: "0",
  P: "P",
  Q: "Q",
  R: "R",
  S: "5",
  T: "7",
  U: "U",
  V: "V",
  W: "W",
  X: "X",
  Y: "Y",
  Z: "Z",

  // Türkçe büyük harfler → Latin karşılıkları (I ile tutarlı)
  Ç: "C",
  Ğ: "G",
  Ş: "S",
  Ö: "O",
  Ü: "U",
};
