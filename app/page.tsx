"use client";

import { useState, useEffect } from "react";
import { Language, LeetLevel, generateThreeVariations } from "@/lib";

import HackerBackground from "@/components/HackerBackground";
import { ToastProvider, useToast } from "@/components/Toast";
import TranslatorPanel from "@/components/TranslatorPanel";
import OutputPanel from "@/components/OutputPanel";
import CryptoPanel from "@/components/CryptoPanel";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

function Dashboard() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("tr");
  const [level, setLevel] = useState<LeetLevel>("medium");
  const [outputs, setOutputs] = useState<{
    basic: string;
    medium: string;
    hard: string;
  } | null>(null);

  const [cryptoMode, setCryptoMode] = useState<
    "idle" | "encrypt" | "decrypt"
  >("idle");
  const [decryptedOutput, setDecryptedOutput] = useState("");

  const [now, setNow] = useState<string>("");

  const { show } = useToast();

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setNow(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const handleTranslate = () => {
    if (!input.trim()) {
      show("Lütfen bir metin gir.", "error");
      return;
    }
    const result = generateThreeVariations(input, language);
    setOutputs(result);
    show("Üç varyasyon hazır.", "success");
  };

  const handleClear = () => {
    setInput("");
    setOutputs(null);
    show("Temizlendi.", "info");
  };

  // Şifreleme için kullanılacak metin
  const textToEncrypt =
    outputs && outputs[level] ? outputs[level] : input;

  return (
    <div className="relative min-h-screen">
      <HackerBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* ─── Başlık ─── */}
        <header className="mb-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-full overflow-hidden ring-1 ring-accent/30 ring-offset-2 ring-offset-bg bg-surface">
                <Image
                  src="/logo-character.png"
                  alt="asEncoder logo"
                  fill
                  priority
                  sizes="56px"
                  className="object-cover [filter:grayscale(1)_contrast(1.05)]"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tighter leading-tight">
                  <span className="text-text">as</span>
                  <span className="text-accent">Encoder</span>
                </h1>
                <p className="text-xs text-text-dim font-mono mt-0.5">
                  dev by assyte
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-text-dim">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dot-live" />
                ready
              </span>
              <span className="hidden md:inline tabular-nums">{now}</span>
              <ThemeToggle />
            </div>
          </div>

          <p className="mt-6 text-sm text-text-muted max-w-2xl leading-relaxed">
            Türkçe ve İngilizce metni Leet 1337&apos;ye üç farklı zorlukta
            çevir, AES-256 ile şifrele. Tüm işlem tarayıcında kalır.
          </p>
        </header>

        {/* ─── Ana ızgara ─── */}
        <main className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TranslatorPanel
              input={input}
              setInput={setInput}
              language={language}
              setLanguage={setLanguage}
              level={level}
              setLevel={setLevel}
              onTranslate={handleTranslate}
              onClear={handleClear}
            />

            <OutputPanel outputs={outputs} />
          </div>

          <CryptoPanel
            textToEncrypt={textToEncrypt}
            decryptedOutput={decryptedOutput}
            setDecryptedOutput={setDecryptedOutput}
            mode={cryptoMode}
            setMode={setCryptoMode}
          />
        </main>

        {/* ─── Footer ─── */}
        <footer className="mt-12 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-text-dim">
            <span>v1.0 · client-side only</span>
            <span className="opacity-60">
              AES-GCM-256 · PBKDF2 · Web Crypto API
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}

