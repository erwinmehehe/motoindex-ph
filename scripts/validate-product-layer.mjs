import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const required=[
  'app/page.tsx','app/motorcycles/page.tsx','components/QuickFinder.tsx','components/ModelExplorer.tsx','components/LeadForm.tsx',
  'app/accessories/page.tsx','app/accessories/[slug]/page.tsx','app/gear/helmets/[brand]/page.tsx',
  'app/motorcycles/[make]/[slug]/accessories/page.tsx','app/get-quote/[make]/[slug]/page.tsx','app/api/leads/route.ts'
];
let ok=true;
for(const file of required){if(!fs.existsSync(path.join(root,file))){console.error('missing',file);ok=false;}}
const data=fs.readFileSync(path.join(root,'lib/data.ts'),'utf8');
for(const token of ['accessoryCategories','getHelmetBrand','getAccessoryCategory']){if(!data.includes(token)){console.error('missing data token',token);ok=false;}}
const sitemap=fs.readFileSync(path.join(root,'app/sitemap.ts'),'utf8');
for(const token of ['/accessories','/accessories/${a.slug}','/gear/helmets/${h.slug}','/accessories`']){if(!sitemap.includes(token)){console.error('sitemap missing',token);ok=false;}}
console.log(ok?'product-layer validation passed':'product-layer validation failed');
process.exit(ok?0:1);
