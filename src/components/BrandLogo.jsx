export default function BrandLogo({ className = '' }) {
  return (
    <svg
      className={`brand-logo ${className}`.trim()}
      viewBox="50 140 668 180"
      role="img"
      aria-label="Dovroyn — AI Marketing. Your Way."
      preserveAspectRatio="xMidYMid meet"
    >
      <image href="/dovroyn-logo.png" width="767" height="485" />
    </svg>
  );
}
