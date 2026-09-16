type Props = {
  slug: string;
  title: string;
  kicker?: string;
  compact?: boolean;
};

type ArtKind = "budget" | "scooter" | "abs" | "fuel" | "fit" | "commute" | "touring" | "underbone" | "sport" | "dual" | "classic" | "helmet-fit" | "helmet-cert" | "electric" | "motorcycle";

function artKind(slug: string, title: string): ArtKind {
  const value = `${slug} ${title}`.toLowerCase();
  if (value.includes("helmet") && (value.includes("size") || value.includes("fit"))) return "helmet-fit";
  if (value.includes("helmet") && (value.includes("certification") || value.includes("icc") || value.includes("ece"))) return "helmet-cert";
  if (value.includes("electric") || value.includes("e-bike")) return "electric";
  if (value.includes("abs")) return "abs";
  if (value.includes("fuel") || value.includes("economy")) return "fuel";
  if (value.includes("short rider") || value.includes("lightweight") || value.includes("beginner")) return "fit";
  if (value.includes("commute") || value.includes("daily")) return "commute";
  if (value.includes("long ride") || value.includes("touring") || value.includes("adventure") || value.includes("400cc")) return "touring";
  if (value.includes("underbone")) return "underbone";
  if (value.includes("dual-sport") || value.includes("dual sport") || value.includes("trail")) return "dual";
  if (value.includes("ninja") || value.includes("sport motorcycle")) return "sport";
  if (value.includes("cafe racer") || value.includes("classic") || value.includes("retro")) return "classic";
  if (value.includes("scooter") || value.includes("mio")) return "scooter";
  if (value.includes("100k") || value.includes("150k") || value.includes("budget") || value.includes("affordable")) return "budget";
  return "motorcycle";
}

const themes: Record<ArtKind, { label: string; accent: string; secondary: string; micro: string }> = {
  budget: { label: "BUY SMART", accent: "#FDB022", secondary: "#F79009", micro: "PRICE · VALUE · FIT" },
  scooter: { label: "SCOOTERS", accent: "#7A5AF8", secondary: "#444CE7", micro: "CITY · AUTOMATIC · DAILY" },
  abs: { label: "ABS", accent: "#12B76A", secondary: "#039855", micro: "BRAKING · VARIANTS · VERIFY" },
  fuel: { label: "FUEL / RANGE", accent: "#12B76A", secondary: "#FDB022", micro: "KM/L · TANK · RANGE" },
  fit: { label: "RIDER FIT", accent: "#7A5AF8", secondary: "#12B76A", micro: "SEAT · WEIGHT · REACH" },
  commute: { label: "CITY COMMUTE", accent: "#444CE7", secondary: "#12B76A", micro: "TRAFFIC · COST · DAILY" },
  touring: { label: "LONG RIDE", accent: "#FDB022", secondary: "#7A5AF8", micro: "RANGE · TANK · COMFORT" },
  underbone: { label: "UNDERBONE", accent: "#F04438", secondary: "#FDB022", micro: "LIGHT · MANUAL · DAILY" },
  sport: { label: "SPORT", accent: "#F04438", secondary: "#7A5AF8", micro: "POWER · WEIGHT · BRAKES" },
  dual: { label: "DUAL SPORT", accent: "#12B76A", secondary: "#FDB022", micro: "ROAD · TRAIL · CLEARANCE" },
  classic: { label: "MODERN CLASSIC", accent: "#FDB022", secondary: "#B54708", micro: "STYLE · FIT · SPECS" },
  "helmet-fit": { label: "HELMET FIT", accent: "#7A5AF8", secondary: "#12B76A", micro: "MEASURE · MATCH · CHECK" },
  "helmet-cert": { label: "PS · ICC · ECE", accent: "#12B76A", secondary: "#444CE7", micro: "MARKS · MODEL · VERIFY" },
  electric: { label: "ELECTRIC", accent: "#12B76A", secondary: "#444CE7", micro: "BATTERY · RANGE · CHARGE" },
  motorcycle: { label: "BUYING GUIDE", accent: "#444CE7", secondary: "#7A5AF8", micro: "PRICE · SPECS · OWNERSHIP" },
};

function Motorcycle({ accent = "#7A5AF8", secondary = "#12B76A", sport = false }: { accent?: string; secondary?: string; sport?: boolean }) {
  return <g transform="translate(690 205)">
    <circle cx="120" cy="230" r="72" fill="#0B1220" stroke="#E2E8F0" strokeWidth="20"/>
    <circle cx="430" cy="230" r="72" fill="#0B1220" stroke="#E2E8F0" strokeWidth="20"/>
    <circle cx="120" cy="230" r="22" fill={accent}/><circle cx="430" cy="230" r="22" fill={accent}/>
    <path d="M170 222h104l66-114h88l54 116" fill="none" stroke="#F8FAFC" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
    <path d={sport ? "M235 125h158c32 0 58 20 67 49l-16 16H260z" : "M230 128h136c36 0 63 23 74 54l-22 18H260z"} fill={accent}/>
    <path d="M280 126l-47-70h-51" fill="none" stroke="#CBD5E1" strokeWidth="18" strokeLinecap="round"/>
    <path d="M381 111l28-61h63" fill="none" stroke="#CBD5E1" strokeWidth="18" strokeLinecap="round"/>
    <path d="M250 202l-72-96h-66" fill="none" stroke={secondary} strokeWidth="16" strokeLinecap="round"/>
    {sport && <path d="M446 76h70M470 104h82M496 132h70" stroke={secondary} strokeWidth="10" strokeLinecap="round" opacity=".8"/>}
  </g>;
}

function Scooter({ accent, secondary }: { accent: string; secondary: string }) {
  return <g transform="translate(700 202)">
    <circle cx="115" cy="235" r="68" fill="#0B1220" stroke="#E2E8F0" strokeWidth="19"/>
    <circle cx="420" cy="235" r="68" fill="#0B1220" stroke="#E2E8F0" strokeWidth="19"/>
    <circle cx="115" cy="235" r="20" fill={accent}/><circle cx="420" cy="235" r="20" fill={accent}/>
    <path d="M164 217h118c17 0 33-8 43-22l50-69h58l45 93" fill="none" stroke="#F8FAFC" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M236 153h130c30 0 51 17 66 52l-32 21H247z" fill={accent}/>
    <path d="M380 126l18-73h70" fill="none" stroke="#CBD5E1" strokeWidth="18" strokeLinecap="round"/>
    <path d="M291 153l-35-64h-66" fill="none" stroke={secondary} strokeWidth="16" strokeLinecap="round"/>
    <path d="M250 230h91" stroke={secondary} strokeWidth="12" strokeLinecap="round"/>
  </g>;
}

function Helmet({ accent, certification = false }: { accent: string; certification?: boolean }) {
  return <g transform="translate(735 126)">
    <path d="M110 88c41-48 111-74 184-61 91 16 157 95 157 187v68c0 27-22 49-49 49H286l-35-69H101c-24 0-44-20-44-44 0-52 17-96 53-130z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="18"/>
    <path d="M93 142c51-43 115-59 185-47 54 9 102 37 137 80H230c-49 0-92-12-137-33z" fill={accent}/>
    <path d="M258 260h145" stroke="#0B1220" strokeWidth="18" strokeLinecap="round" opacity=".55"/>
    {certification ? <g transform="translate(286 306)"><path d="M73 0l67 24v54c0 58-34 102-67 122C40 180 6 136 6 78V24z" fill="#12B76A"/><path d="M42 82l24 25 42-51" fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/></g> : <g><path d="M42 63c67-33 168-36 236-3" fill="none" stroke="#FDB022" strokeWidth="11" strokeLinecap="round" strokeDasharray="14 14"/><circle cx="42" cy="63" r="9" fill="#FDB022"/><circle cx="278" cy="60" r="9" fill="#FDB022"/></g>}
  </g>;
}

function BrakeDisc({ accent }: { accent: string }) {
  return <g transform="translate(785 170)">
    <circle cx="180" cy="180" r="135" fill="#111827" stroke="#CBD5E1" strokeWidth="24"/>
    <circle cx="180" cy="180" r="82" fill="none" stroke={accent} strokeWidth="24" strokeDasharray="22 16"/>
    <circle cx="180" cy="180" r="34" fill="#0B1220" stroke="#E2E8F0" strokeWidth="13"/>
    <path d="M255 88h72c28 0 51 23 51 51v83c0 28-23 51-51 51h-45l-26-47z" fill={accent}/>
    <text x="180" y="188" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="900" fill="#F8FAFC">ABS</text>
  </g>;
}

function FuelGauge({ accent, secondary }: { accent: string; secondary: string }) {
  return <g transform="translate(765 145)">
    <path d="M100 315a160 160 0 01320 0" fill="none" stroke="#334155" strokeWidth="34" strokeLinecap="round"/>
    <path d="M100 315a160 160 0 01164-160" fill="none" stroke={accent} strokeWidth="34" strokeLinecap="round"/>
    <path d="M264 315l78-109" stroke="#F8FAFC" strokeWidth="16" strokeLinecap="round"/>
    <circle cx="264" cy="315" r="24" fill={secondary}/>
    <path d="M440 120h74c25 0 46 21 46 46v162h-166V166c0-25 21-46 46-46z" fill="#F8FAFC" opacity=".95"/>
    <rect x="421" y="153" width="112" height="66" rx="12" fill="#0B1220"/>
    <path d="M520 140l46 45v66" fill="none" stroke={secondary} strokeWidth="15" strokeLinecap="round"/>
  </g>;
}

function City({ accent, secondary }: { accent: string; secondary: string }) {
  return <g transform="translate(685 105)">
    <rect x="32" y="158" width="88" height="252" rx="8" fill="#1E293B"/>
    <rect x="132" y="105" width="110" height="305" rx="8" fill="#334155"/>
    <rect x="256" y="188" width="95" height="222" rx="8" fill="#1E293B"/>
    <rect x="366" y="130" width="124" height="280" rx="8" fill="#334155"/>
    {[64,94,164,194,286,316,402,432].map((x,i)=><rect key={x} x={x} y={205+(i%2)*38} width="18" height="34" rx="4" fill={i%2?secondary:accent} opacity=".8"/>)}
    <path d="M0 458h555" stroke="#94A3B8" strokeWidth="18" strokeLinecap="round"/>
    <path d="M20 462h495" stroke="#F8FAFC" strokeWidth="5" strokeDasharray="26 22"/>
    <g transform="translate(210 285) scale(.58)"><Scooter accent={accent} secondary={secondary}/></g>
  </g>;
}

function Touring({ accent, secondary }: { accent: string; secondary: string }) {
  return <g transform="translate(670 105)">
    <path d="M0 330L130 170l90 84 95-143 168 219z" fill="#1E293B"/>
    <path d="M53 330l77-95 90 84 95-143 115 154z" fill="#334155"/>
    <path d="M228 420c28-88 73-137 132-149 64-13 120 19 164 111" fill="none" stroke="#F8FAFC" strokeWidth="52" strokeLinecap="round"/>
    <path d="M228 420c28-88 73-137 132-149 64-13 120 19 164 111" fill="none" stroke={secondary} strokeWidth="5" strokeDasharray="24 22"/>
    <g transform="translate(215 215) scale(.58)"><Motorcycle accent={accent} secondary={secondary}/></g>
  </g>;
}

function FitMeter({ accent, secondary }: { accent: string; secondary: string }) {
  return <g transform="translate(710 120)">
    <path d="M250 60h210" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round"/>
    {[0,1,2,3,4,5].map(i=><path key={i} d={`M${270+i*34} 40v40`} stroke={i%2?secondary:accent} strokeWidth="8" strokeLinecap="round"/>)}
    <rect x="94" y="228" width="355" height="86" rx="40" fill={accent}/>
    <path d="M160 228l70-115h132l70 115" fill="none" stroke="#F8FAFC" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="145" cy="374" r="69" fill="#0B1220" stroke="#E2E8F0" strokeWidth="19"/>
    <circle cx="430" cy="374" r="69" fill="#0B1220" stroke="#E2E8F0" strokeWidth="19"/>
    <path d="M520 98v300" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" opacity=".8"/>
    {[126,178,230,282,334,386].map(y=><path key={y} d={`M500 ${y}h40`} stroke={secondary} strokeWidth="8" strokeLinecap="round"/>)}
  </g>;
}

function Electric({ accent, secondary }: { accent: string; secondary: string }) {
  return <g transform="translate(700 150)">
    <rect x="58" y="78" width="300" height="226" rx="42" fill="#F8FAFC"/>
    <rect x="94" y="116" width="228" height="150" rx="24" fill="#0B1220" stroke={accent} strokeWidth="12"/>
    <path d="M226 132l-54 86h54l-28 64 90-105h-58l34-45z" fill={secondary}/>
    <rect x="360" y="144" width="44" height="96" rx="16" fill="#F8FAFC"/>
    <path d="M476 88v205" stroke="#F8FAFC" strokeWidth="24" strokeLinecap="round"/>
    <path d="M446 98h60M446 145h60" stroke={accent} strokeWidth="15" strokeLinecap="round"/>
    <path d="M476 294c0 56-44 92-96 92h-42" fill="none" stroke={secondary} strokeWidth="14" strokeLinecap="round"/>
  </g>;
}

function Underbone({ accent, secondary }: { accent: string; secondary: string }) {
  return <g transform="translate(690 205)">
    <circle cx="120" cy="228" r="69" fill="#0B1220" stroke="#E2E8F0" strokeWidth="19"/>
    <circle cx="430" cy="228" r="69" fill="#0B1220" stroke="#E2E8F0" strokeWidth="19"/>
    <path d="M170 215h107l63-100h104l38 103" fill="none" stroke="#F8FAFC" strokeWidth="26" strokeLinecap="round"/>
    <path d="M254 136h146l-37 82H247z" fill={accent}/>
    <path d="M315 136l-60-63h-71" stroke={secondary} strokeWidth="15" strokeLinecap="round"/>
    <path d="M410 116l25-67h51" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round"/>
  </g>;
}

function Scene({ kind, accent, secondary }: { kind: ArtKind; accent: string; secondary: string }) {
  if (kind === "helmet-fit") return <Helmet accent={accent}/>;
  if (kind === "helmet-cert") return <Helmet accent={accent} certification/>;
  if (kind === "abs") return <BrakeDisc accent={accent}/>;
  if (kind === "fuel") return <FuelGauge accent={accent} secondary={secondary}/>;
  if (kind === "fit") return <FitMeter accent={accent} secondary={secondary}/>;
  if (kind === "commute") return <City accent={accent} secondary={secondary}/>;
  if (kind === "touring") return <Touring accent={accent} secondary={secondary}/>;
  if (kind === "electric") return <Electric accent={accent} secondary={secondary}/>;
  if (kind === "underbone") return <Underbone accent={accent} secondary={secondary}/>;
  if (kind === "scooter") return <Scooter accent={accent} secondary={secondary}/>;
  if (kind === "sport") return <Motorcycle accent={accent} secondary={secondary} sport/>;
  if (kind === "dual") return <Touring accent={accent} secondary={secondary}/>;
  if (kind === "classic") return <Motorcycle accent={accent} secondary={secondary}/>;
  return <Motorcycle accent={accent} secondary={secondary}/>;
}

export function GuideFeaturedArt({ slug, title, kicker = "MotoIndex guide", compact = false }: Props) {
  const kind = artKind(slug, title);
  const theme = themes[kind];
  const safeId = slug.replace(/[^a-z0-9]/gi, "").slice(0, 28) || "guide";
  const radius = compact ? 18 : 28;
  return <div style={{ width: "100%", aspectRatio: "1200 / 630", overflow: "hidden", borderRadius: radius, background: "#0B1220", border: "1px solid rgba(148,163,184,.18)" }} aria-label={`${title} featured graphic`}>
    <svg viewBox="0 0 1200 630" role="img" aria-labelledby={`title-${safeId} desc-${safeId}`} style={{ display: "block", width: "100%", height: "100%" }}>
      <title id={`title-${safeId}`}>{title}</title>
      <desc id={`desc-${safeId}`}>MotoIndex editorial artwork for {title}, visually themed to the guide topic.</desc>
      <defs>
        <linearGradient id={`bg-${safeId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#08111F"/>
          <stop offset=".58" stopColor="#111C31"/>
          <stop offset="1" stopColor="#1B2340"/>
        </linearGradient>
        <radialGradient id={`glow-${safeId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={theme.accent} stopOpacity=".35"/>
          <stop offset="1" stopColor={theme.accent} stopOpacity="0"/>
        </radialGradient>
        <pattern id={`grid-${safeId}`} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="#94A3B8" strokeOpacity=".08" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="1200" height="630" rx={radius} fill={`url(#bg-${safeId})`}/>
      <rect width="1200" height="630" rx={radius} fill={`url(#grid-${safeId})`}/>
      <circle cx="940" cy="305" r="310" fill={`url(#glow-${safeId})`}/>
      <circle cx="1110" cy="80" r="130" fill={theme.secondary} opacity=".12"/>
      <circle cx="100" cy="570" r="180" fill={theme.accent} opacity=".08"/>

      <g transform="translate(64 58)">
        <rect width="50" height="50" rx="15" fill={theme.accent}/>
        <path d="M12 37V14h7l6 10 6-10h7v23h-7V25l-6 10-6-10v12z" fill="#fff"/>
        <text x="66" y="32" fill="#F8FAFC" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="800">MotoIndex PH</text>
        <text x="66" y="51" fill="#94A3B8" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="700" letterSpacing="2.2">EDITORIAL RESEARCH</text>
      </g>

      <g transform="translate(66 178)">
        <rect x="0" y="0" width="180" height="34" rx="17" fill={theme.accent} opacity=".16"/>
        <text x="16" y="23" fill={theme.accent} fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="900" letterSpacing="1.8">{kicker.toUpperCase().slice(0, 24)}</text>
        <text x="0" y="106" fill="#F8FAFC" fontFamily="Arial, Helvetica, sans-serif" fontSize="60" fontWeight="900" letterSpacing="-2">{theme.label}</text>
        <text x="0" y="148" fill="#CBD5E1" fontFamily="Arial, Helvetica, sans-serif" fontSize="17" fontWeight="700" letterSpacing="2">{theme.micro}</text>
      </g>

      <g transform="translate(66 468)">
        <rect width="520" height="92" rx="24" fill="#FFFFFF" fillOpacity=".055" stroke="#FFFFFF" strokeOpacity=".1"/>
        <text x="24" y="34" fill="#94A3B8" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="800" letterSpacing="1.6">PHILIPPINE MOTORCYCLE RESEARCH</text>
        <text x="24" y="65" fill="#F8FAFC" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="800">Price, specs and buyer context in one place</text>
      </g>

      <Scene kind={kind} accent={theme.accent} secondary={theme.secondary}/>
      <path d="M602 92v446" stroke="#FFFFFF" strokeOpacity=".08" strokeWidth="1"/>
    </svg>
  </div>;
}
