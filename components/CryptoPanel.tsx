"use client";

import { useState } from "react";
import {
  encryptText,
  decryptText,
  getPasswordStrength,
  isValidEncryptedFormat,
} from "@/lib";
import { Button } from "./NeuButton";
import { downloadAsFile } from "./FileHandler";
import { useToast } from "./Toast";

interface CryptoPanelProps {
  textToEncrypt: string;
  decryptedOutput: string;
  setDecryptedOutput: (v: string) => void;
  mode: "idle" | "encrypt" | "decrypt";
  setMode: (m: "idle" | "encrypt" | "decrypt") => void;
}

export default function CryptoPanel({
  textToEncrypt,
  decryptedOutput,
  setDecryptedOutput,
  mode,
  setMode,
}: CryptoPanelProps) {
  // Şifrele
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [encrypted, setEncrypted] = useState("");

  // Çöz
  const [cipherInput, setCipherInput] = useState("");
  const [decryptPw, setDecryptPw] = useState("");
  const [showDecryptPw, setShowDecryptPw] = useState(false);

  const [busy, setBusy] = useState(false);

  const { show } = useToast();
  const strength = getPasswordStrength(password);

  const handleEncrypt = async () => {
    if (!textToEncrypt.trim()) {
      show("Şifrelenecek metin yok. Önce sol panelden bir metin gir.", "error");
      return;
    }
    if (password.length < 6) {
      show("Şifre en az 6 karakter olmalı.", "error");
      return;
    }
    setBusy(true);
    try {
      const result = await encryptText(textToEncrypt, password);
      setEncrypted(result);
      setMode("encrypt");
      show("Şifreleme tamamlandı.", "success");
    } catch (err) {
      show(err instanceof Error ? err.message : "Şifreleme başarısız.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDecrypt = async () => {
    if (!cipherInput.trim()) {
      show("Şifreli metin alanı boş.", "error");
      return;
    }
    if (!decryptPw) {
      show("Çözme şifresi gerekli.", "error");
      return;
    }
    if (!isValidEncryptedFormat(cipherInput)) {
      show("Geçersiz şifreli metin formatı.", "error");
      return;
    }
    setBusy(true);
    try {
      const result = await decryptText(cipherInput, decryptPw);
      setDecryptedOutput(result);
      setMode("decrypt");
      show("Çözme tamamlandı.", "success");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.toLowerCase().includes("hatalı")) {
          show("Şifre hatalı veya veri bozuk.", "error");
        } else {
          show(err.message, "error");
        }
      } else {
        show("Çözme başarısız.", "error");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel panel-accent p-5">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-text">
            AES-256 şifreleme
          </h2>
          <p className="text-xs text-text-muted mt-1">
            AES-GCM 256-bit · PBKDF2 100k iter · Şifre tarayıcıdan çıkmaz
          </p>
        </div>
        <span className="text-[11px] font-mono text-accent shrink-0">
          AES-GCM-256
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ─────── ŞİFRELE ─────── */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-accent text-sm font-semibold">01.</span>
            <h3 className="text-sm font-semibold tracking-tight">Şifrele</h3>
          </div>

          <label className="block text-xs text-text-muted mb-1.5">
            Şifrelenecek metin
          </label>
          <textarea
            value={textToEncrypt}
            readOnly
            className="input min-h-[88px] text-xs font-mono"
            placeholder="Sol panelden bir çeviri üret veya düz metin seç."
          />
          <p className="text-[11px] text-text-dim mt-1">
            Aktif seviyedeki Leet çıktısı otomatik gelir.
          </p>

          {/* Şifre */}
          <label className="block text-xs text-text-muted mb-1.5 mt-4">
            Şifre (en az 6 karakter)
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-text-muted hover:text-text text-sm"
              aria-label={showPw ? "Gizle" : "Göster"}
            >
              {showPw ? "✕" : "·"}
            </button>
          </div>

          {/* Güç çubuğu */}
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-surface2 rounded overflow-hidden">
                <div
                  className="h-full transition-all duration-200"
                  style={{
                    width: `${(strength.score / 4) * 100}%`,
                    background: strength.color,
                  }}
                />
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
          )}

          <Button
            onClick={handleEncrypt}
            disabled={busy || !password || !textToEncrypt}
            variant="primary"
            size="md"
            className="w-full mt-4"
            icon={<span aria-hidden>↗</span>}
          >
            {busy && mode === "idle" ? "Şifreleniyor..." : "Şifrele"}
          </Button>

          {/* Şifreli çıktı */}
          {encrypted && (
            <div className="mt-4 space-y-2">
              <label className="block text-xs text-accent font-medium">
                Şifreli çıktı
              </label>
              <textarea
                value={encrypted}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                className="input min-h-[72px] text-[11px] font-mono break-all"
              />
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    await navigator.clipboard.writeText(encrypted);
                    show("Şifreli metin kopyalandı.", "success");
                  }}
                  variant="secondary"
                  size="sm"
                  icon={<span aria-hidden>⧉</span>}
                >
                  Kopyala
                </Button>
                <Button
                  onClick={() => {
                    downloadAsFile(encrypted, "encrypted.aes");
                    show("Şifreli dosya indirildi.", "success");
                  }}
                  variant="ghost"
                  size="sm"
                  icon={<span aria-hidden>↓</span>}
                >
                  İndir
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ─────── ÇÖZ ─────── */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-accent text-sm font-semibold">02.</span>
            <h3 className="text-sm font-semibold tracking-tight">Çöz</h3>
          </div>

          <label className="block text-xs text-text-muted mb-1.5">
            Şifreli metin
          </label>
          <textarea
            value={cipherInput}
            onChange={(e) => setCipherInput(e.target.value)}
            placeholder="Şifrelenmiş Base64 metni buraya yapıştır..."
            className="input min-h-[88px] text-[11px] font-mono break-all"
          />

          <label className="block text-xs text-text-muted mb-1.5 mt-4">
            Şifre
          </label>
          <div className="relative">
            <input
              type={showDecryptPw ? "text" : "password"}
              value={decryptPw}
              onChange={(e) => setDecryptPw(e.target.value)}
              placeholder="••••••••"
              className="input pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowDecryptPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-text-muted hover:text-text text-sm"
            >
              {showDecryptPw ? "✕" : "·"}
            </button>
          </div>

          <Button
            onClick={handleDecrypt}
            disabled={busy || !decryptPw || !cipherInput}
            variant="primary"
            size="md"
            className="w-full mt-4"
            icon={<span aria-hidden>↘</span>}
          >
            {busy && mode === "decrypt" ? "Çözülüyor..." : "Çöz"}
          </Button>

          {decryptedOutput && (
            <div className="mt-4 space-y-2">
              <label className="block text-xs text-emerald-400 font-medium">
                Çözülmüş metin
              </label>
              <textarea
                value={decryptedOutput}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                className="input min-h-[72px] text-xs font-mono break-words border-emerald-500/30"
              />
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    await navigator.clipboard.writeText(decryptedOutput);
                    show("Çözülmüş metin kopyalandı.", "success");
                  }}
                  variant="secondary"
                  size="sm"
                  icon={<span aria-hidden>⧉</span>}
                >
                  Kopyala
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-5 text-[11px] text-text-dim leading-relaxed">
        Şifren tarayıcında türetilir ve hiçbir yere gönderilmez. Şifreli metin
        Base64 ile kodlanır; doğru şifre olmadan kırılması pratikte imkânsızdır.
        Şifreni kaybedersen veri geri alınamaz.
      </p>
    </section>
  );
}
