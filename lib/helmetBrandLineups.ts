export type HelmetBrandLineup = {
  brandSlug: string;
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: string;
  models: string[];
  note?: string;
};

// Brand-level lineup references are deliberately separate from verified MotoIndex
// product records. A name here means the model/family appears in the cited current
// brand or Philippine retail catalog; it does not create a price, certification or
// product-detail claim until that exact model is researched separately.
export const helmetBrandLineups: HelmetBrandLineup[] = [
  { brandSlug:"kyt", sourceLabel:"KYT current catalogue and Philippine retail references", sourceUrl:"https://shopee.ph/motopinas", checkedAt:"2026-08-26", models:["KX-1 Race GP","NZ-Race","R1R","R2R","TT-Revo","TT-Course","NF-R","TTR-Jet","D-City","Skyhawk","Ballistic Modular","R10","Kyoto Ranger 2.0"] },
  { brandSlug:"spyder", sourceLabel:"Team Spyder and Philippine retail catalogue references", sourceUrl:"https://shopee.ph/motopinas", checkedAt:"2026-08-26", models:["Force V2","Recon 2","Neo Icon","Neo Blade","Surge P S0 V2","Corsa PD S0 V3","Rogue+ PD S0 V2","Reboot 2","Icon","Blade","Shift+","Rogue+","Recon 2.0","Ace","NF1"] },
  { brandSlug:"gille", sourceLabel:"Gille Helmets official Philippine shop", sourceUrl:"https://shopee.ph/gillehelmets", checkedAt:"2026-08-26", models:["Phoenix A5009","Kerena FF007","GTS V1 135","Circuit FF012","Astral","Astral Pro","Vertix ILM-Z501","Celeste 873","Medusa 863","GVR-V1 172","Squadron YM-926","GXR SH-526","Inizio 833","Orion AF-10","Paragon AH-16"] },
  { brandSlug:"evo", sourceLabel:"EVO Helmets current product and Philippine retail catalogue references", sourceUrl:"https://evohelmet.com/product/", checkedAt:"2026-08-26", models:["M2","VXR-8000","Tourer 180° Flip","VXR-5000","SR-X","SR-09","TR-X","GT-Sport","GT-PRO","Riot II XT-300","Carbon","Tourer","GX-1","GSX3000 v2","DX-7"] },
  { brandSlug:"sec", sourceLabel:"SEC Motosupply current helmet catalogue", sourceUrl:"https://secmotosupply.com/collections/helmets", checkedAt:"2026-08-26", models:["Whirlwind","Surge","Dynasty","Windstorm V3","Odyssey","Sportgrade","ACE","Rise V2","Refined","Integra","Pilot 2025","Breach","Element"] },
  { brandSlug:"arai", sourceLabel:"Arai Europe current family reference", sourceUrl:"https://www.araihelmet.eu/", checkedAt:"2026-08-26", models:["RX-7V EVO","Quantic","Concept-XE","Tour-X5","SZ-R VAS","MX-V"] },
  { brandSlug:"hjc", sourceLabel:"HJC current road-helmet range", sourceUrl:"https://hjchelmets.eu/", checkedAt:"2026-08-26", models:["C10","i71","i31","F71","RPHA 12","RPHA 91"] },
  { brandSlug:"rook", sourceLabel:"Rook Philippine retail catalogue reference", sourceUrl:"https://teamgraphitee.com/?s=rook&post_type=product", checkedAt:"2026-08-26", models:["V152","V153","V155"] , note:"Availability changes frequently; MotoIndex keeps this brand noindex until at least two exact product records pass the normal verification threshold."},
  { brandSlug:"shoei", sourceLabel:"Shoei 2026 catalogue", sourceUrl:"https://www.shoei-europe.com/shop/media/pdf/df/a5/24/Shoei_Katalog_2026.pdf", checkedAt:"2026-08-26", models:["X-SPR Pro","NXR2","GT-Air 3","Neotec 3","J-Cruise 3","Glamster 06","Hornet-ADV 06","VFX-WR 06"] },
  { brandSlug:"zebra", sourceLabel:"Zebra Philippine retail catalogue references", sourceUrl:"https://kranosgears.com/search?q=zebra+helmet", checkedAt:"2026-08-26", models:["Atlas 2026","A113 Ritzy","Alistair 2024","Vortex","Z-88"] },
  { brandSlug:"hnj", sourceLabel:"HNJ Philippine retail catalogue references", sourceUrl:"https://kranosgears.com/search?q=hnj+helmet", checkedAt:"2026-08-26", models:["A119","983","818A","A607"] },
  { brandSlug:"agv", sourceLabel:"AGV current helmet catalogue", sourceUrl:"https://www.agv.com/im/en/sale/full-face/", checkedAt:"2026-08-26", models:["Pista GP RR","K1 S","K3","K6 S","K7","AX9","Tourmodular","Streetmodular","Eteres"] },
  { brandSlug:"mt", sourceLabel:"MT Helmets 2025 collection catalogue", sourceUrl:"https://mthelmets.com/files/MTHelmets-2025Catalogue.pdf", checkedAt:"2026-08-26", models:["Thunder 4 SV","Atom 2 SV","Stinger 2","Targo S","Braker SV","Streetfighter SV"] },
  { brandSlug:"bell", sourceLabel:"Bell Powersports current catalogue", sourceUrl:"https://www.bellhelmets.com/powersports/", checkedAt:"2026-08-26", models:["Qualifier DLX Mips","Custom 500","SRT-Modular","MX-9 ADV MIPS","Eliminator","Lithium MIPS","Race Star DLX Flex"] },
  { brandSlug:"shark", sourceLabel:"Shark Helmets current road range", sourceUrl:"https://www.shark-helmets.com/en", checkedAt:"2026-08-26", models:["Skwal i3","Spartan GT Pro","Spartan GT Pro Carbon","D-Skwal 3","Ridill 2","Aeron GP FIM"] },
  { brandSlug:"ls2", sourceLabel:"LS2 official current helmet manuals/catalogue", sourceUrl:"https://ls2helmets.com/manuals", checkedAt:"2026-08-26", models:["FF805 Thunder GP Pro","FF805 Thunder GP Aero","FF807 Dragon","FF811 Vector II Carbon","FF817 Challenger II","FF811 Vector II","FF818 Storm III","FF808 Stream II","FF820 Rapid III","FF901 Advant X Carbon","FF901 Advant X","FF910 Advant II","FF906 Advant","FF902 Scope II","FF908 Strobe II","OF601 Bob II Carbon","OF601 Bob II","OF603 Infinity II Carbon","OF603 Infinity II","OF618 Verso II","OF606 Drifter","OF620 Classy","OF600 Copter II","OF599 Spitfire II","OF558 Sphere Lux II","OF616 Airflow II","OF558 Sphere II","MX701 Explorer Carbon","MX701 Explorer","MX702 Pioneer II","MX703 X-Force Pro","MX703 X-Force","MX700 Subverter Evo II","MX708 Fast II","FF812 Kid","OF622 Funny II","MX437 Fast Evo II Mini"], note:"LS2 graphics and colorways stay as variants under the canonical helmet model unless a distinct model-level product specification exists." },
  { brandSlug:"nhk", sourceLabel:"NHK Helmet 2025 collection", sourceUrl:"https://nhkhelmet.com/full-face-helmet/", checkedAt:"2026-08-26", models:["GP R Tech Race","Terminator TT","GP R Tech Street","GP Prime","K5R","RX-9","Race Pro","Terminator 2V","TR-One 1V","TR-One 2V","S2 GP Pro Ultimate","S2 GP Pro","S2 GP","S1 GP Pro","GT Avenger Mark II","R1","R6","C1","N1 Max","N1 Elite","N2 Max","N2 Elite","Cross One"] },
  { brandSlug:"smk", sourceLabel:"SMK official current helmet catalogue", sourceUrl:"https://smkhelmets.com/", checkedAt:"2026-08-26", models:["Bionic Youth","Bionic Adult","Stellar","Stellar Sport","Nova","Retro","Typhoon","Agnar","Titan","Titan Carbon","Gullwing","Cygnus","Allterra","Ares","Laminar","Retro Jet","GTJ","Delta City","Delta Tour"], note:"Graphics such as Stellar K-Power or Titan Carbon graphic names are treated as variants of the canonical family where the core shell/product specification is shared." },
  { brandSlug:"alpinestars", sourceLabel:"Alpinestars official helmet catalogue", sourceUrl:"https://www.alpinestars.com/collections/helmets", checkedAt:"2026-08-26", models:["Supertech R10","Supertech M10","Supertech M8","SM5"], note:"R10 Element, Team and Arius plus M10 Era, Flood and Unite are graphics/variants under the canonical R10 or M10 entity, not separate MotoIndex pages." },];

export function getHelmetBrandLineup(brandSlug: string) {
  return helmetBrandLineups.find((item) => item.brandSlug === brandSlug);
}
