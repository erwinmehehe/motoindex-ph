"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Props = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  unoptimized?: boolean;
  fill?: boolean;
  scale?: number;
  insetPx?: number;
};

export function SafeEntityImage({src,fallbackSrc,alt,width,height,sizes,priority=false,unoptimized=false,fill=false,scale,insetPx=0}:Props){
  const [currentSrc,setCurrentSrc]=useState(src);
  const [failed,setFailed]=useState(false);

  useEffect(()=>{
    setCurrentSrc(src);
    setFailed(false);
  },[src,fallbackSrc]);

  if(failed)return <div className="media-unavailable" role="img" aria-label={`${alt} image unavailable`}><span>Image unavailable</span></div>;

  const common = {
    src: currentSrc,
    alt,
    sizes,
    priority,
    unoptimized: unoptimized || currentSrc.endsWith(".svg"),
    onError: ()=>{
      if(fallbackSrc && currentSrc !== fallbackSrc){
        setCurrentSrc(fallbackSrc);
        return;
      }
      setFailed(true);
    },
  };

  if(fill){
    return <Image {...common} fill style={{objectFit:"contain",objectPosition:"center",transform:scale ? `scale(${scale})` : undefined}} />;
  }

  const insetStyle: CSSProperties = insetPx > 0 ? {
    width:`calc(100% - ${insetPx * 2}px)`,
    height:`calc(100% - ${insetPx * 2}px)`,
    maxWidth:`calc(100% - ${insetPx * 2}px)`,
    maxHeight:`calc(100% - ${insetPx * 2}px)`,
    margin:"auto",
    boxSizing:"border-box",
  } : {};

  return <Image {...common} width={width} height={height} style={{objectFit:"contain",objectPosition:"center",maxWidth:"100%",maxHeight:"100%",transform:scale ? `scale(${scale})` : undefined,...insetStyle}} />;
}
