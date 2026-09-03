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
};

export function SafeEntityImage({src,fallbackSrc,alt,width,height,sizes,priority=false,unoptimized=false}:Props){
  const [currentSrc,setCurrentSrc]=useState(src);
  const [failed,setFailed]=useState(false);

  useEffect(()=>{
    setCurrentSrc(src);
    setFailed(false);
  },[src,fallbackSrc]);

  if(failed)return <div className="media-unavailable" role="img" aria-label={`${alt} image unavailable`}><span>Image unavailable</span></div>;

  return <Image
    src={currentSrc}
    alt={alt}
    width={width}
    height={height}
    sizes={sizes}
    priority={priority}
    unoptimized={unoptimized || currentSrc.endsWith(".svg")}
    onError={()=>{
      if(fallbackSrc && currentSrc !== fallbackSrc){
        setCurrentSrc(fallbackSrc);
        return;
      }
      setFailed(true);
    }}
  />;
}
