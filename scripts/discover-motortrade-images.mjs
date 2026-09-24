const pages = [
 ["avenis","https://motortrade.com.ph/motorcycles/suzuki-avenis/"],
 ["smash","https://motortrade.com.ph/motorcycles/suzuki-smash-fi/"],
 ["gixxer250","https://motortrade.com.ph/motorcycles/suzuki-gixxer-250-2/"],
 ["dr160","https://motortrade.com.ph/motorcycles/suzuki-dr160/"],
 ["burgman400","https://motortrade.com.ph/motorcycles/suzuki-burgman-400/"]
];
const UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153 Safari/537.36";
for(const [id,page] of pages){
  console.log("\n###",id,page);
  const res=await fetch(page,{redirect:"follow",headers:{"user-agent":UA,accept:"text/html,*/*"}});
  console.log("HTTP",res.status,res.url);
  const html=await res.text();
  const decoded=html.replaceAll("\\/","/");
  const urls=[...decoded.matchAll(/https?:\/\/[^"'<>\\s)]+/g)].map(m=>m[0].replaceAll("&amp;","&"));
  const images=[];
  for(let u of urls){
    u=u.replace(/[),.;]+$/,"");
    if(!/\.(?:png|jpe?g|webp)(?:\?|$)/i.test(u)) continue;
    if(/logo|icon|sprite|avatar|loading|placeholder|1x1/i.test(u)) continue;
    images.push(u);
  }
  for(const u of [...new Set(images)].slice(0,80)) console.log(u);
}
