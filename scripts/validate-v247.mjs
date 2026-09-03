import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const exists=(p)=>fs.existsSync(path.join(root,p));
const need=(p,tokens)=>{ if(!exists(p)){errors.push(`${p} missing`);return;} const s=read(p); for(const t of tokens) if(!s.includes(t)) errors.push(`${p} missing ${t}`); };
const forbid=(p,tokens)=>{if(!exists(p))return; const s=read(p); for(const t of tokens) if(s.includes(t)) errors.push(`${p} must not contain ${t}`);};

const pkg=JSON.parse(read('package.json'));
const parts=String(pkg.version).split('.').map(Number);
if(!(parts[0]===2 && (parts[1]>4 || (parts[1]===4 && parts[2]>=7)))) errors.push(`package version must be v2.4.7+ within v2, found ${pkg.version}`);
need('package.json',['"validate:v247": "node scripts/validate-v247.mjs"','check:affiliate-build','@next/env@15.5.24']);

need('app/layout.tsx',['./globals.css','./research-ux.css','./v247.css']);
const layout=read('app/layout.tsx');
if(!(layout.indexOf('./v247.css')>layout.indexOf('./research-ux.css'))) errors.push('v247.css must load after research-ux.css');
need('app/v247.css',['clamp(48px,5.3vw,64px)','clamp(38px,4.5vw,58px)','clamp(48px,5.4vw,66px)','--space-section:68px','--space-section-mobile:48px','object-fit:contain!important','max-height:calc(100dvh','text-wrap:balance','product-entity-nav']);

need('components/SafeEntityImage.tsx',['fallbackSrc','setCurrentSrc(fallbackSrc)','setFailed(true)','Image unavailable','next/image']);
need('components/EntityMedia.tsx',['SafeEntityImage','getRenderableMedia']);
for(const dead of ['kyt-tt-revo-retailer','shad-sh39-retailer']) if(read('lib/media.ts').includes(dead)) errors.push(`known-dead media entry still present: ${dead}`);

need('lib/search.ts',['publicMotorcycles']);
forbid('lib/search.ts',['motorcycles.filter(isIndexableModel)']);
need('components/SearchClient.tsx',['if (!term) return [];','search-start','search-shortcuts']);
need('components/CompareButton.tsx',['count>=3','disabled']);
forbid('components/CompareButton.tsx',['.slice(-3)']);
need('components/MotorcycleFinder.tsx',['More filters','Faster provincial / national roads']);

need('components/Header.tsx',['MotoIndexLogo','Motorcycles','Finder','Compare','Guides','Gear','More']);
need('components/Footer.tsx',['MotoIndexLogo','Contact','/contact']);
need('app/contact/page.tsx',['NEXT_PUBLIC_CONTACT_EMAIL','Data correction','Partnership or commercial inquiry','General feedback']);

need('scripts/check-affiliate-build.mjs',['REQUIRE_AFFILIATE_LINKS','build','redeploy']);
need('components/AffiliateLink.tsx',['Check price on Shopee']);
need('components/AffiliateOffer.tsx',['Check current price on Shopee']);

for(const p of [
  'app/gear/helmets/[brand]/[product]/page.tsx',
  'app/accessories/top-box/[product]/page.tsx',
  'app/tires/[slug]/[product]/page.tsx'
]) need(p,['ProductEntityNav','FaqSection','alternatives','pros-cons']);
need('app/gear/helmets/[brand]/[product]/page.tsx',['#price','#specs','#size','#visor','#alternatives','#compare','#faq']);
need('app/accessories/top-box/[product]/page.tsx',['#price','#specs','#mounting','#fitment','#alternatives','#faq']);
need('app/tires/[slug]/[product]/page.tsx',['#price','#sizes','#fitment','#alternatives','#faq']);
need('lib/productSeo.ts',['helmetAlternatives','helmetComparisonTargets','helmetFaqs','tireAlternatives','topBoxAlternatives']);
need('lib/productEditorial.ts',['bestFor','pros','cons']);


need('lib/helmetBrandLineups.ts',['brandSlug:"ls2"','brandSlug:"nhk"','brandSlug:"smk"','brandSlug:"alpinestars"','FF805 Thunder GP Pro','GP R Tech Race','Titan Carbon','Supertech R10']);
for(const brand of ['LS2','NHK','SMK','Alpinestars']) if(!read('lib/data.ts').includes(`brand: "${brand}"`)) errors.push(`helmet brand missing: ${brand}`);
for(const id of ['ls2-thunder-gp-pro','ls2-dragon','ls2-advant-ii','nhk-gp-r-tech-race','nhk-terminator-tt','smk-stellar','smk-cygnus','alpinestars-supertech-r10','alpinestars-supertech-m10','alpinestars-supertech-m8','alpinestars-sm5','coocase-s28-vivo','coocase-v28-fusion','coocase-v36-wizard','coocase-s48-astra','coocase-v50-reflex']) if(!read('lib/catalog.ts').includes(`id:"${id}"`)) errors.push(`canonical catalog entity missing: ${id}`);
need('lib/topBoxBrandLineups.ts',['brand:"Duhan"','brand:"Motowolf"','brand:"Coocase"','brand:"Surfy"','status:"research"','Basic / BS / LL']);
need('app/accessories/[slug]/page.tsx',['topBoxBrandLineups','Top-box brands and product families','Fully checked models get detailed product pages']);
need('lib/media.ts',['fallbackOnlyProductMedia','New catalog entity intentionally ships without another third-party image hotlink.']);

if(exists('app/tires/[brand]')) errors.push('conflicting app/tires/[brand] route must not exist; use [slug] consistently');
if(!exists('app/tires/[slug]/[product]/page.tsx')) errors.push('canonical tire product route app/tires/[slug]/[product]/page.tsx missing');

const productIntentPattern=/(price|review|size-chart|specs|philippines)/i;
const roots=['app/gear/helmets','app/accessories/top-box'];
for(const base of roots){
  const walk=(dir)=>{for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,ent.name).split(path.sep).join("/"); if(ent.isDirectory()){if(productIntentPattern.test(ent.name)&&!ent.name.startsWith('[')) errors.push(`thin product-intent route directory found: ${path.relative(root,full).split(path.sep).join("/")}`); walk(full);}}};
  if(exists(base)) walk(path.join(root,base));
}

need('app/motorcycles/[make]/[slug]/accessories/page.tsx',['permanentRedirect','#tires-fitment']);
need('app/accessories/[slug]/page.tsx',['index:false']);
need('lib/catalog.ts',['isIndexableHelmetBrand']);
const data=read('lib/catalog.ts');
const fn=data.match(/export function isIndexableHelmetBrand[\s\S]*?\n}/)?.[0]||'';
if(fn && /rook/i.test(fn)) errors.push('Rook still has a special helmet-brand indexability exemption');

// Scan real source counts so the validator cannot pass by accidentally scanning nothing.
const sourceFiles=[]; const routeFiles=[];
const walk=(dir)=>{for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','.next'].includes(ent.name))continue; const f=path.join(dir,ent.name).split(path.sep).join("/"); if(ent.isDirectory())walk(f); else if(/\.(ts|tsx)$/.test(ent.name)){sourceFiles.push(f); if(ent.name==='page.tsx')routeFiles.push(f);}}};
walk(root);
if(sourceFiles.length<190) errors.push(`source scan unexpectedly small: ${sourceFiles.length} TS/TSX files`);
if(routeFiles.length<70) errors.push(`route scan unexpectedly small: ${routeFiles.length} page routes`);

if(errors.length){console.error(`v2.4.7 validation failed (${errors.length}):\n- ${errors.join('\n- ')}`);process.exit(1);}
console.log(`v2.4.7 validation passed: ${routeFiles.length} page routes, ${sourceFiles.length} TS/TSX files scanned; pSEO entity pages, visual hardening, UX, contact, media fallback and route architecture present.`);
