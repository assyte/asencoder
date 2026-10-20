/**
 * 🔐 AES-256-GCM ŞİFRELEME MODÜLÜ
 * Web Crypto API tabanlı, tarayıcıda çalışır.
 * PBKDF2 ile şifreden anahtar türetir.
 *
 * Çıktı formatı (Base64):
 * [16 byte salt][12 byte IV][N byte ciphertext + 16 byte tag]
 */

const SALT_LENGTH = 16; // 128 bit
const IV_LENGTH = 12;   // 96 bit — GCM için önerilen
const KEY_LENGTH = 256; // AES-256
const PBKDF2_ITERATIONS = 100_000;

/**
 * Kullanıcının şifresinden AES anahtarı türetir.
 */
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password).buffer as ArrayBuffer;
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Base64 <-> Uint8Array dönüşümleri (tarayıcı uyumlu).
 */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Rastgele byte üretir.
 */
function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * 🔒 METNİ ŞİFRELE
 * @param plaintext Düz metin
 * @param password Kullanıcının şifresi
 * @returns Base64 encoded [salt + iv + ciphertext]
 */
export async function encryptText(
  plaintext: string,
  password: string
): Promise<string> {
  if (!plaintext) throw new Error("Şifrelenecek metin boş olamaz.");
  if (!password || password.length < 6) {
    throw new Error("Şifre en az 6 karakter olmalı.");
  }

  const encoder = new TextEncoder();
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);

  const key = await deriveKey(password, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    encoder.encode(plaintext).buffer as ArrayBuffer
  );

  // Salt + IV + ciphertext birleştir
  const combined = new Uint8Array(
    salt.length + iv.length + ciphertext.byteLength
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return bytesToBase64(combined);
}

/**
 * 🔓 ŞİFREYİ ÇÖZ
 * @param encryptedBase64 Base64 encoded şifreli metin
 * @param password Kullanıcının şifresi
 * @returns Düz metin
 */
export async function decryptText(
  encryptedBase64: string,
  password: string
): Promise<string> {
  if (!encryptedBase64) throw new Error("Şifreli metin boş olamaz.");
  if (!password) throw new Error("Şifre gerekli.");

  try {
    const combined = base64ToBytes(encryptedBase64);

    if (combined.byteLength < SALT_LENGTH + IV_LENGTH + 16) {
      throw new Error("Şifreli metin formatı geçersiz.");
    }

    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

    const key = await deriveKey(password, salt);

    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
      key,
      ciphertext.buffer as ArrayBuffer
    );

    return new TextDecoder().decode(plaintext);
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "OperationError") {
        throw new Error("Şifre hatalı veya veri bozuk.");
      }
      throw err;
    }
    throw new Error("Çözme başarısız oldu.");
  }
}

/**
 * Şifre gücünü hesapla (0-4 arası).
 */
export function getPasswordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Çok Zayıf", "Zayıf", "Orta", "İyi", "Güçlü"];
  const colors = ["#DC2626", "#EA580C", "#CA8A04", "#65A30D", "#16A34A"];

  return {
    score: score as 0 | 1 | 2 | 3 | 4,
    label: labels[score],
    color: colors[score],
  };
}

/**
 * Şifreli çıktının geçerli bir Base64 + AES formatında olup olmadığını kontrol eder.
 */
export function isValidEncryptedFormat(input: string): boolean {
  if (!input || input.length < 40) return false;
  try {
    const decoded = base64ToBytes(input.trim());
    return decoded.byteLength >= SALT_LENGTH + IV_LENGTH + 16;
  } catch {
    return false;
  }
}
