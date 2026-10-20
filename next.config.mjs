/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // PNG görsellerimizi olduğu gibi servis et (geliştirmede sorunsuz).
    // zaten next/image optimizasyonu kullanmıyoruz: tüm görseller
    // `unoptimized` ve statik olarak sunuluyor.
    unoptimized: true,
  },

  // Bu uygulama tamamen istemci tarafında çalışır: şifreleme tarayıcının
  // Web Crypto API'si ile yapılır, hiçbir istek sunucuya gitmez.
  //
  // Bu yüzden sunucu katmanına ihtiyaç yok. Statik export:
  //   1. Sunucu tarafı saldırı yüzeyini tamamen kaldırır
  //      (Server Actions, middleware, RSC cache — hiçbiri var olmaz)
  //   2. Herhangi bir statik host'a deploy edilebilir:
  //      GitHub Pages, Cloudflare Pages, Netlify, Vercel, S3
  //   3. Vercel'de de çalışır — Next.js runtime'ı otomatik seçilir
  //
  // Not: `/` rotası statik olarak `out/index.html` üretir.
  output: "export",

  // Statik export'ta `next/image` yerel görselleri optimize edemez.
  // Görseller zaten küçültülmüş (bkz. PLAN.md → görsel optimizasyonu).
  trailingSlash: true,
};

export default nextConfig;