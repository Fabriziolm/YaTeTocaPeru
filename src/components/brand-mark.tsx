import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="YaTeTocaPerú">
      <Image className="brand-mark__image" src="/yatetoca-logo-blue.png" alt="YaTeToca Perú" width={486} height={315} priority />
    </span>
  );
}
