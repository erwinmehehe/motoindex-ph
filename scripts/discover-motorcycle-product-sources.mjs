const pages = [
  {
    id: "aprilia-tuareg-660",
    url: "https://www.aprilia.com/en_EN/models/tuareg/tuareg-660-parallel-twin-4-stroke-2025/",
    terms: ["tuareg", "660", "hailstorm", "tornado"]
  },
  {
    id: "honda-cbr150r",
    url: "https://www.hondaph.com/motorcycle/sports/cbr150r",
    terms: ["cbr150r", "cbr-150r", "cbr_150r"]
  }
];

const ua = "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)";
for (const page of pages) {
  console.log("\n###", page.id, page.url);
  try {
    const res = await fetch(page.url, { redirect:"follow", headers:{ "user-agent":ua, accept:"text/html,application/xhtml+xml" }});
    console.log("status", res.status, "final", res.url);
    const html = await res.text();
    const urls = new Set();
    for (const m of html.matchAll(/https?:[^"'<>\\s)]+/g)) {
      const u = m[0].replace(/&amp;/g,"&").replace(/\\u002F/g,"/");
      if (/\.(?:png|jpe?g|webp)(?:\?|$)/i.test(u)) urls.add(u);
    }
    for (const m of html.matchAll(/(?:src|href|content)=["']([^"']+\.(?:png|jpe?g|webp)(?:\?[^"']*)?)["']/gi)) {
      try { urls.add(new URL(m[1].replace(/&amp;/g,"&"), res.url).href); } catch {}
    }
    const scored=[...urls].map(url=>({
      url,
      score: page.terms.reduce((n,t)=>n+(url.toLowerCase().includes(t)?1:0),0)
    })).sort((a,b)=>b.score-a.score || a.url.localeCompare(b.url));
    for (const item of scored.slice(0,80)) console.log(item.score, item.url);
  } catch (e) {
    console.log("ERROR", e?.stack || e);
  }
}
