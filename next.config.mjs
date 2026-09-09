/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    // Remote patterns remain only as a migration fallback if a local asset has not been synced yet.
    remotePatterns: [
      { protocol: "https", hostname: "bikeluggage.co.uk" },
      { protocol: "https", hostname: "cdn.aripitstop.com" },
      { protocol: "https", hostname: "cdn.awsli.com.br" },
      { protocol: "https", hostname: "cdn.idealo.com" },
      { protocol: "https", hostname: "cdn11.bigcommerce.com" },
      { protocol: "https", hostname: "dainese-cdn.thron.com" },
      { protocol: "https", hostname: "data.outletmoto.eu" },
      { protocol: "https", hostname: "down-ph.img.susercontent.com" },
      { protocol: "https", hostname: "easyr.com.au" },
      { protocol: "https", hostname: "evohelmet.com" },
      { protocol: "https", hostname: "gbrands.ph" },
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "kawasakileisurebikes.ph" },
      { protocol: "https", hostname: "kranosgears.com" },
      { protocol: "https", hostname: "kytasia.com" },
      { protocol: "https", hostname: "mc.suzuki.com.ph" },
      { protocol: "https", hostname: "motortrade.com.ph" },
      { protocol: "https", hostname: "platincdn.com" },
      { protocol: "https", hostname: "secmotosupply.com" },
      { protocol: "https", hostname: "shop.motoworld.com.ph" },
      { protocol: "https", hostname: "shopmotoman.com" },
      { protocol: "https", hostname: "teamgraphitee.com" },
      { protocol: "https", hostname: "tripleclampmoto.ca" },
      { protocol: "https", hostname: "vault.widen.net" },
      { protocol: "https", hostname: "wheeltek.com.ph" },
      { protocol: "https", hostname: "www.kawasakileisurebikes.ph" },
      { protocol: "https", hostname: "www.motoworld.com.ph" },
      { protocol: "https", hostname: "www.shoei-europe.com" },
      { protocol: "https", hostname: "www.teamspyder.com" },
      { protocol: "https", hostname: "www.tenplus.ph" },    ]
  },
  experimental: { optimizePackageImports: [] },
  async redirects() {
    return [
      // Generation-agnostic and variant search terms resolve to the family hub or
      // the current generation, rather than being published as separate models.
      // These are real query variants ("aerox 155", "nmax 2020", "click v3"), not
      // distinct motorcycles, so a redirect is honest where a page would not be.
      { source: "/motorcycles/yamaha/aerox-155", destination: "/motorcycles/yamaha/aerox", permanent: true },
      { source: "/motorcycles/yamaha/aerox-sp", destination: "/motorcycles/yamaha/aerox-v3", permanent: true },
      { source: "/motorcycles/yamaha/nmax-155", destination: "/motorcycles/yamaha/nmax", permanent: true },
      { source: "/motorcycles/yamaha/nmax-2020", destination: "/motorcycles/yamaha/nmax-v2", permanent: true },
      { source: "/motorcycles/honda/click-v3", destination: "/motorcycles/honda/click-160", permanent: true },
      { source: "/motorcycles/honda/click-v2", destination: "/motorcycles/honda/click-150i", permanent: true },
      {
        source: "/motorcycles/yamaha/aerox-v4",
        destination: "/motorcycles/yamaha/aerox-v3",
        permanent: true
      },
      {
        source: "/motorcycles/yamaha/aerox-2025",
        destination: "/motorcycles/yamaha/aerox-v3",
        permanent: true
      },
      {
        source: "/motorcycles/yamaha/nmax-turbo",
        destination: "/motorcycles/yamaha/nmax-v3",
        permanent: true
      }
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://plausible.io`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://plausible.io",
      ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
    ].join("; ");
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-DNS-Prefetch-Control", value: "off" },
        ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : [])
      ]
    }];
  }
};
export default nextConfig;
