"use client";
import { useState } from "react";

export function ReviewedModelGallery({ images, make, makeSlug }: { images: { src: string; alt: string }[]; make: string; makeSlug: string }) {
  const [selected, setSelected] = useState(0);
  if (!images.length) return null;
  return <div className="reviewed-model-gallery">
    <div className="reviewed-model-stage"><img className="reviewed-brand-logo" src={`/brand/motorcycle/${makeSlug}.svg`} alt={make} /><img className="reviewed-model-photo" src={images[selected].src} alt={images[selected].alt} fetchPriority="high" /></div>
    <div className="reviewed-model-thumbnails" aria-label="Model photos">{images.map((image,index)=><button type="button" key={image.src} aria-label={`View ${image.alt}`} aria-pressed={index===selected} onClick={()=>setSelected(index)}><img src={image.src} alt="" loading="lazy" /></button>)}</div>
  </div>;
}
