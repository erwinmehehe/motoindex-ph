import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const mediaDir=path.join(root,"public","media","motorcycles");
const files=fs.readdirSync(mediaDir).filter(name=>name.endsWith(".webp")).sort();

function percentile(values,p){
  const a=[...values].sort((x,y)=>x-y);
  return a[Math.min(a.length-1,Math.max(0,Math.floor((a.length-1)*p)))];
}

const failures=[];
for(const file of files){
  const full=path.join(mediaDir,file);
  const {data,info}=await sharp(full).resize(240,240,{fit:"fill"}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height,channels}=info;
  const edge=[];
  const corner=[];
  const strip=18;
  const sample=(x,y,bucket)=>{
    const i=(y*width+x)*channels;
    const r=data[i],g=data[i+1],b=data[i+2];
    const whiteDistance=Math.hypot(255-r,255-g,255-b);
    bucket.push({whiteDistance,r,g,b});
  };
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      if(x<strip||x>=width-strip||y<strip||y>=height-strip) sample(x,y,edge);
      if((x<strip&&y<strip)||(x>=width-strip&&y<strip)||(x<strip&&y>=height-strip)||(x>=width-strip&&y>=height-strip)) sample(x,y,corner);
    }
  }
  const edgeDistances=edge.map(v=>v.whiteDistance);
  const cornerDistances=corner.map(v=>v.whiteDistance);
  const edgeP90=percentile(edgeDistances,.9);
  const cornerP90=percentile(cornerDistances,.9);
  const edgeNonWhite=edgeDistances.filter(v=>v>18).length/edgeDistances.length;
  const cornerNonWhite=cornerDistances.filter(v=>v>18).length/cornerDistances.length;
  const edgeDark=edge.filter(v=>Math.max(v.r,v.g,v.b)<225).length/edge.length;
  const fail=edgeNonWhite>0.08 || cornerNonWhite>0.04 || edgeP90>32 || cornerP90>25 || edgeDark>0.025;
  if(fail){
    failures.push({
      id:file.replace(/\.webp$/,""),
      edgeNonWhite:+edgeNonWhite.toFixed(3),
      cornerNonWhite:+cornerNonWhite.toFixed(3),
      edgeP90:+edgeP90.toFixed(1),
      cornerP90:+cornerP90.toFixed(1),
      edgeDark:+edgeDark.toFixed(3)
    });
  }
}
console.log("WHITE_CANVAS_FAILURES="+JSON.stringify(failures));
console.log("WHITE_CANVAS_FAILURE_COUNT="+failures.length);
