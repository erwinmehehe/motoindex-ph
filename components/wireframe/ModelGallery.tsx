"use client";
import Image from "next/image";
import { useState } from "react";
type Asset={src:string;alt:string;width:number;height:number};
export function ModelGallery({assets,colors}:{assets:Asset[];colors:string[]}){
  const [active,setActive]=useState(0);const [color,setColor]=useState("");
  return <div className="wf-gallery">{assets.length>1 && <><div className="wf-gallery-preview"><Image src={assets[active].src} alt={assets[active].alt} width={assets[active].width} height={assets[active].height} sizes="(max-width: 800px) 100vw, 40vw" /></div><div className="wf-thumbnails" aria-label="Motorcycle photo gallery">{assets.map((asset,index)=><button type="button" key={asset.src} aria-label={asset.alt} aria-pressed={active===index} onClick={()=>setActive(index)}><Image src={asset.src} alt="" width={96} height={72} /></button>)}</div></>}{colors.length>0&&<div className="wf-colors"><strong>Available colors</strong><div>{colors.map(value=><button type="button" key={value} onClick={()=>setColor(value)} aria-pressed={color===value}>{value}</button>)}</div><small role="status">{color?`${color} · confirm exact variant and local stock.`:"Paint names from the model record. Photo colors may differ."}</small></div>}</div>;
}
