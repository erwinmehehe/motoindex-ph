import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const mediaDir=path.join(root,"public","media","motorcycles");
const files=fs.readdirSync(mediaDir).filter(name=>name.endsWith(".webp")).sort();
const scored=[];

for(const file of files){
  const full=path.join(mediaDir,file);
  const {data,info}=await sharp(full).resize(240,240,{fit:"fill"}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height,channels}=info;
  let nonWhite=0, lightNeutral=0, coloredBg=0, centerCount=0, centerNonWhite=0;
  const rowRatios=[], colRatios=[];
  for(let y=0;y<height;y++){
    let rowNonWhite=0;
    for(let x=0;x<width;x++){
      const i=(y*width+x)*channels;
      const r=data[i],g=data[i+1],b=data[i+2];
      const max=Math.max(r,g,b),min=Math.min(r,g,b),sat=max-min;
      const d=Math.hypot(255-r,255-g,255-b);
      const nw=d>26;
      if(nw){nonWhite++;rowNonWhite++;}
      const inCenter=x>=36&&x<204&&y>=36&&y<204;
      if(inCenter){centerCount++;if(nw)centerNonWhite++;}
      if(nw && max>150 && sat<22) lightNeutral++;
      if(nw && max>105 && sat>28) coloredBg++;
    }
    rowRatios.push(rowNonWhite/width);
  }
  for(let x=0;x<width;x++){
    let n=0;
    for(let y=0;y<height;y++){
      const i=(y*width+x)*channels;
      const r=data[i],g=data[i+1],b=data[i+2];
      if(Math.hypot(255-r,255-g,255-b)>26)n++;
    }
    colRatios.push(n/height);
  }
  const total=width*height;
  const fullRows=rowRatios.filter(v=>v>.72).length;
  const fullCols=colRatios.filter(v=>v>.72).length;
  const score=(nonWhite/total)*1.3+(lightNeutral/total)*1.6+(coloredBg/total)*.9+(fullRows/height)*1.8+(fullCols/width)*1.8;
  scored.push({
    id:file.replace(/\.webp$/,""),
    score:+score.toFixed(3),
    nonWhite:+(nonWhite/total).toFixed(3),
    centerNonWhite:+(centerNonWhite/centerCount).toFixed(3),
    lightNeutral:+(lightNeutral/total).toFixed(3),
    coloredBg:+(coloredBg/total).toFixed(3),
    fullRows,
    fullCols
  });
}
scored.sort((a,b)=>b.score-a.score);
console.log("WHITE_CANVAS_TOP="+JSON.stringify(scored.slice(0,45)));
