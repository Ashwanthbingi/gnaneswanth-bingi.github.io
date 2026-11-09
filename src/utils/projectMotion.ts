/** Reveal visible cards in order; CSS owns all per-frame motion. */
export function initProjectMotion(root: HTMLElement): () => void {
  const slots = Array.from(root.querySelectorAll<HTMLElement>('.s__slot'))
  if (!slots.length) return () => {}
  if (!('IntersectionObserver' in window)) {
    slots.forEach(slot => slot.classList.add('is-entered'))
    return () => {}
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const visible = new Set<HTMLElement>()

  const reveal = (slot: HTMLElement, delay: number) => {
    if (slot.classList.contains('is-entered')) return
    slot.style.setProperty('--entrance-delay', `${delay}ms`)
    slot.classList.add('is-entered')
  }

  const sync = () => {
    // The pinned stage can intersect the viewport while its aperture is still
    // closed. SWork's visibility gate decides when that stage becomes real.
    const stageOpen = !root.classList.contains('is-cluster-js') ||
      root.classList.contains('is-cluster')
    let stagger = 0

    slots.forEach((slot) => {
      const active = stageOpen && visible.has(slot) && !document.hidden
      slot.classList.toggle('is-motion-visible', active && !reduced.matches)
      if (reduced.matches) {
        reveal(slot, 0)
        slot.classList.add('is-settled')
      }
      else if (active && !slot.classList.contains('is-entered')) {
        reveal(slot, stagger++ * 120)
      }
    })
  }

  // Observe the stable layout anchors, not their animated descendants. A
  // floating edge cannot repeatedly trigger its own observer or entrance.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const slot = entry.target as HTMLElement
      if (entry.isIntersecting) visible.add(slot)
      else visible.delete(slot)
    })
    sync()
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' })

  const stageObserver = new MutationObserver(sync)
  stageObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
  slots.forEach(slot => observer.observe(slot))
  root.classList.add('has-project-motion')

  // Keyboard navigation must reveal a focused destination without a delay,
  // including a card brought into view by the rail's native focus scrolling.
  const onFocus = (event: FocusEvent) => {
    const slot = (event.target as HTMLElement).closest<HTMLElement>('.s__slot')
    if (slot && root.contains(slot)) {
      slot.classList.add('is-focus-revealed')
      reveal(slot, 0)
    }
  }
  root.addEventListener('focusin', onFocus)
  const onEntranceEnd = (event: AnimationEvent) => {
    const entrance = event.target as HTMLElement
    if (entrance.classList.contains('s__entrance')) {
      entrance.closest('.s__slot')?.classList.add('is-settled')
    }
  }
  root.addEventListener('animationend', onEntranceEnd)
  reduced.addEventListener('change', sync)
  document.addEventListener('visibilitychange', sync)
  sync()

  return () => {
    observer.disconnect()
    stageObserver.disconnect()
    root.removeEventListener('focusin', onFocus)
    root.removeEventListener('animationend', onEntranceEnd)
    reduced.removeEventListener('change', sync)
    document.removeEventListener('visibilitychange', sync)
    slots.forEach(slot => {
      slot.classList.add('is-entered')
      slot.classList.remove('is-motion-visible')
    })
    root.classList.remove('has-project-motion')
  }
}
