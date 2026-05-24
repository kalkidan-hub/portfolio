import type { ReactNode } from 'react'

type PageProps = {
  titleBool: boolean
  title: string
  body: ReactNode
  showPrevious: boolean
  showNext: boolean
  previousLabel?: string
  nextLabel?: string
  onPrevious?: () => void
  onNext?: () => void
  className?: string
}

export function Page({
  titleBool,
  title,
  body,
  showPrevious,
  showNext,
  previousLabel = 'Prev',
  nextLabel = 'Next',
  onPrevious,
  onNext,
  className = '',
}: PageProps) {
  return (
    <article className={`book-page page ${titleBool ? 'page--content' : 'page--cover'} ${className}`}>
      <header className="page-header">
        <div className="page-header-brand">{titleBool ? 'ARCHIVE OF INTENT' : ''}</div>
        <div className="page-header-title">{title}</div>
      </header>

      <section className="page-body">{body}</section>

      <footer className="page-footer">
        <div className="page-footer-side">
          {showPrevious ? (
            <button className="page-footer-action" onClick={onPrevious}>
              <span aria-hidden="true">‹</span>
              {previousLabel}
            </button>
          ) : null}
        </div>

        <div className="page-footer-center">{titleBool ? 'i' : ''}</div>

        <div className="page-footer-side page-footer-side--right">
          {showNext ? (
            <button className="page-footer-action" onClick={onNext}>
              {nextLabel}
              <span aria-hidden="true">›</span>
            </button>
          ) : null}
        </div>
      </footer>
    </article>
  )
}