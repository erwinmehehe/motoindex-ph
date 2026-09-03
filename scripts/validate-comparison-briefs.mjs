import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const data=fs.readFileSync(path.join(root,'lib/data.ts'),'utf8');
const briefs=fs.readFileSync(path.join(root,'lib/comparisonEditorial.ts'),'utf8');
const page=fs.readFileSync(path.join(root,'app/compare/[slug]/page.tsx'),'utf8');
const component=fs.readFileSync(path.join(root,'components/ComparisonEditorial.tsx'),'utf8');
const required=[
  'aerox-vs-nmax','aerox-v3-vs-nmax-v3','adv-160-vs-pcx-160','click-160-vs-aerox-v3',
  'raider-r150-vs-sniper-155','click-125i-vs-mio-gear','click-125i-vs-burgman-street',
  'adv-160-vs-nmax-v3','adv-160-vs-aerox-v3','fazzio-vs-giorno-plus','tmx125-alpha-vs-ytx-125'
];
const errors=[];
for(const slug of required){
  if(!data.includes(`slug: "${slug}"`)) errors.push(`missing curated comparison: ${slug}`);
  if(!briefs.includes(`slug: "${slug}"`)) errors.push(`missing editorial brief: ${slug}`);
}
for(const slug of ['ninja-500-vs-cfmoto-450sr','xmax-vs-forza-350']){
  if(!briefs.includes(`slug: "${slug}"`)) errors.push(`missing pending brief: ${slug}`);
  if(data.includes(`slug: "${slug}"`)) errors.push(`pending comparison was published without both model records: ${slug}`);
}
for(const token of ['Quick comparison','Key differences','Which one should you choose?','How MotoIndex compares these motorcycles','FAQs']){
  if(!component.includes(token)) errors.push(`comparison component missing section: ${token}`);
}
if(!page.includes('ComparisonProductCards')) errors.push('comparison product cards are not rendered above the editorial comparison');
if(!page.includes('showProducts={false}')) errors.push('detailed comparison would duplicate product cards');
if(errors.length){console.error('Comparison brief validation failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log(`Comparison brief validation passed: ${required.length} published editorial pairs + 2 pending source-gated briefs.`);
