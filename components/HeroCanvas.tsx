'use client'

import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { COLORS } from '@/lib/constants'

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Sparkles
          count={80}
          scale={[10, 6, 4]}
          size={2.5}
          speed={0.3}
          color={COLORS.accent}
          opacity={0.6}
        />
        <Sparkles
          count={40}
          scale={[8, 5, 4]}
          size={2}
          speed={0.2}
          color={COLORS.accent2}
          opacity={0.4}
        />
      </Canvas>
    </div>
  )
}
