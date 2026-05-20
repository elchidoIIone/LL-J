interface AztecDividerProps {
  color?: string;
  className?: string;
  inverted?: boolean;
}

/**
 * Divisor con patrón de pirámide escalonada azteca.
 * Se repite cada 24px sin estirarse, mantiene proporciones en cualquier ancho.
 */
export default function AztecDivider({
  color = '#C4501A',
  className = '',
  inverted = false,
}: AztecDividerProps) {
  // Sawtooth aztec: solid base + sharp triangular teeth
  // Tile 24w × 20h — bigger and more visible than stepped pyramids
  const path = inverted
    ? 'M0,0 L24,0 L24,10 L12,20 L0,10 Z'   // teeth pointing DOWN (cream on top)
    : 'M0,20 L0,10 L12,0 L24,10 L24,20 Z'; // teeth pointing UP (cream on bottom)

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='20' viewBox='0 0 24 20'><path d='${path}' fill='${color}'/></svg>`;
  const dataUri = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

  return (
    <div
      className={className}
      style={{
        height: 20,
        backgroundImage: dataUri,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '24px 20px',
      }}
      aria-hidden="true"
    />
  );
}
