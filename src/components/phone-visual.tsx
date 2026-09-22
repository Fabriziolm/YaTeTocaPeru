"use client";

import Image from "next/image";
import { useState } from "react";

export function PhoneVisual({ images }: { images: string[] }) {
  const safeImages = images.length ? images : ["/changan-x7-plus.jpg"];
  const [selected, setSelected] = useState(0);
  return <div className="prize-visual relative mx-auto w-full max-w-[560px]" aria-label="Galería del premio estelar">
    <div className="prize-visual__halo" />
    <div className="prize-visual__stage">
      <span className="prize-visual__eyebrow">Premio estelar · 2027</span>
      <div className="prize-visual__car"><Image src={safeImages[selected]} alt={`Changan X7 Plus 2027, imagen ${selected + 1}`} fill priority sizes="(max-width: 1024px) 90vw, 560px" className="object-contain" /></div>
      <div className="prize-visual__caption"><b className="display block text-2xl">Changan X7 Plus</b><span className="text-sm text-blue-100">SUV familiar · entrega en Lima</span></div>
    </div>
    {safeImages.length > 1 && <div className="relative mt-3 grid grid-cols-2 gap-3">{safeImages.map((src, index) => <button key={src} onClick={() => setSelected(index)} className={`relative aspect-[2/1] overflow-hidden rounded-2xl border ${selected === index ? "border-[#b8ff3d]" : "border-white/15"}`} aria-label={`Ver imagen ${index + 1} del premio`} aria-pressed={selected === index}><Image src={src} alt="" fill sizes="220px" className="object-cover" /></button>)}</div>}
  </div>;
}
