"use client";

import { ChangeEvent, useRef } from "react";

interface FileHandlerProps {
  /** Yüklenen dosyanın içeriği. */
  onLoad: (content: string, filename: string) => void;
  /** İndirme butonu için; null ise buton gizlenir. */
  download?: { getText: () => string; filename: string } | null;
}

/**
 * `.txt` dosyası yükleme + indirme bileşeni.
 *
 * Not: `<input type="file">` gizli tutulur ve bir `<label>` ile
 * tetiklenir — erişilebilirliği bozmadan buton görünümü verir.
 */
export default function FileHandler({ onLoad, download }: FileHandlerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1 MB üzeri dosyaları reddet (tarayıcıyı kilitlememek için)
    if (file.size > 1_000_000) {
      alert("Dosya çok büyük. En fazla 1 MB olabilir.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = (ev.target?.result as string) || "";
      onLoad(content, file.name);
    };
    reader.readAsText(file, "utf-8");
    // Aynı dosya tekrar seçilebilsin
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2">
      <label className="cursor-pointer">
        <input
          ref={inputRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFile}
          className="sr-only"
          aria-label="Metin dosyası yükle"
        />
        <span className="btn btn-secondary">
          <span aria-hidden>↥</span>
          Dosya yükle
        </span>
      </label>

      {download && (
        <button
          type="button"
          onClick={() => downloadAsFile(download.getText(), download.filename)}
          className="btn btn-secondary"
        >
          <span aria-hidden>↧</span>
          İndir
        </button>
      )}
    </div>
  );
}

/**
 * Metni dosya olarak indirir (tarayıcıda Blob + geçici anchor).
 */
export function downloadAsFile(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}