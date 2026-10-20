/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // PNG görsellerimizi olduğu gibi servis et (geliştirmede sorunsuz)
    unoptimized: true,
  },
};

export default nextConfig;
