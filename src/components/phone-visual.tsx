"use client";

import Image from "next/image";
import { useState } from "react";

export function PhoneVisual({ images }: { images: string[] }) {
  const safeImages = images.length ? images : ["/changan-x7-plus.jpg"];
  const [selected, setSelected] = useState(0);
  return <div className="relative mx-auto w-full max-w-[470px]" aria-label="Galería del premio estelar">
    <div className="absolute -inset-10 rounded-full bg-blue-500/20 blur-3xl" />
    <div className="relative aspect-square overflow-hidden rounded-[32px] border border-white/15 bg-black shadow-2xl">
      <Image src={safeImages[selected]} alt={`Changan X7 Plus 2027, imagen ${selected + 1}`} fill priority sizes="(max-width: 1024px) 90vw, 470px" className="object-cover" />
      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-bold backdrop-blur">Premio estelar</div>
      <div className="absolute bottom-4 left-4 rounded-2xl border border-white/15 bg-[#071020]/85 px-4 py-3 backdrop-blur"><b className="display block text-xl">X7 Plus</b><span className="text-xs text-slate-300">Modelo 2027</span></div>
    </div>
    {safeImages.length > 1 && <div className="relative mt-3 grid grid-cols-2 gap-3">{safeImages.map((src, index) => <button key={src} onClick={() => setSelected(index)} className={`relative aspect-[2/1] overflow-hidden rounded-2xl border ${selected === index ? "border-[#b8ff3d]" : "border-white/15"}`} aria-label={`Ver imagen ${index + 1} del premio`} aria-pressed={selected === index}><Image src={src} alt="" fill sizes="220px" className="object-cover" /></button>)}</div>}
  </div>;
}
