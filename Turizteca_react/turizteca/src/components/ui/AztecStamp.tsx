import type { ReactNode } from 'react';

interface AztecStampProps {
  children?: ReactNode;
  color?: string;
  size?: number;
  className?: string;
}

/**
 * Sello azteca circular — inspirado en el borde del logo de Turizteca.
 * Doble anillo con marcas radiales y puntos cardinales.
 */
export default function AztecStamp({
  children,
  color = '#C4501A',
  size = 96,
  className = '',
}: AztecStampProps) {
  const ticks = 16;
  const cx = 50, cy = 50;
  const outerR = 48;
  const innerR = 38;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {/* Anillo exterior */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={color} strokeWidth="1.5" opacity="0.55" />
        {/* Anillo interior */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={color} strokeWidth="2.5" />

        {/* Marcas radiales entre anillos */}
        {Array.from({ length: ticks }).map((_, i) => {
          const angle = (i / ticks) * Math.PI * 2;
          const x1 = cx + Math.cos(angle) * (innerR + 1);
          const y1 = cy + Math.sin(angle) * (innerR + 1);
          const x2 = cx + Math.cos(angle) * (outerR - 1);
          const y2 = cy + Math.sin(angle) * (outerR - 1);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeWidth="1.5"
              opacity="0.7"
            />
          );
        })}

        {/* Puntos cardinales (N, E, S, O) */}
        {[0, 90, 180, 270].map(deg => {
          const angle = (deg / 360) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * outerR;
          const y = cy + Math.sin(angle) * outerR;
          return <circle key={deg} cx={x} cy={y} r="2.5" fill={color} />;
        })}
      </svg>
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
