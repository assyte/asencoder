"use client";

import { Language, LeetLevel } from "@/lib";
import { Button } from "./NeuButton";
import FileHandler from "./FileHandler";
import { useToast } from "./Toast";

interface TranslatorPanelProps {
  input: string;
  setInput: (v: string) => void;
  language: Language;
  setLanguage: (v: Language) => void;
  level: LeetLevel;
  setLevel: (v: LeetLevel) => void;
  onTranslate: () => void;
  onClear: () => void;
}

export default function TranslatorPanel({
  input,
  setInput,
  language,
  setLanguage,
  level,
  setLevel,
  onTranslate,
  onClear,
}: TranslatorPanelProps) {
  const { show } = useToast();
  const charCount = input.length;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  return (
    <section className="panel p-5">
      <header className="mb-4">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-sm font-semibold tracking-tight text-text">
            Metin girişi
          </h2>
          <span className="text-xs text-text-dim font-mono">
            {wordCount} kelime · {charCount} karakter
          </span>
        </div>
        <p className="text-xs text-text-muted">
          Düz metni gir, üç farklı zorlukta Leet çevirisi üretelim.
        </p>
      </header>

      {/* Dil seçimi */}
      <div className="mb-4">
        <span className="block text-xs font-medium text-text-muted mb-2">
          Kaynak dil
        </span>
        <div className="grid grid-cols-2 gap-2">
          <PillOption
            checked={language === "tr"}
            onChange={() => setLanguage("tr")}
            label="Türkçe"
            code="TR"
          />
          <PillOption
            checked={language === "en"}
            onChange={() => setLanguage("en")}
            label="English"
            code="EN"
          />
        </div>
      </div>

      {/* Seviye */}
      <div className="mb-4">
        <span className="block text-xs font-medium text-text-muted mb-2">
          Zorluk seviyesi
        </span>
        <div className="grid grid-cols-3 gap-2">
          <PillOption
            checked={level === "basic"}
            onChange={() => setLevel("basic")}
            label="Basit"
            desc="kolay okunur"
          />
          <PillOption
            checked={level === "medium"}
            onChange={() => setLevel("medium")}
            label="Orta"
            desc="dengeli"
          />
          <PillOption
            checked={level === "hard"}
            onChange={() => setLevel("hard")}
            label="Zor"
            desc="kaotik"
            accent
          />
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          language === "tr"
            ? "Merhaba dünya! Bu bir test mesajıdır."
            : "Hello world! This is a test message."
        }
        className="input min-h-[140px]"
        spellCheck={false}
      />

      {/* Footer: file + actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <FileHandler
          onLoad={(content, filename) => {
            setInput(content);
            show(`${filename} yüklendi (${content.length} karakter).`, "info");
          }}
        />

        <div className="flex items-center gap-2 ml-auto">
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
          >
            Temizle
          </Button>
          <Button
            onClick={onTranslate}
            variant="primary"
            size="md"
            disabled={!input.trim()}
            icon={<span aria-hidden>→</span>}
          >
            Leet&apos;e çevir
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------- tek seçenek ---------- */
function PillOption({
  checked,
  onChange,
  label,
  desc,
  code,
  accent,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  desc?: string;
  code?: string;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition ${
        checked
          ? "border-accent bg-accent/10 text-text shadow-[inset_0_0_0_1px_rgba(225,29,72,0.3)]"
          : "border-border bg-surface text-text-muted hover:border-border-strong hover:text-text"
      } ${accent && checked ? "" : ""}`}
    >
      <span className="text-sm font-medium leading-tight">{label}</span>
      {desc && (
        <span className="text-[11px] text-text-dim leading-tight">
          {desc}
        </span>
      )}
      {code && (
        <span className="text-[10px] font-mono text-text-dim tracking-wider">
          {code}
        </span>
      )}
    </button>
  );
}
