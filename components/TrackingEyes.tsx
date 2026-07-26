'use client'

import { useState, useEffect, useRef } from 'react'
import { COLORS } from '@/lib/constants'

interface EyeProps {
  mouseX: number
  mouseY: number
  size?: number
  color?: string
}

function Eye({ mouseX, mouseY, size = 64, color = COLORS.accent }: EyeProps) {
  const eyeRef = useRef<HTMLDivElement>(null)
  const [pupil, setPupil] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!eyeRef.current) return
    const rect = eyeRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const angle = Math.atan2(mouseY - centerY, mouseX - centerX)
    const maxOffset = size * 0.22

    setPupil({
      x: Math.cos(angle) * maxOffset,
      y: Math.sin(angle) * maxOffset,
    })
  }, [mouseX, mouseY, size])

  const pupilSize = size * 0.3

  return (
    <div
      ref={eyeRef}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1.5px solid ${color}`,
        background: 'rgba(8,8,15,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: `0 0 24px ${color}30, inset 0 0 12px ${color}08`,
        flexShrink: 0,
      }}
    >
      {/* Pupil */}
      <div
        style={{
          width: pupilSize,
          height: pupilSize,
          borderRadius: '50%',
          background: color,
          position: 'absolute',
          transform: `translate(${pupil.x}px, ${pupil.y}px)`,
          transition: 'transform 0.08s ease-out',
          boxShadow: `0 0 10px ${color}80`,
        }}
      />

      {/* Inner ring */}
      <div
        style={{
          width: size * 0.55,
          height: size * 0.55,
          borderRadius: '50%',
          border: `1px solid ${color}20`,
          position: 'absolute',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default function TrackingEyes() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        opacity: 0.9,
      }}
    >
      <Eye mouseX={mouse.x} mouseY={mouse.y} size={72} color={COLORS.accent} />
      <Eye mouseX={mouse.x} mouseY={mouse.y} size={72} color={COLORS.accent2} />
    </div>
  )
}
