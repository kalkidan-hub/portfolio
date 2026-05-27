import { useEffect, useRef, useState } from 'react'
import {
  SiFastapi,
  SiFramer,
  SiGooglemaps,
  SiMongodb,
  SiPostgresql,
  SiPytorch,
  SiReact,
  SiRedis,
  SiTypescript,
} from 'react-icons/si'
import { FiLink } from 'react-icons/fi'
import type { IconType } from 'react-icons'

type Slide = {
  src: string
  alt: string
}

type Tech = {
  name: string
  icon:
    | 'react'
    | 'typescript'
    | 'motion'
    | 'postgres'
    | 'redis'
    | 'fastapi'
    | 'mongodb'
    | 'googlemaps'
    | 'pytorch'
}

type SelectedWorkShowcaseProps = {
  title: string
  subtitle: string
  year: string
  link?: string
  description: readonly string[]
  slides: readonly Slide[]
  techStack: readonly Tech[]
}

const techIconComponents: Record<Tech['icon'], IconType> = {
  react: SiReact,
  typescript: SiTypescript,
  motion: SiFramer,
  postgres: SiPostgresql,
  redis: SiRedis,
  fastapi: SiFastapi,
  mongodb: SiMongodb,
  googlemaps: SiGooglemaps,
  pytorch: SiPytorch,
}

const techIconColors: Record<Tech['icon'], string> = {
  react: '#61DAFB',
  typescript: '#3178c6',
  motion: '#7C3AED',
  postgres: '#336791',
  redis: '#DC382D',
  fastapi: '#009688',
  mongodb: '#47A248',
  googlemaps: '#4285F4',
  pytorch: '#EE4C2C',
}

function isVideoSlide(src: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src)
}

export function SelectedWorkShowcase({
  title,
  subtitle,
  year,
  link,
  description,
  slides,
  techStack,
}: SelectedWorkShowcaseProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  function parseInlineMarkdown(text: string) {
    const nodes: React.ReactNode[] = []
    let lastIndex = 0
    const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      const idx = match.index
      if (idx > lastIndex) nodes.push(text.slice(lastIndex, idx))

      if (match[2]) {
        nodes.push(<strong key={idx}>{match[2]}</strong>)
      } else if (match[3]) {
        nodes.push(<em key={idx}>{match[3]}</em>)
      }

      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
    return nodes
  }

  const goToPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  useEffect(() => {
    const activeSlideData = slides[activeSlide]

    for (const slide of slides) {
      if (!isVideoSlide(slide.src)) continue

      const video = videoRefs.current[slide.src]
      if (!video) continue

      if (slide.src === activeSlideData?.src) {
        video.currentTime = 0
        void video.play().catch(() => {
          // Autoplay can still be blocked by browser policy; controls remain available.
        })
      } else {
        video.pause()
      }
    }
  }, [activeSlide, slides])

  return (
    <section className="selected-work">
      <div className="selected-work__topline" />

      <div className="selected-work__header">
        <div>
          <h2 className="selected-work__title">
            <span>{title}</span>
            {link ? (
              <a
                className="selected-work__title-link"
                href={link}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${title} in a new tab`}
                onClick={(event) => event.stopPropagation()}
              >
                <FiLink size={16} aria-hidden />
              </a>
            ) : null}
          </h2>
          <p className="selected-work__subtitle">{subtitle}</p>
        </div>

        <div className="selected-work__year">{year}</div>
      </div>

      <div className="selected-work__media">
        <button className="selected-work__nav selected-work__nav--left" onClick={goToPrevious} aria-label="Previous image">
          ‹
        </button>

        <div
          className="selected-work__frame"
          aria-label="Project image slideshow"
          onClickCapture={(event) => event.stopPropagation()}
        >
          {slides.map((slide, index) => (
            isVideoSlide(slide.src) ? (
              <video
                key={slide.src}
                className={`selected-work__slide video-slide ${index === activeSlide ? 'is-active' : ''}`}
                ref={(node) => {
                  videoRefs.current[slide.src] = node
                }}
                controls
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
                aria-label={slide.alt}
              >
                <source src={slide.src} type="video/mp4" />
                {slide.alt}
              </video>
            ) : (
              <img
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                className={`selected-work__slide ${index === activeSlide ? 'is-active' : ''}`}
              />
            )
          ))}

          <div className="selected-work__slide-label">
            {activeSlide + 1} / {slides.length}
          </div>
        </div>

        <button className="selected-work__nav selected-work__nav--right" onClick={goToNext} aria-label="Next image">
          ›
        </button>
      </div>

      <div className="selected-work__body">
        {description.map((paragraph) => (
          <p key={paragraph}>{parseInlineMarkdown(paragraph)}</p>
        ))}
      </div>

      <div className="selected-work__stack" aria-label="Technology stack">
        {techStack.map((tech) => {
          const Icon = techIconComponents[tech.icon]

          return (
            <span key={tech.name} className="selected-work__tech">
              <Icon size={14} aria-hidden style={{ color: techIconColors[tech.icon] }} />
              <span>{tech.name}</span>
            </span>
          )
        })}
      </div>
    </section>
  )
}