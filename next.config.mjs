/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    // Remote patterns remain only as a migration fallback if a local asset has not been synced yet.
    remotePatterns: [
      { protocol: "https", hostname: "wheeltek.com.ph" },
      { protocol: "https", hostname: "mc.suzuki.com.ph" },
      { protocol: "https", hostname: "kawasakileisurebikes.ph" },
      { protocol: "https", hostname: "www.kawasakileisurebikes.ph" },
      { protocol: "https", hostname: "www.teamspyder.com" },
      { protocol: "https", hostname: "gbrands.ph" },
      { protocol: "https", hostname: "kranosgears.com" },
      { protocol: "https", hostname: "down-ph.img.susercontent.com" },
      { protocol: "https", hostname: "evohelmet.com" },
      { protocol: "https", hostname: "secmotosupply.com" },
      { protocol: "https", hostname: "teamgraphitee.com" },
      { protocol: "https", hostname: "www.tenplus.ph" },
      { protocol: "https", hostname: "dainese-cdn.thron.com" },
      { protocol: "https", hostname: "www.motoworld.com.ph" },
      { protocol: "https", hostname: "shop.motoworld.com.ph" },
      { protocol: "https", hostname: "shopmotoman.com" },
      { protocol: "https", hostname: "www.shoei-europe.com" },
      { protocol: "https", hostname: "easyr.com.au" },
      { protocol: "https", hostname: "tripleclampmoto.ca" },
      { protocol: "https", hostname: "azwecdnepstoragewebsiteuploads.azureedge.net" },
      { protocol: "https", hostname: "bxrepsol.s3.eu-west-1.amazonaws.com" },
      { protocol: "https", hostname: "carroemotos.com.br" },
      { protocol: "https", hostname: "cdn.accentuate.io" },
      { protocol: "https", hostname: "cdn.dealerspike.com" },
      { protocol: "https", hostname: "d1uzk9o9cg136f.cloudfront.net" },
      { protocol: "https", hostname: "editorial.pxcrush.net" },
      { protocol: "https", hostname: "globalgo-catalogo.s3.amazonaws.com" },
      { protocol: "https", hostname: "images.caradisiac.com" },
      { protocol: "https", hostname: "images.motoren-toerisme.be" },
      { protocol: "https", hostname: "images5.1000ps.net" },
      { protocol: "https", hostname: "img.autocarindia.com" },
      { protocol: "https", hostname: "img.autofun.co.th" },
      { protocol: "https", hostname: "img2.stcrm.it" },
      { protocol: "https", hostname: "imgcdn.zigwheels.ph" },
      { protocol: "https", hostname: "m.atcdn.co.uk" },
      { protocol: "https", hostname: "motowind.net" },
      { protocol: "https", hostname: "next-moto.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "www.bmwpap.gr" },
      { protocol: "https", hostname: "www.carolenash.com" },
      { protocol: "https", hostname: "www.ginzinger.at" },
      { protocol: "https", hostname: "www.goobike.com" },
      { protocol: "https", hostname: "www.kamote.ph" },
      { protocol: "https", hostname: "www.motociclismo.es" },
      { protocol: "https", hostname: "www.motofichas.com" },
      { protocol: "https", hostname: "www.motorrad-bilder.at" },
      { protocol: "https", hostname: "www.philharmonicmoto.com" },
      { protocol: "https", hostname: "www.xsmt.com" },
      { protocol: "https", hostname: "www.todocircuito.com" },
      { protocol: "https", hostname: "hondanews.eu" },
      { protocol: "https", hostname: "powersports.honda.com" },
      { protocol: "https", hostname: "cdn.riderly.com" }
    ]
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
