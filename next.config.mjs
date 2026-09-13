/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
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
      { protocol: "https", hostname: "www.tenplus.ph" },
    ]
  },
  experimental: { optimizePackageImports: [] },
  async redirects() {
    return [
      // Consolidate thin derivative model routes into the stronger all-in-one model page.
      // This keeps price, specs, colors, financing, fit and ownership context together.
      { source: "/motorcycles/:make/:slug/price", destination: "/motorcycles/:make/:slug#price", permanent: true },
      { source: "/motorcycles/:make/:slug/specifications", destination: "/motorcycles/:make/:slug#specs", permanent: true },
      { source: "/motorcycles/:make/:slug/colors", destination: "/motorcycles/:make/:slug#colors", permanent: true },
      { source: "/motorcycles/:make/:slug/installment", destination: "/motorcycles/:make/:slug#installment", permanent: true },
      { source: "/motorcycles/:make/:slug/rider-fit", destination: "/motorcycles/:make/:slug#rider-fit", permanent: true },
      { source: "/motorcycles/:make/:slug/fuel-economy", destination: "/motorcycles/:make/:slug#fuel", permanent: true },
      { source: "/motorcycles/:make/:slug/ownership-cost", destination: "/motorcycles/:make/:slug#ownership", permanent: true },
      { source: "/motorcycles/:make/:slug/tire-size", destination: "/motorcycles/:make/:slug#tires-fitment", permanent: true },
      { source: "/motorcycles/:make/:slug/maintenance", destination: "/motorcycles/:make/:slug#maintenance", permanent: true },
      { source: "/motorcycles/:make/:slug/safety", destination: "/motorcycles/:make/:slug#safety", permanent: true },
      { source: "/motorcycles/:make/:slug/used-value", destination: "/motorcycles/:make/:slug#used", permanent: true },
      { source: "/motorcycles/:make/:slug/new-vs-used", destination: "/motorcycles/:make/:slug#used", permanent: true },
      // Generation-agnostic and variant search terms resolve to the family hub or current generation.
      { source: "/motorcycles/yamaha/aerox-155", destination: "/motorcycles/yamaha/aerox", permanent: true },
      { source: "/motorcycles/yamaha/aerox-sp", destination: "/motorcycles/yamaha/aerox-v3", permanent: true },
      { source: "/motorcycles/yamaha/nmax-155", destination: "/motorcycles/yamaha/nmax", permanent: true },
      { source: "/motorcycles/yamaha/nmax-2020", destination: "/motorcycles/yamaha/nmax-v2", permanent: true },
      { source: "/motorcycles/honda/click-v3", destination: "/motorcycles/honda/click-160", permanent: true },
      { source: "/motorcycles/honda/click-v2", destination: "/motorcycles/honda/click-150i", permanent: true },
      { source: "/motorcycles/yamaha/aerox-v4", destination: "/motorcycles/yamaha/aerox-v3", permanent: true },
      { source: "/motorcycles/yamaha/aerox-2025", destination: "/motorcycles/yamaha/aerox-v3", permanent: true },
      { source: "/motorcycles/yamaha/nmax-turbo", destination: "/motorcycles/yamaha/nmax-v3", permanent: true }
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
