/**
 * Resolve a public/ asset path against Astro's configured `base`.
 *
 * This site deploys to GitHub Pages under a sub-path
 * (base: '/gnaneswanth-bingi.github.io/'), so bare absolute URLs like
 * '/resume.pdf' resolve to the domain root in production and 404.
 * Always route public asset URLs through this helper.
 *
 * withBase('resume.pdf')  -> '/gnaneswanth-bingi.github.io/resume.pdf'
 * withBase('/resume.pdf') -> '/gnaneswanth-bingi.github.io/resume.pdf'
 */
export function withBase(assetPath: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/+$/, '')}/${assetPath.replace(/^\/+/, '')}`
}
