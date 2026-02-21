import React from 'react';

export const Background = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        background: `
          radial-gradient(circle 384px at 33% 25%, rgba(59,130,246,0.15) 0%, transparent 70%),
          radial-gradient(circle 320px at 75% 75%, rgba(29,78,216,0.12) 0%, transparent 70%),
          radial-gradient(circle 288px at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%),
          radial-gradient(circle 256px at 67% 5%, rgba(34,211,238,0.10) 0%, transparent 70%),
          radial-gradient(circle 192px at 5% 90%, rgba(14,165,233,0.14) 0%, transparent 70%),
          radial-gradient(circle 224px at 90% 33%, rgba(147,197,253,0.06) 0%, transparent 70%),
          rgba(0,0,0,0.40)
        `,
      }}
    />
  );
};
