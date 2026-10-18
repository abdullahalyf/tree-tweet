import type { CSSProperties } from 'react';

// Fixed positions keep the scene stable across renders. Animation runs in CSS,
// with no canvas, frame callbacks, network assets or runtime randomness.
const seeds = [
  [6, 14, 18, -3, 12], [19, 38, 23, -11, 7], [36, 9, 26, -7, 10],
  [57, 27, 21, -16, 6], [76, 8, 25, -4, 13], [92, 34, 19, -13, 8],
  [9, 64, 27, -19, 9], [31, 81, 24, -9, 6], [66, 70, 28, -21, 11],
  [89, 88, 22, -6, 7], [47, 52, 30, -17, 5], [82, 49, 26, -2, 10],
];

export function AmbientParticles() {
  return <div className="ambient-particles" aria-hidden="true">
    {seeds.map(([left, top, duration, delay, size], index) => <span
      key={index}
      className={`ambient-particle ${index % 3 === 0 ? 'ambient-leaf' : 'ambient-spark'}`}
      style={{
        '--particle-left': `${left}%`, '--particle-top': `${top}%`,
        '--particle-duration': `${duration}s`, '--particle-delay': `${delay}s`,
        '--particle-size': `${size}px`, '--particle-drift': index % 2 ? '32px' : '-32px',
      } as CSSProperties}
    />)}
  </div>;
}
