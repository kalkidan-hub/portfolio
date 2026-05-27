import { useEffect, useRef, useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import { AmbientGlowBackground } from './components/AmbientGlowBackground'
import { Page } from './components/Page'
import { SelectedWorkShowcase } from './components/SelectedWorkShowcase'

const selectedWorks = [
  {
    title: 'Meridian',
    subtitle: 'Navigation system for long-running creative programs',
    year: '2025',
    description: [
      'Meridian maps milestones, dependencies, and decision points into a single editorial path so teams can see the shape of a project before it reaches production.',
      'The interface emphasizes orientation over density: a calm surface for planning work that changes weekly, with timelines and handoffs that stay legible as scope evolves.',
    ],
    slides: [{ src: '/projects/meridian-1.svg', alt: 'Meridian concept image' }],
    techStack: [
      { name: 'TypeScript', icon: 'typescript' as const },
      { name: 'React', icon: 'react' as const },
      { name: 'Motion', icon: 'motion' as const },
      { name: 'PostgreSQL', icon: 'postgres' as const },
    ],
  },
  {
    title: 'Confluence',
    subtitle: 'Real-time collaborative design at scale',
    year: '2024',
    description: [
      'A multiplayer design environment built for teams working across time zones. The challenge was keeping the system coherent while many people edited at once.',
      'Conflict resolution is surfaced visually rather than hidden, making design negotiation traceable and easy to revisit after the session ends.',
    ],
    slides: [
      { src: '/projects/confluence-1.svg', alt: 'Confluence demo image one' },
      { src: '/projects/confluence-2.svg', alt: 'Confluence demo image two' },
      { src: '/projects/confluence-3.svg', alt: 'Confluence demo image three' },
    ],
    techStack: [
      { name: 'TypeScript', icon: 'typescript' as const },
      { name: 'WebSockets', icon: 'motion' as const },
      { name: 'Operational Transformation', icon: 'motion' as const },
      { name: 'PostgreSQL', icon: 'postgres' as const },
      { name: 'Redis', icon: 'redis' as const },
    ],
  },
  {
    title: 'TransitTrack',
    subtitle: 'AI-driven transit optimization solution for high-density urban environments.',
    year: '2024',
    link: 'https://github.com/Transit-Track',
    description: [
      '**Designed and engineered** the **backend infrastructure** for TransitTrack, a smart transit platform engineered to **optimize public transportation** in high-density metropolitan areas like Addis Ababa. The system architecture processes real-time telemetry from transit vehicles, manages concurrent digital ticketing/queuing operations, and interfaces with an LSTM-based machine learning pipeline to deliver **demand-based route optimization** and **precise arrival predictions.**',
    ],
    slides: [{ src: '/projects/transittrack.mp4', alt: 'TransitTrack app showcase' }],
    techStack: [
      { name: 'FastAPI', icon: 'fastapi' as const },
      { name: 'MongoDB', icon: 'mongodb' as const },
      { name: 'Google Maps API', icon: 'googlemaps' as const },
      { name: 'PyTorch', icon: 'pytorch' as const },
    ],
  },
  {
    title: 'The Legibility of Latency',
    subtitle: 'A system feedback study for asynchronous interfaces',
    year: '2023',
    description: [
      'This study explores how small delays reshape trust in an interface, and how micro-feedback can keep a user oriented while the system catches up.',
      'The result is a set of feedback states that communicate progress, uncertainty, and completion with the minimum possible visual noise.',
    ],
    slides: [{ src: '/projects/latency-1.svg', alt: 'Latency study concept image' }],
    techStack: [
      { name: 'TypeScript', icon: 'typescript' as const },
      { name: 'React', icon: 'react' as const },
      { name: 'Motion', icon: 'motion' as const },
    ],
  },
  {
    title: 'Design Commons',
    subtitle: 'Public tooling for shared design systems',
    year: '2023',
    description: [
      'Design Commons packages shared components, tokens, and usage notes into a public reference that contributors can adopt without needing a private design ops layer.',
      'The emphasis is on clarity and reuse: one source of truth for teams that want their interface language to stay consistent as projects multiply.',
    ],
    slides: [{ src: '/projects/commons-1.svg', alt: 'Design Commons concept image' }],
    techStack: [
      { name: 'React', icon: 'react' as const },
      { name: 'TypeScript', icon: 'typescript' as const },
      { name: 'PostgreSQL', icon: 'postgres' as const },
      { name: 'Redis', icon: 'redis' as const },
    ],
  },
] as const

const recommendations = [
  {
    quote:
      'In a field that too often mistakes novelty for vision, this work stands apart for its quiet intelligence. Each piece begins with a genuinely difficult question and earns its formal choices through rigorous inquiry. What strikes me most is the patience — an unwillingness to resolve complexity before it has been fully understood.',
    author: 'Prof. Ananya Krishnamurti',
    role: 'Chair of Interaction Design · National Institute of Design',
  },
  {
    quote:
      'The work is disciplined without being dry, expressive without losing structure. It holds a rare balance between editorial restraint and technical ambition, and that balance is what makes it memorable long after the first reading.',
    author: 'Dr. Samir Amanuel',
    role: 'Principal Designer · Studio Continuum',
  },
] as const

function App() {
  const [pageIndex, setPageIndex] = useState(0)
  const [isOpening, setIsOpening] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animDirection, setAnimDirection] = useState<'forward' | 'backward' | 'none'>('none')
  const prevIndexRef = useRef(pageIndex)

  const recommendationStartIndex = 3 + selectedWorks.length
  const totalPages = recommendationStartIndex + recommendations.length
  const activeWork =
    pageIndex >= 3 && pageIndex < recommendationStartIndex
      ? (selectedWorks[pageIndex - 3] as (typeof selectedWorks)[number] & { link?: string })
      : undefined
  const currentView =
    pageIndex === 0
      ? 'cover'
      : pageIndex === 1
        ? 'toc'
        : pageIndex === 2
          ? 'intro'
          : pageIndex >= recommendationStartIndex
            ? 'recommendation'
            : 'work'

  const handleOpenBook = () => {
    setIsOpening(true)
    setPageIndex(1)
  }

  const goToPreviousPage = () => {
    setPageIndex((current) => (current - 1 + totalPages) % totalPages)
  }

  const goToNextPage = () => {
    setPageIndex((current) => (current + 1) % totalPages)
  }

  const handleBookClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null

    if (target?.closest('button, a, input, textarea, select, label')) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const clickIsLeftSide = event.clientX < bounds.left + bounds.width / 2

    if (pageIndex === 0) {
      if (!clickIsLeftSide) {
        handleOpenBook()
      }

      return
    }

    if (clickIsLeftSide) {
      goToPreviousPage()
      return
    }

    goToNextPage()
  }

  useEffect(() => {
    if (!isOpening) {
      return
    }

    const timer = window.setTimeout(() => {
      setIsOpening(false)
    }, 920)

    return () => {
      window.clearTimeout(timer)
    }
  }, [isOpening])

  // Animate page content in when the pageIndex changes.
  useEffect(() => {
    const prev = prevIndexRef.current
    if (prev === pageIndex) return

    const direction = pageIndex > prev ? 'forward' : 'backward'
    setAnimDirection(direction)
    setIsAnimating(true)

    const duration = 420
    const timer = window.setTimeout(() => {
      setIsAnimating(false)
      setAnimDirection('none')
    }, duration)

    prevIndexRef.current = pageIndex

    return () => window.clearTimeout(timer)
  }, [pageIndex])

  return (
    <AmbientGlowBackground>
      <div className="book-wrap" data-view={currentView} data-opening={isOpening}>
        <div className="vertical-nav" aria-hidden="true">
          <div className="nav-dot" />
          <div className="nav-dot" />
          <div className="nav-dot" />
        </div>

        <div className="book" onClick={handleBookClick}>
          <div className="spine"></div>

          <div className="pages">
            {pageIndex === 0 && (
              <article className="book-page cover">
                    <div className="cover-inner">
                      <div className="cover-corners">
                        <div className="corner-left"></div>
                        <div className="corner-right">2026</div>
                      </div>

                      <div className="cover-center">
                        <img src={logo} alt="logo" className="cover-logo" />
                        <h1 className="cover-title">ARCHIVE OF INTENT</h1>
                        <div className="cover-divider" />
                        <div className="cover-author">Kalkidan D. Mengistu</div>
                        <div className="cover-role">Software Engineer</div>
                      </div>

                      <div className="cover-footer">
                        <div className="cover-contact">
                          <div>kalkidan.dereje.mengistu@gmail.com</div>
                          <div>Addis Ababa, Ethiopia</div>
                        </div>
                        <button className="cover-open" onClick={handleOpenBook}>Open</button>
                      </div>
                    </div>
              </article>
            )}

            {pageIndex === 1 && (
              <Page
                titleBool
                title="Contents"
                className={isAnimating ? `page-enter-${animDirection}` : ''}
                showPrevious
                showNext
                previousLabel="Prev"
                nextLabel="Next"
                onPrevious={goToPreviousPage}
                onNext={goToNextPage}
                onBrandClick={() => setPageIndex(0)}
                onTitleClick={() => setPageIndex(1)}
                body={(
                  <>
                    <button
                      type="button"
                      className="toc-intro-link"
                      onClick={() => setPageIndex(2)}
                      aria-label="Open Introduction"
                    >
                      <div className="intro-block">
                        <h2 className="intro-title">Introduction</h2>
                        <div className="intro-leader"><span className="intro-dotline" /></div>
                        <div className="intro-page">i</div>
                      </div>
                    </button>

                    <div className="toc-section">
                      <div className="intro-title">Selected Works</div>
                      <ol className="toc-list">
                                {selectedWorks.map((work, index) => (
                                  <li key={work.title} className="toc-item">
                                    <button
                                      className={work.title === 'TransitTrack' ? 'toc-link toc-link--with-media' : 'toc-link'}
                                      onClick={() => setPageIndex(index + 3)}
                                      aria-label={`Open ${work.title}`}
                                    >
                                      {work.title === 'TransitTrack' && (
                                        <img
                                          src="/projects/transittrack_logo.png"
                                          alt="TransitTrack logo"
                                          className="toc-thumb"
                                        />
                                      )}
                                      <span className="title">{work.title}</span>
                                      <span className="page">{index + 1}</span>
                                    </button>
                                  </li>
                                ))}
                      </ol>
                    </div>
                    
                    <div className="toc-section">
                      <div className="intro-title">Recommendations</div>
                      <ol className="toc-list">
                        <li className="toc-item">
                          <button
                            type="button"
                            className="toc-link toc-link--static"
                            onClick={() => setPageIndex(recommendationStartIndex)}
                            aria-label="Open Letters of Recommendation"
                          >
                            <span className="title">Letters of Recommendation</span>
                            <span className="page">6–7</span>
                          </button>
                        </li>
                      </ol>
                    </div>
                  </>
                )}
              />
            )}

                {pageIndex === 2 && (
                  <Page
                    titleBool
                    title="Introduction"
                    className={isAnimating ? `page-enter-${animDirection}` : ''}
                    showPrevious
                    showNext
                    previousLabel="Prev"
                    nextLabel="Next"
                    onPrevious={goToPreviousPage}
                    onNext={goToNextPage}
                    onBrandClick={() => setPageIndex(0)}
                    onTitleClick={() => setPageIndex(1)}
                    body={(
                      <div className="intro-page">
                        <div className="intro-hero">
                          <div className="intro-hero-bg" />
                          <div className="intro-hero-photo">
                            <img src={logo} alt="Profile" />
                          </div>
                        </div>

                        <div className="intro-about">
                          <h3>About</h3>
                          <p>
                            I'm a software engineer and designer focused on building thoughtful, collaborative experiences
                            that prioritize clarity and human workflows. My work spans real-time collaboration, design systems,
                            and research-driven interaction models.
                          </p>
                          <p>
                            I enjoy making complex systems legible and approachable — translating high-level product goals
                            into tools teams can use every day.
                          </p>
                        </div>
                      </div>
                    )}
                  />
                )}

                {pageIndex >= recommendationStartIndex && (
                  <Page
                    titleBool
                    title="Recommendation"
                    className={['recommendation', isAnimating ? `page-enter-${animDirection}` : ''].filter(Boolean).join(' ')}
                    showPrevious
                    showNext
                    previousLabel="Prev"
                    nextLabel="Next"
                    onPrevious={goToPreviousPage}
                    onNext={goToNextPage}
                    onBrandClick={() => setPageIndex(0)}
                    onTitleClick={() => setPageIndex(1)}
                    body={(
                      <section className="recommendation-card" aria-label="Recommendation quote">
                        <div className="recommendation-card__counter">
                          {pageIndex - recommendationStartIndex + 1} / {recommendations.length}
                        </div>

                        <div className="recommendation-card__mark" aria-hidden="true">
                          “
                        </div>

                        <p className="recommendation-card__quote">
                          {recommendations[pageIndex - recommendationStartIndex].quote}
                        </p>

                        <div className="recommendation-card__signature" />

                        <div className="recommendation-card__author">
                          <div className="recommendation-card__name">{recommendations[pageIndex - recommendationStartIndex].author}</div>
                          <div className="recommendation-card__role">{recommendations[pageIndex - recommendationStartIndex].role}</div>
                        </div>
                      </section>
                    )}
                  />
                )}

                    {pageIndex >= 3 && pageIndex < recommendationStartIndex && (
              <Page
                titleBool
                title="Selected Works"
                className={("work-list " + (isAnimating ? `page-enter-${animDirection}` : '')).trim()}
                showPrevious
                showNext
                previousLabel="Prev"
                nextLabel="Next"
                onPrevious={goToPreviousPage}
                        onNext={goToNextPage}
                        onBrandClick={() => setPageIndex(0)}
                        onTitleClick={() => setPageIndex(1)}
                body={(
                    <SelectedWorkShowcase
                      title={activeWork?.title ?? ''}
                      subtitle={activeWork?.subtitle ?? ''}
                      year={activeWork?.year ?? ''}
                      link={activeWork?.link}
                      description={activeWork?.description ?? []}
                      slides={activeWork?.slides ?? []}
                      techStack={activeWork?.techStack ?? []}
                    />
                )}
              />
            )}
          </div>
        </div>
      </div>
    </AmbientGlowBackground>
  )
}

export default App
