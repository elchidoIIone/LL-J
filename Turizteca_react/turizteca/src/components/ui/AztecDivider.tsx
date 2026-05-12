interface AztecDividerProps {
  color?: string;
  className?: string;
  inverted?: boolean;
}

/**
 * Divisor con patrón de pirámide escalonada azteca.
 * Usado para separar secciones o como decoración en bordes de cards.
 */
export default function AztecDivider({
  color = '#C4501A',
  className = '',
  inverted = false,
}: AztecDividerProps) {
  // Pirámide escalonada: 24w x 12h, 3 escalones
  const path = inverted
    ? 'M0,0 L0,4 L4,4 L4,8 L8,8 L8,12 L16,12 L16,8 L20,8 L20,4 L24,4 L24,0 Z'
    : 'M0,12 L0,8 L4,8 L4,4 L8,4 L8,0 L16,0 L16,4 L20,4 L20,8 L24,8 L24,12 Z';

  const patternId = `aztec-step-${color.replace('#', '')}-${inverted ? 'inv' : 'reg'}`;

  return (
    <svg
      className={className}
      width="100%"
      height="12"
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="24" height="12" patternUnits="userSpaceOnUse">
          <path d={path} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill={`url(#${patternId})`} />
    </svg>
  );
}
