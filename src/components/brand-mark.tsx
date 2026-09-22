export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="YaTeTocaPerú">
      <img className="brand-mark__image" src="/yatetoca-logo-blue.png" alt="YaTeToca Perú" />
    </span>
  );
}
