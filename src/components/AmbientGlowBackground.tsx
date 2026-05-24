import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

type AmbientGlowBackgroundProps = {
  className?: string
  children?: ReactNode
}

export function AmbientGlowBackground({ className = '', children }: AmbientGlowBackgroundProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const [motion, setMotion] = useState({ x: 0, y: 0, active: false })

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    const bounds = section.getBoundingClientRect()
    const relativeX = (event.clientX - bounds.left) / bounds.width
    const relativeY = (event.clientY - bounds.top) / bounds.height
    const offsetX = (relativeX - 0.5) * 2
    const offsetY = (relativeY - 0.5) * 2

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = window.requestAnimationFrame(() => {
      setMotion({ x: offsetX, y: offsetY, active: true })
    })
  }

  const handlePointerLeave = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
    }

    setMotion({ x: 0, y: 0, active: false })
  }

  const foregroundStyle = {
    transform: `perspective(1600px) rotateX(${motion.y * -1.8}deg) rotateY(${motion.x * 1.8}deg) translate3d(${motion.x * 6}px, ${motion.y * 6}px, 0)`,
    transition: motion.active ? 'transform 120ms linear' : 'transform 420ms ease',
  }

  const backgroundStyle = {
    transform: `translate3d(${motion.x * -16}px, ${motion.y * -12}px, 0)`,
    transition: motion.active ? 'transform 150ms linear' : 'transform 520ms ease',
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative min-h-screen w-full overflow-hidden bg-[#f4f3ef] ${className}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={backgroundStyle}>
        <div className="absolute -left-24 top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#d8cbb8]/70 blur-[110px] mix-blend-multiply animate-ambient-glow" />
        <div className="absolute right-[-8rem] top-[18%] h-[30rem] w-[30rem] rounded-full bg-[#c7b8a4]/65 blur-[120px] mix-blend-multiply animate-ambient-glow-reverse" />
        <div className="absolute bottom-[-12rem] left-[28%] h-[26rem] w-[26rem] rounded-full bg-[#e5dccd]/60 blur-[96px] mix-blend-multiply animate-ambient-glow-soft" />
      </div>

      {children ? (
        <div
          className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-12 sm:px-10"
          style={foregroundStyle}
        >
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 sm:px-10" style={foregroundStyle}>
          <article className="w-full max-w-3xl rounded-[2rem] border border-black/10 bg-neutral-950/92 px-8 py-10 shadow-[0_30px_120px_rgba(17,13,9,0.28)] backdrop-blur-sm sm:px-12 sm:py-14">
            <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.45em] text-white/45">
              <span>Ambient Glow</span>
              <span>Foreground Card</span>
            </div>

            <div className="mt-10 space-y-6">
              <p className="max-w-2xl text-xs uppercase tracking-[0.35em] text-white/35 sm:text-sm">
                A slow, editorial field of light designed to sit quietly behind content.
              </p>

              <h1 className="max-w-2xl text-3xl font-light tracking-[0.18em] text-white sm:text-5xl">
                Architectural calm, rendered as motion.
              </h1>

              <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                The background drifts in soft, nearly imperceptible cycles so the page feels
                museum-like, premium, and composed rather than decorative.
              </p>
            </div>

            <div className="mt-10 h-px w-full bg-white/10" />
          </article>
        </div>
      )}
    </section>
  )
}
