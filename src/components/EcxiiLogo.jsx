import { MetallicPaint } from './MetallicPaint';

export function EcxiiLogo({ size = 'md' }) {
  const sizes = {
    sm: { width: 90, height: 34 },
    md: { width: 140, height: 52 },
    lg: { width: 240, height: 90 },
  };

  const { width, height } = sizes[size] || sizes.md;

  return (
    <div style={{ width, height }}>
      <MetallicPaint
        imageSrc={import.meta.env.BASE_URL + 'ecxii-logo.svg'}
        speed={0.15}
        scale={3}
        brightness={3}
        contrast={1.2}
        liquid={0.5}
        lightColor="#ffffff"
        darkColor="#71717a"
        tintColor="#34d399"
        fresnel={0.5}
        chromaticSpread={1.5}
        noiseScale={0.35}
        distortion={0.5}
        contour={0.2}
        blur={0.01}
        refraction={0.015}
      />
    </div>
  );
}
