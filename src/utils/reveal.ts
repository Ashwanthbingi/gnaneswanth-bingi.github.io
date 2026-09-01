/**
 * Shared scroll-reveal system.
 *
 * One IntersectionObserver drives every reveal on the page and each element is
 * unobserved after firing, so cost is O(elements) once rather than a GSAP
 * instance and ScrollTrigger per element. The animation itself is pure CSS
 * (transform/opacity/filter only) — see styles/site/_motion.scss.
 *
 * Usage in markup:
 *   <div data-reveal>                     fade + rise
 *   <div data-reveal="left">              slide in from the left
 *   <div data-reveal="scale">             scale up
 *   <div data-reveal="blur">              blur to sharp
 *   <ul data-reveal-group>                stagger direct [data-reveal] children
 *   <div data-reveal data-reveal-delay="200">   explicit delay in ms
 */

const STAGGER_STEP_MS = 90
const MAX_STAGGER_STEPS = 12

let observer: IntersectionObserver | null = null

/** Current reduced-motion preference. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function reveal(el: HTMLElement): void {
  el.classList.add('is-revealed')
}

/**
 * Give each reveal inside a group an incrementing delay so children cascade
 * instead of all firing together.
 */
function applyStagger(): void {
  document
    .querySelectorAll<HTMLElement>('[data-reveal-group]')
    .forEach((group) => {
      const children = Array.from(
        group.querySelectorAll<HTMLElement>('[data-reveal]')
      ).filter((child) => child.closest('[data-reveal-group]') === group)

      children.forEach((child, index) => {
        if (child.dataset.revealDelay) return

        const step = Math.min(index, MAX_STAGGER_STEPS)
        child.style.setProperty('--reveal-delay', `${step * STAGGER_STEP_MS}ms`)
      })
    })
}

/**
 * Initialise reveals. Safe to call once on DOM ready; idempotent.
 */
export function initReveal(): void {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>('[data-reveal]')
  )

  if (!elements.length) return

  // Reduced motion: show everything immediately, never animate.
  if (prefersReducedMotion()) {
    elements.forEach(reveal)
    return
  }

  applyStagger()

  elements.forEach((el) => {
    const delay = el.dataset.revealDelay
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)
  })

  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        reveal(entry.target as HTMLElement)
        observer?.unobserve(entry.target)
      })
    },
    {
      // Fire slightly before the element is fully on screen so the motion
      // reads as part of the scroll rather than a late pop-in.
      rootMargin: '0px 0px -10% 0px',
      threshold: 0,
    }
  )

  elements.forEach((el) => observer!.observe(el))
}

/**
 * Reveal everything immediately and stop observing. Used when the user turns
 * reduced motion on mid-session.
 */
export function flushReveals(): void {
  observer?.disconnect()
  observer = null

  document
    .querySelectorAll<HTMLElement>('[data-reveal]')
    .forEach((el) => reveal(el))
}
