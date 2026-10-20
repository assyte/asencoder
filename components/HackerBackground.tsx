"use client";

import Image from "next/image";

/**
 * Arka plan dekorasyonu:
 * - Sağ alt köşede kırmızıya boyanmış karakter görseli
 * - Köşelerde subtle kırmızı glow
 * - Hafif ızgara deseni
 * - Üst kenarda ince kırmızı çizgi
 * NOT: z-index 0, ana içerik z-10 — her zaman arka planda kalır.
 */
export default function HackerBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Üst kenarda ince çizgi */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      {/* Köşe glow'ları */}
      <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] bg-accent/[0.07] rounded-full blur-3xl" />

      {/* Hafif ızgara */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Sol üst köşe — küçük, dikey, dönük */}
      <div className="absolute -left-24 top-32 w-80 h-[28rem] opacity-30 [mask-image:radial-gradient(ellipse_at_left,black_30%,transparent_72%)]">
        <div className="relative w-full h-full -rotate-6">
          <Image
            src="/bg-character.png"
            alt=""
            fill
            priority
            sizes="320px"
            className="object-contain [filter:grayscale(1)_contrast(1.1)_sepia(1)_hue-rotate(330deg)_saturate(4)_brightness(0.7)]"
          />
        </div>
      </div>

      {/* Sağ alt köşe — büyük, ana figür */}
      <div className="absolute -right-32 -bottom-24 w-[44rem] h-[44rem] opacity-50 [mask-image:radial-gradient(circle_at_75%_75%,black_35%,transparent_72%)]">
        <div className="relative w-full h-full">
          <Image
            src="/bg-character.png"
            alt=""
            fill
            priority
            sizes="704px"
            className="object-contain [filter:grayscale(1)_contrast(1.15)_sepia(1)_hue-rotate(330deg)_saturate(4)_brightness(0.85)]"
          />
        </div>
      </div>

      {/* Üst kenarda hareketli tarama çizgisi */}
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent animate-[scan_8s_ease-in-out_infinite]" />
      </div>

      {/* Sadece içeriği okunabilir kılmak için üst-alt yumuşak karartma */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
