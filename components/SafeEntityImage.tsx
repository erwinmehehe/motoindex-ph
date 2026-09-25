"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

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
};

export function SafeEntityImage({src,fallbackSrc,alt,width,height,sizes,priority=false,unoptimized=false,fill=false}:Props){
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
    return <Image {...common} fill style={{objectFit:"contain"}} />;
  }

  return <Image {...common} width={width} height={height} style={{objectFit:"contain",objectPosition:"center",maxWidth:"100%",maxHeight:"100%"}} />;
}
