/**
 * 🅼 ORTA LEET SÖZLÜĞÜ
 * Basit + çoklu alternatifler + özel semboller.
 * Daha çeşitli, ama hâlâ okunabilir.
 *
 * Sembol seçim kuralı: yalnızca yaygın hacker/leet yazımlarında
 * gerçekten kullanılan karakterler. Türkçe veya İngilizce klavyede
 * kolayca üretilebilir olmalı — rastgele Unicode (đ, ƒ, ñ, £ …)
 * klavye erişimi zor olduğu için kullanıcıyı yorar.
 */

export const MEDIUM_LEET: Record<string, string> = {
  // Standart İngilizce harfleri — çoklu semboller
  a: "@",
  b: "8",
  c: "(",
  d: "d",
  e: "3",
  f: "f",
  g: "9",
  h: "#",
  i: "1",
  j: "j",
  k: "k",
  l: "|",
  m: "m",
  n: "n",
  o: "0",
  p: "p",
  q: "q",
  r: "r",
  s: "$",
  t: "+",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",

  // Türkçe özel karakterler
  ç: "c",
  ğ: "g",
  ş: "§",
  ö: "0",
  ü: "v",
  ı: "1",

  // Büyük harfler
  A: "@",
  B: "8",
  C: "(",
  D: "D",
  E: "3",
  F: "F",
  G: "9",
  H: "#",
  I: "1",
  J: "J",
  K: "K",
  L: "|",
  M: "M",
  N: "N",
  O: "0",
  P: "P",
  Q: "Q",
  R: "R",
  S: "$",
  T: "+",
  U: "U",
  V: "V",
  W: "W",
  X: "X",
  Y: "Y",
  Z: "Z",

  // Türkçe büyük harfler
  Ç: "C",
  Ğ: "G",
  Ş: "§",
  Ö: "0",
  Ü: "V",
};

/**
 * Orta seviyede yaygın kelime kısaltmaları.
 * Kısaltmalar zaten leet formundadır; çeviri motoru bunları
 * harf çevirisinden muaf tutar (çift çeviri koruması).
 */
export const MEDIUM_WORDS: Record<string, string> = {
  // İngilizce
  the: "7h3",
  and: "4nd",
  you: "y0u",
  are: "4r3",
  for: "f0r",
  with: "w1th",
  this: "7h15",
  that: "7h47",
  have: "h4v3",
  from: "fr0m",
  what: "wh47",
  your: "y0ur",
  they: "7h3y",
  been: "833n",
  more: "m0r3",
  very: "v3ry",
  when: "wh3n",
  will: "w1ll",
  there: "7h3r3",
  their: "7h31r",
  would: "w0uld",
  about: "4b0u7",

  // Türkçe
  bir: "b1r",
  ben: "b3n",
  sen: "s3n",
  var: "v4r",
  yok: "y0k",
  için: "1ç1n",
  olan: "0l4n",
  ama: "4m4",
  son: "s0n",
  çok: "ç0k",
  gibi: "g1b1",
  daha: "d4h4",
  ne: "n3",
  de: "d3",
  da: "d4",
  mi: "m1",
  mı: "m1",
  mu: "mu",
  mü: "mu",
  ve: "v3",
  ya: "y4",
  ki: "k1",
  bu: "bu",
  şey: "§3y",
  şeyi: "§3y1",
  değil: "d3g1l",
  çünkü: "ç0nkü",
  bana: "b4n4",
  sana: "s4n4",
  bize: "b1z3",
  size: "s1z3",
  onlar: "0nl4r",
  biz: "b1z",
  siz: "s1z",
};