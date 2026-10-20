import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    // Yapılandırma ve dokümantasyon dosyaları lint dışı.
    // Bunlar TypeScript kaynağı değil.
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
      "*.tsbuildinfo",
      "public/**",
      ".github/**",
    ],
  },
  ...next,
  ...nextCoreWebVitals,
  {
    rules: {
      // Üretim kodunda console kullanımı uyarı: client-side uygulama,
      // kullanıcı verisi console'a sızmasın.
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default config;