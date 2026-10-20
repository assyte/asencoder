"use client";

import { useState } from "react";
import { LeetLevel } from "@/lib";
import { Button } from "./NeuButton";
import { downloadAsFile } from "./FileHandler";
import { useToast } from "./Toast";
import clsx from "clsx";

interface OutputPanelProps {
  outputs: { basic: string; medium: string; hard: string } | null;
}

const tabs: { id: LeetLevel; label: string; level: string }[] = [
  { id: "basic", label: "Basit", level: "01" },
  { id: "medium", label: "Orta", level: "02" },
  { id: "hard", label: "Zor", level: "03" },
];

export default function OutputPanel({ outputs }: OutputPanelProps) {
  const [active, setActive] = useState<LeetLevel>("medium");
  const { show } = useToast();

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      show(`${label} çıktısı panoya kopyalandı.`, "success");
    } catch {
      show("Kopyalama başarısız.", "error");
    }
  };

  if (!outputs) {
    return (
      <section className="panel p-5 min-h-[440px] flex flex-col">
        <header className="mb-4">
          <h2 className="text-sm font-semibold tracking-tight text-text">
            Leet çıktısı
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Üç farklı zorlukta varyasyon yan yana.
          </p>
        </header>
        <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-xl">
          <div className="text-center px-6">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-border-strong flex items-center justify-center text-text-dim">
              <span className="font-mono text-base">/</span>
            </div>
            <p className="text-sm text-text-muted">
              Henüz bir çeviri üretilmedi.
            </p>
            <p className="text-xs text-text-dim mt-1">
              Soldaki metin alanına bir şeyler yazıp &ldquo;Leet&apos;e çevir&rdquo;
              düğmesine bas.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const activeText = outputs[active];

  return (
    <section className="panel panel-accent p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-text">
            Leet çıktısı
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Üç farklı zorlukta varyasyon yan yana.
          </p>
        </div>
        <span className="text-[11px] font-mono text-accent">03 variations</span>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface rounded-lg border border-border mb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            data-active={active === t.id}
            onClick={() => setActive(t.id)}
            className={clsx("tab flex-1 flex items-center justify-center gap-2")}
          >
            <span className="font-mono text-[10px] text-text-dim">
              {t.level}
            </span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Çıktı */}
      <div className="relative">
        <textarea
          value={activeText}
          readOnly
          onClick={(e) => e.currentTarget.select()}
          className="input min-h-[150px] font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
        />
        <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-surface2 border border-border text-[10px] font-mono text-text-dim">
          {activeText.length} chars
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          onClick={() => handleCopy(activeText, tabs.find(t=>t.id===active)!.label)}
          variant="primary"
          size="sm"
          icon={<span aria-hidden>⧉</span>}
        >
          Kopyala
        </Button>
        <Button
          onClick={() => {
            const all = [
              "// basit",
              outputs.basic,
              "",
              "// orta",
              outputs.medium,
              "",
              "// zor",
              outputs.hard,
              "",
            ].join("\n");
            downloadAsFile(all, "leet-output.txt");
            show("Tek dosya olarak indirildi.", "success");
          }}
          variant="secondary"
          size="sm"
          icon={<span aria-hidden>↓</span>}
        >
          Tümünü indir
        </Button>
        <Button
          onClick={() => {
            downloadAsFile(outputs.basic, "leet-basit.txt");
            downloadAsFile(outputs.medium, "leet-orta.txt");
            downloadAsFile(outputs.hard, "leet-zor.txt");
            show("Üç ayrı dosya indirildi.", "success");
          }}
          variant="ghost"
          size="sm"
          icon={<span aria-hidden>↓</span>}
        >
          Ayrı dosyalar
        </Button>
      </div>

      {/* Comparison view */}
      <details className="mt-4 group">
        <summary className="flex items-center gap-2 text-xs text-text-muted hover:text-text cursor-pointer select-none list-none">
          <span className="inline-block transition group-open:rotate-90 text-[10px]">
            ▶
          </span>
          <span>Üçünü karşılaştır</span>
        </summary>
        <div className="mt-3 space-y-2">
          {(["basic", "medium", "hard"] as LeetLevel[]).map((lvl) => {
            const meta = tabs.find((t) => t.id === lvl)!;
            return (
              <div
                key={lvl}
                className="rounded-lg border border-border bg-surface overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface2">
                  <span className="text-[11px] font-mono text-text-muted">
                    {meta.level} · {meta.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(outputs[lvl], meta.label)}
                    className="text-[11px] text-text-muted hover:text-accent transition"
                  >
                    kopyala
                  </button>
                </div>
                <div className="px-3 py-2 font-mono text-xs text-text-secondary break-words max-h-24 overflow-auto leading-relaxed">
                  {outputs[lvl]}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </section>
  );
}
