export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="YaTeTocaPerú">
      <span className="brand-mark__ya">Ya</span>
      <span className="brand-mark__te">te</span>
      <span className="brand-mark__toca">Toca</span>
      <span className="brand-mark__peru">PERÚ</span>
    </span>
  );
}
