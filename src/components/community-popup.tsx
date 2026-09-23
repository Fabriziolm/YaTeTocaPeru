"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const COMMUNITY_WHATSAPP_URL = "https://whatsapp.com/channel/0029VbDl66RGZNCpzNUrP804";

export function CommunityPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    setOpen(false);
  }

  if (!open) return null;

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ?? COMMUNITY_WHATSAPP_URL;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/";
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://www.tiktok.com/";

  return (
    <div className="community-popover" role="dialog" aria-modal="true" aria-labelledby="community-popup-title">
      <button className="community-popover__backdrop" aria-label="Cerrar invitación" onClick={close} />
      <div className="community-popover__panel">
        <button className="community-popover__close" aria-label="Cerrar" onClick={close}>×</button>
        <div className="community-popover__visual"><Image src="/community-teaser.png" alt="Sorpresa de la comunidad YaTeToca" width={190} height={190} priority /></div>
        <div className="community-popover__content">
          <span className="community-popover__eyebrow">Nueva comunidad YaTeToca</span>
          <h2 id="community-popup-title" className="display text-3xl font-black">Sigue los 3 canales y participa por un viaje + scooter.</h2>
          <p>Recibe avisos de nuevas dinámicas, lives y oportunidades antes que nadie.</p>
          <p className="font-bold">Para participar debes seguir los tres canales: WhatsApp, Instagram y TikTok.</p>
          <div className="community-popover__actions">
            <a className="button-secondary" href={tiktok} target="_blank" rel="noreferrer" onClick={close}>Seguir en TikTok <span aria-hidden>↗</span></a>
            <a className="button-primary" href={whatsapp} target="_blank" rel="noreferrer" onClick={close}>Unirme por WhatsApp <span aria-hidden>↗</span></a>
            <a className="button-secondary" href={instagram} target="_blank" rel="noreferrer" onClick={close}>Seguir en Instagram <span aria-hidden>↗</span></a>
          </div>
          <small>Promoción sujeta a bases de la dinámica de comunidad.</small>
        </div>
      </div>
    </div>
  );
}
