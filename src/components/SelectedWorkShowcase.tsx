import { useState } from 'react'

type Slide = {
  src: string
  alt: string
}

type Tech = {
  name: string
  icon: 'react' | 'typescript' | 'motion' | 'postgres' | 'redis'
}

type SelectedWorkShowcaseProps = {
  title: string
  subtitle: string
  year: string
  description: readonly string[]
  slides: readonly Slide[]
  techStack: readonly Tech[]
}

function TechIcon({ icon }: { icon: Tech['icon'] }) {
  const common = 'h-3.5 w-3.5 shrink-0 stroke-current fill-none stroke-[1.8]'

  if (icon === 'react') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (icon === 'typescript') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path d="M4 5.5h16v13H4z" />
        <path d="M8 9h8" />
        <path d="M9 11.5l2 2-2 2" />
      </svg>
    )
  }

  if (icon === 'motion') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path d="M4 12h6" />
        <path d="M10 8l4 4-4 4" />
        <path d="M14 12h6" />
      </svg>
    )
  }

  if (icon === 'postgres') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path d="M6 7.5c2-2 10-2 12 0v9c-2 2-10 2-12 0z" />
        <path d="M6 11.5c2 1.5 10 1.5 12 0" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  )
}

export function SelectedWorkShowcase({
  title,
  subtitle,
  year,
  description,
  slides,
  techStack,
}: SelectedWorkShowcaseProps) {
  const [activeSlide, setActiveSlide] = useState(0)

  const goToPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  return (
    <section className="selected-work">
      <div className="selected-work__topline" />

      <div className="selected-work__header">
        <div>
          <h2 className="selected-work__title">{title}</h2>
          <p className="selected-work__subtitle">{subtitle}</p>
        </div>

        <div className="selected-work__year">{year}</div>
      </div>

      <div className="selected-work__media">
        <button className="selected-work__nav selected-work__nav--left" onClick={goToPrevious} aria-label="Previous image">
          ‹
        </button>

        <div className="selected-work__frame" aria-label="Project image slideshow">
          {slides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={`selected-work__slide ${index === activeSlide ? 'is-active' : ''}`}
            />
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
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="selected-work__stack" aria-label="Technology stack">
        {techStack.map((tech) => (
          <span key={tech.name} className="selected-work__tech">
            <TechIcon icon={tech.icon} />
            <span>{tech.name}</span>
          </span>
        ))}
      </div>
    </section>
  )
}