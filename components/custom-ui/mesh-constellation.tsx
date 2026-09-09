"use client"

import React, { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number
  radius: number
  pulsePhase: number
  pulseSpeed: number
  color: string
}

interface Packet {
  from: number
  to: number
  progress: number
  speed: number
  color: string
}

interface MeshConstellationProps {
  className?: string
}

export function MeshConstellation({ className = "" }: MeshConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = container.clientWidth)
    let height = (canvas.height = container.clientHeight)
    const isDark = resolvedTheme === "dark"

    // High-DPI screen scaling for Retina displays
    const dpr = window.devicePixelRatio || 1
    const resizeCanvas = () => {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }
    resizeCanvas()

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(container)

    // Color palette based on theme
    const darkPalette = [
      "#6366f1", // electric indigo
      "#06b6d4", // neon cyan
      "#818cf8", // luminous light indigo
      "#38bdf8", // radiant sky
      "#a855f7", // purple
      "#10b981", // emerald
    ]

    const lightPalette = [
      "#4f46e5", // deep indigo
      "#0284c7", // deep sky
      "#0d9488", // teal
      "#7c3aed", // violet
      "#2563eb", // vibrant blue
    ]

    const palette = isDark ? darkPalette : lightPalette

    // Responsive Mobile vs Desktop Physics & Density
    const isMobile = width < 768
    const nodeCount = isMobile
      ? 16
      : Math.min(65, Math.max(30, Math.floor((width * height) / 9500)))
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      const radius = isMobile
        ? 1.2 + Math.random() * 1.5
        : 1.6 + Math.random() * 2.2

      let xPos: number
      let yPos: number

      if (isMobile) {
        // On mobile, anchor nodes toward top-right corner to stay away from text
        xPos = Math.random() > 0.25
          ? width * 0.4 + Math.random() * (width * 0.6)
          : Math.random() * width
        yPos = Math.random() * (height * 0.7)
      } else {
        // Desktop: spread from right to left
        xPos = Math.random() > 0.25
          ? width * 0.35 + Math.random() * (width * 0.65)
          : Math.random() * width
        yPos = Math.random() * height
      }

      nodes.push({
        x: xPos,
        y: yPos,
        vx: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
        vy: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
        baseRadius: radius,
        radius,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        color: palette[Math.floor(Math.random() * palette.length)],
      })
    }

    // Interactive Mouse & Touch Tracking
    let mouseX = -9999
    let mouseY = -9999
    let isHovered = false

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      isHovered = true
    }

    const handleMouseLeave = () => {
      mouseX = -9999
      mouseY = -9999
      isHovered = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const rect = canvas.getBoundingClientRect()
        mouseX = touch.clientX - rect.left
        mouseY = touch.clientY - rect.top
        isHovered = true
      }
    }

    const handleTouchEnd = () => {
      mouseX = -9999
      mouseY = -9999
      isHovered = false
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    container.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })

    // Traveling Data Packets (Simulating network stream)
    const packetCount = isMobile ? 6 : 22
    const packets: Packet[] = []

    const initPacket = (packetIndex: number) => {
      const from = Math.floor(Math.random() * nodes.length)
      let to = Math.floor(Math.random() * nodes.length)
      while (to === from) {
        to = Math.floor(Math.random() * nodes.length)
      }

      packets[packetIndex] = {
        from,
        to,
        progress: 0,
        speed: (isMobile ? 0.003 : 0.005) + Math.random() * (isMobile ? 0.008 : 0.012),
        color: isDark ? "#38bdf8" : "#4f46e5",
      }
    }

    for (let i = 0; i < packetCount; i++) {
      initPacket(i)
      packets[i].progress = Math.random()
    }

    const connectionDistance = isMobile ? 70 : 120
    const mouseInfluenceRadius = isMobile ? 80 : 150

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        node.x += node.vx
        node.y += node.vy

        // Gentle boundary bounces
        if (node.x < 10) {
          node.x = 10
          node.vx *= -1
        } else if (node.x > width - 10) {
          node.x = width - 10
          node.vx *= -1
        }

        if (node.y < 10) {
          node.y = 10
          node.vy *= -1
        } else if (node.y > height - 10) {
          node.y = height - 10
          node.vy *= -1
        }

        // Magnetic Attraction toward Cursor
        if (isHovered && mouseX > 0 && mouseY > 0) {
          const dx = mouseX - node.x
          const dy = mouseY - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouseInfluenceRadius && dist > 1) {
            const force = (1 - dist / mouseInfluenceRadius) * 0.035
            node.vx += (dx / dist) * force
            node.vy += (dy / dist) * force
          }
        }

        // Velocity damping to maintain smooth ambient drift
        const currentSpeed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
        if (currentSpeed > 0.75) {
          node.vx = (node.vx / currentSpeed) * 0.75
          node.vy = (node.vy / currentSpeed) * 0.75
        }

        // Breathing pulse
        node.pulsePhase += node.pulseSpeed
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.6
      }

      // 2. Draw Distance Connections Between Nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * (isDark ? 0.32 : 0.22)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = isDark
              ? `rgba(99, 102, 241, ${alpha})`
              : `rgba(79, 70, 229, ${alpha})`
            ctx.lineWidth = 0.85
            ctx.stroke()
          }
        }
      }

      // 3. Draw Mouse Beacon and Dynamic Connecting Beams
      if (isHovered && mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? "#06b6d4" : "#4f46e5"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(mouseX, mouseY, 12, 0, Math.PI * 2)
        ctx.strokeStyle = isDark ? "rgba(6, 182, 212, 0.35)" : "rgba(79, 70, 229, 0.25)"
        ctx.lineWidth = 1
        ctx.stroke()

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]
          const dx = mouseX - node.x
          const dy = mouseY - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouseInfluenceRadius) {
            const alpha = (1 - dist / mouseInfluenceRadius) * 0.5
            ctx.beginPath()
            ctx.moveTo(mouseX, mouseY)
            ctx.lineTo(node.x, node.y)
            ctx.strokeStyle = isDark
              ? `rgba(6, 182, 212, ${alpha})`
              : `rgba(79, 70, 229, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // 4. Update & Render Traveling Packets
      for (let p = 0; p < packets.length; p++) {
        const packet = packets[p]
        const fromNode = nodes[packet.from]
        const toNode = nodes[packet.to]

        if (!fromNode || !toNode) {
          initPacket(p)
          continue
        }

        const dx = toNode.x - fromNode.x
        const dy = toNode.y - fromNode.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > connectionDistance * 1.35) {
          initPacket(p)
          continue
        }

        packet.progress += packet.speed

        if (packet.progress >= 1) {
          toNode.radius = toNode.baseRadius + 2
          initPacket(p)
          continue
        }

        const px = fromNode.x + dx * packet.progress
        const py = fromNode.y + dy * packet.progress

        // Packet Particle
        ctx.beginPath()
        ctx.arc(px, py, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? "#38bdf8" : "#4f46e5"
        ctx.shadowColor = isDark ? "#38bdf8" : "#4f46e5"
        ctx.shadowBlur = isDark ? 8 : 4
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // 5. Render Glowing Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // Outer soft glow halo
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2)
        ctx.fillStyle = isDark
          ? "rgba(99, 102, 241, 0.08)"
          : "rgba(79, 70, 229, 0.06)"
        ctx.fill()

        // Inner solid core
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [resolvedTheme])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden mask-[radial-gradient(circle_at_85%_15%,black_25%,transparent_80%)] lg:mask-[linear-gradient(to_left,black_50%,transparent_100%)] ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full block pointer-events-auto"
      />
    </div>
  )
}
