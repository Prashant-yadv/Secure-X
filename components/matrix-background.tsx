"use client"

import { useEffect, useRef, useState } from "react"

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const characters = "0123456789"
    const fontSize = 14
    const columns = Math.ceil(canvas.width / fontSize)

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0F0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length))
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Distance-based opacity for mouse interaction
        const dx = x - mousePos.x
        const dy = y - mousePos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 300

        const intensity = Math.random() * 0.5 + 0.5
        const mouseInfluence = Math.max(0, 1 - distance / maxDistance)
        const opacity = intensity + mouseInfluence * 0.3

        ctx.fillStyle = `rgba(0, ${Math.floor(255 * intensity)}, 0, ${Math.min(opacity, 1)})`

        ctx.fillText(text, x, y)

        drops[i]++

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
      }
    }

    const interval = setInterval(draw, 33)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [mousePos])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ background: "black" }} />
}
