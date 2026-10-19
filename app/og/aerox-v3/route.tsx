import { ImageResponse } from "next/og";

// Photo-free artwork: we do not republish dealer-reference motorcycle imagery
// without confirming separate marketing-use rights.
export const runtime = "nodejs";
export const revalidate = 86400;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "linear-gradient(135deg, #F7F8FF 0%, #EEF1FC 100%)",
          color: "#0F172A",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 8, background: "#444CE7" }} />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: 300, top: -360, left: 795, background: "#E5E0FF" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: 150, top: 252, left: 990, background: "#E2F5EC" }} />

        <div style={{ position: "absolute", left: 65, top: 52, display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 15,
              background: "linear-gradient(135deg, #444CE7, #7A5AF8)",
              color: "#FFFFFF",
              fontSize: 37,
              fontWeight: 900
            }}
          >
            M
            <div style={{ position: "absolute", width: 9, height: 9, borderRadius: 5, top: 11, right: 9, background: "#12B76A" }} />
          </div>
          <div style={{ marginLeft: 14, fontSize: 35, fontWeight: 900, letterSpacing: -1, color: "#0F172A" }}>
            MotoIndex
          </div>
          <div style={{ marginLeft: 13, padding: "6px 10px", borderRadius: 10, background: "#E4F8EE", color: "#079A59", fontSize: 17, fontWeight: 800 }}>
            PH
          </div>
        </div>

        <div style={{ position: "absolute", left: 67, top: 182, fontSize: 23, fontWeight: 800, letterSpacing: 3, color: "#444CE7" }}>
          YAMAHA / PHILIPPINES
        </div>
        <div style={{ position: "absolute", left: 61, top: 224, fontSize: 87, fontWeight: 900, letterSpacing: -4, color: "#0F172A" }}>
          AEROX V3
        </div>
        <div style={{ position: "absolute", left: 67, top: 337, fontSize: 25, fontWeight: 800, color: "#475569" }}>
          2026 PRICE &amp; VARIANT GUIDE
        </div>
        <div style={{ position: "absolute", left: 68, top: 388, fontSize: 23, color: "#64748B" }}>
          Standard vs SP · 155cc
        </div>
        <div style={{ position: "absolute", left: 67, top: 433, width: 505, height: 2, background: "#CBD5E1" }} />
        <div style={{ position: "absolute", left: 67, top: 459, fontSize: 19, color: "#475569" }}>
          Compare prices, specs &amp; financing.
        </div>

        <div
          style={{
            position: "absolute",
            left: 640,
            top: 150,
            width: 510,
            height: 378,
            background: "#101828",
            borderRadius: 30,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ position: "absolute", left: 313, top: -122, width: 380, height: 380, borderRadius: 190, background: "#242A61" }} />
          <div style={{ position: "absolute", left: 332, top: 165, width: 230, height: 230, borderRadius: 115, border: "15px solid #333A81" }} />
          <div style={{ position: "absolute", left: 398, top: 205, width: 93, height: 93, borderRadius: 47, border: "9px solid #087F5D" }} />
          <div style={{ position: "absolute", left: 442, top: 196, width: 15, height: 113, background: "#7A5AF8", transform: "rotate(-40deg)", opacity: 0.7 }} />
          <div style={{ position: "absolute", left: 33, top: 31, padding: "11px 18px", borderRadius: 12, background: "#323E5E", color: "#E3E9F8", fontSize: 16, letterSpacing: 1, fontWeight: 800 }}>
            PUBLISHED PH PRICE RANGE
          </div>
          <div style={{ position: "absolute", left: 36, top: 103, fontSize: 54, fontWeight: 900, letterSpacing: -2, color: "#FFFFFF" }}>
            ₱125,900
          </div>
          <div style={{ position: "absolute", left: 36, top: 186, fontSize: 51, fontWeight: 900, letterSpacing: -2, color: "#FFFFFF" }}>
            to ₱163,900
          </div>
          <div style={{ position: "absolute", left: 36, top: 270, height: 2, width: 420, background: "#485571" }} />
          <div style={{ position: "absolute", left: 36, top: 294, fontSize: 19, fontWeight: 700, color: "#D6DEEE" }}>
            Standard to SP · Checked 25 Aug 2026
          </div>
          <div style={{ position: "absolute", left: 36, top: 330, fontSize: 16, color: "#AEB9CD" }}>
            Final dealer quotes and fees may vary.
          </div>
        </div>

        <div style={{ position: "absolute", left: 67, top: 552, width: 24, height: 6, borderRadius: 3, background: "#12B76A" }} />
        <div style={{ position: "absolute", left: 104, top: 542, fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
          MOTORCYCLE PRICES · SPECS · OWNERSHIP
        </div>
        <div style={{ position: "absolute", left: 67, top: 586, fontSize: 19, color: "#64748B" }}>
          motoindexph.com/motorcycles/yamaha/aerox-v3
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" }
    }
  );
}
