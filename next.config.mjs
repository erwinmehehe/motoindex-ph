/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // MotoIndex serves the public catalog through Cloudflare static assets. Keep Next's image optimizer disabled so public images never depend on the Worker request quota.
    unoptimized: true,
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
      { protocol: "https", hostname: "powersports.honda.com" },
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
      { source: "/motorcycles/yamaha/nmax-turbo", destination: "/motorcycles/yamaha/nmax-v3", permanent: true },
      // Consolidate helmet-type aliases into the canonical helmet authority page.
      { source: "/gear/helmets/open-face", destination: "/gear/helmets#open-face", permanent: true },
      { source: "/gear/helmets/adventure", destination: "/gear/helmets#adventure", permanent: true },
      { source: "/gear/helmets/dual-sport", destination: "/gear/helmets#adventure", permanent: true },
      { source: "/gear/helmets/dual-sport-adventure", destination: "/gear/helmets#adventure", permanent: true },
      { source: "/gear/helmets/off-road", destination: "/gear/helmets#off-road", permanent: true },
      { source: "/gear/helmets/motocross", destination: "/gear/helmets#off-road", permanent: true },
      // Consolidate keyword-shaped category aliases into the canonical authority pages.
      { source: "/recommendations/electric-scooters-philippines", destination: "/motorcycles/electric", permanent: true },
      { source: "/recommendations/best-electric-scooters-philippines", destination: "/motorcycles/electric", permanent: true },
      { source: "/recommendations/best-big-bikes-philippines", destination: "/recommendations/motorcycles-400cc-plus-philippines", permanent: true },
      { source: "/recommendations/big-bikes-philippines", destination: "/recommendations/motorcycles-400cc-plus-philippines", permanent: true },
      { source: "/recommendations/best-cruiser-philippines", destination: "/recommendations/cruiser-motorcycles-philippines", permanent: true },
      { source: "/recommendations/best-off-road-philippines", destination: "/recommendations/dual-sport-motorcycles-philippines", permanent: true },
      { source: "/recommendations/best-dual-sport-philippines", destination: "/recommendations/dual-sport-motorcycles-philippines", permanent: true },
      { source: "/recommendations/above-1000cc-philippines", destination: "/recommendations/motorcycles-1000cc-plus-philippines", permanent: true },
      { source: "/recommendations/below-40000-philippines", destination: "/recommendations/motorcycles-under-80k", permanent: true },
      { source: "/recommendations/40000-60000-philippines", destination: "/recommendations/motorcycles-under-80k", permanent: true },
      { source: "/recommendations/60000-80000-philippines", destination: "/recommendations/motorcycles-under-80k", permanent: true },
      { source: "/recommendations/80000-150000-philippines", destination: "/recommendations/motorcycles-under-150k", permanent: true },
      { source: "/recommendations/automatic-philippines", destination: "/recommendations/automatic-motorcycles-philippines", permanent: true },
      { source: "/recommendations/best-moped-philippines", destination: "/guides/moped-vs-scooter-underbone-philippines", permanent: true },
      // Route unsupported or non-catalog brand searches to source-backed market guides instead of 404/thin brand pages.
      { source: "/motorcycles/tvs", destination: "/guides/tvs-motorcycle-philippines", permanent: true },
      { source: "/motorcycles/tvs/ntorq-125", destination: "/guides/tvs-motorcycle-philippines", permanent: true },
      { source: "/motorcycles/lambretta", destination: "/guides/lambretta-price-philippines", permanent: true },
      { source: "/motorcycles/nwow", destination: "/guides/nwow-ebike-price-philippines", permanent: true },
      { source: "/motorcycles/skygo", destination: "/guides/skygo-motorcycle-price-philippines", permanent: true },
      { source: "/motorcycles/harley-davidson", destination: "/guides/harley-davidson-price-philippines", permanent: true },
      { source: "/motorcycles/hatasu", destination: "/guides/hatasu-ebike-price-philippines", permanent: true },
      { source: "/motorcycles/voge", destination: "/guides/voge-motorcycle-philippines", permanent: true },
      { source: "/motorcycles/italjet", destination: "/guides/italjet-price-philippines", permanent: true },
      { source: "/motorcycles/honda-cbr", destination: "/recommendations/honda-cbr-motorcycles-philippines", permanent: true },
      { source: "/motorcycles/loan", destination: "/tools/motorcycle-loan-calculator", permanent: true },
      { source: "/motorcycle-loan-calculator", destination: "/tools/motorcycle-loan-calculator", permanent: true },
      { source: "/tools/motorcycle-installment-calculator", destination: "/tools/motorcycle-loan-calculator", permanent: true },
      // Consolidate reverse-order comparison searches into one canonical URL per pair.
      { source: "/compare/nmax-v3-vs-aerox-v3", destination: "/compare/aerox-v3-vs-nmax-v3", permanent: true },
      { source: "/compare/nmax-v3-vs-pcx-160", destination: "/compare/pcx-160-vs-nmax-v3", permanent: true },
      { source: "/compare/giorno-plus-vs-fazzio", destination: "/compare/fazzio-vs-giorno-plus", permanent: true },
      { source: "/compare/click-160-vs-click-125i", destination: "/compare/click-125i-vs-click-160", permanent: true },
      { source: "/compare/fazzio-vs-click-125i", destination: "/compare/click-125i-vs-fazzio", permanent: true },
      { source: "/compare/aerox-v3-vs-pcx-160", destination: "/compare/pcx-160-vs-aerox-v3", permanent: true },
      { source: "/compare/xmax-vs-tmax", destination: "/compare/tmax-vs-xmax", permanent: true },
      { source: "/compare/cb650r-vs-z900", destination: "/compare/z900-vs-cb650r", permanent: true },
      { source: "/compare/smash-fi-vs-rs125", destination: "/compare/rs125-vs-smash-fi", permanent: true },
      { source: "/compare/z900-se-vs-z900", destination: "/compare/z900-vs-z900-se", permanent: true },
      // Canonical buying-guide hub is plural. Preserve singular links and typos with permanent redirects.
      { source: "/recommendation", destination: "/recommendations", permanent: true },
      { source: "/recommendation/:path*", destination: "/recommendations/:path*", permanent: true }
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
