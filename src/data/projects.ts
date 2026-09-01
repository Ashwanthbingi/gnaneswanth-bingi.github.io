/**
 * Centralized project data — single source of truth for the Work section.
 *
 * Both the 3D flying scene (SWork) and the detail grid (SProjects) read from
 * this file, so a project only ever needs to be described once. The array order
 * is the scroll order: cover N flies through the scene as card N settles into
 * the cluster, so reordering here reorders both at once.
 *
 * The two engineering entries are transcribed from the CV in `public/resume.pdf`
 * — the numbers, action counts and estimator names are his, not paraphrase.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  TODO — PASTE YOUR REAL REPO URLS HERE
 *  `github: null` is deliberate: the card falls back to your repositories page
 *  rather than linking to a guessed URL that would 404. Replace each `null`
 *  below with the exact repo URL and the buttons wire up automatically.
 *
 *  Please also confirm the `technologies` arrays. Everything listed appears in
 *  your CV, but the CV names a language per *skill* rather than per project, so
 *  the implementation language on the two newest entries is inferred (marked
 *  inline). Trim anything a project doesn't actually use.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const GITHUB_USER = 'Ashwanthbingi'
export const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`
export const GITHUB_REPOS = `${GITHUB_PROFILE}?tab=repositories`

export type ProjectCategory =
  | 'AI / ML'
  | 'Systems'
  | 'Computer Vision'
  | 'Research'
  | 'Full Stack'

export interface Project {
  /** URL-safe id, also used for the cover filename and DOM ids. */
  slug: string
  title: string
  /** One-line problem statement. The most important line on the card. */
  problem: string
  /** 2–3 sentences of supporting detail. */
  description: string
  /** Short capability bullets surfaced on the featured block only. */
  highlights: string[]
  technologies: string[]
  categories: ProjectCategory[]
  /** Exact repo URL. `null` -> falls back to the repositories page. */
  github: string | null
  /** Live deployment, or `null` to hide the demo button. */
  live: string | null
  /**
   * Cover art, relative to /public. The committed .svg diagrams are
   * fallbacks — drop a screenshot in public/images/projects/ and point
   * this at it (e.g. 'images/projects/aegis-lite.png').
   */
  image: string
  /** Exactly one project should be featured. */
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'raft-key-value-store',
    /*
     * The CV heading is "Distributed Fault-Tolerant Key-Value Store using the
     * Raft Consensus Algorithm". A card title is a label, not a sentence, and
     * this one has to hold two lines in a 190px-wide column inside the cluster —
     * so the distinguishing claim stays in the title and the rest of the heading
     * is carried by the problem line, the description and the first highlight.
     */
    title: 'Fault-Tolerant Key-Value Store',
    problem:
      'A distributed store that cannot agree on its own history is worse than a single node — it loses data confidently.',
    description:
      'An implementation of the Raft consensus algorithm: leader election, log replication, quorum-based commits and automatic failover, so the cluster keeps serving strongly consistent reads and writes while nodes die under it. State survives on RocksDB with crash recovery and snapshotting, nodes talk over gRPC, and a React dashboard reads 25+ Prometheus metrics live.',
    highlights: [
      'Raft leader election, log replication and quorum commits',
      'RocksDB persistence with crash recovery and snapshotting',
      'gRPC inter-node RPC across a Dockerised multi-node cluster',
      'Real-time React dashboard over 25+ Prometheus metrics',
    ],
    technologies: [
      'Java', // inferred — the CV names languages per skill, not per project
      'gRPC',
      'Protocol Buffers',
      'RocksDB',
      'React',
      'Docker',
      'Prometheus',
      'Grafana',
    ],
    categories: ['Systems', 'Full Stack'],
    github: null, // TODO: paste exact repo URL
    live: null,
    image: 'images/projects/raft-key-value-store.svg',
    featured: true,
  },
  {
    slug: 'payment-recovery-bandits',
    title: 'Budget-Constrained Payment Recovery',
    problem:
      'Every failed payment is worth chasing — but the recovery budget runs out long before the queue does.',
    description:
      'A LinUCB contextual bandit that picks one of six recovery actions per failed transaction from transaction, failure-reason and customer-behaviour context, reframing one-off retry rules as budget-constrained portfolio allocation. Primal-dual pacing learns a shadow price that spends a shared ₹300/day budget on the highest-value failures.',
    highlights: [
      'LinUCB over six recovery actions per failed transaction',
      'Primal-dual budget pacing through a learned shadow price',
      'Beat fixed retries in all 10 simulations: ~40% more net revenue',
      'Off-policy evaluation — IPS, SNIPS and doubly-robust with CIs',
    ],
    technologies: [
      'Python', // inferred — the CV names languages per skill, not per project
      'Contextual Bandits',
      'LinUCB',
      'Off-Policy Evaluation',
      'Policy Optimization',
    ],
    categories: ['AI / ML', 'Research'],
    github: null, // TODO: paste exact repo URL
    live: null,
    image: 'images/projects/payment-recovery-bandits.svg',
    featured: false,
  },
  {
    slug: 'aegis-lite',
    title: 'AEGIS-Lite',
    problem:
      'An autonomous agent calls tools with real side effects and nothing sits between intent and consequence.',
    description:
      'A security middleware layer for AI agents. Every tool call is risk-evaluated before execution, memory is isolated per task so context cannot leak across boundaries, and stateful rollback lets a run be rewound to a known-good checkpoint after an unsafe action.',
    highlights: [
      'Tool-call risk evaluation ahead of execution',
      'Stateful rollback to known-good checkpoints',
      'Per-task memory isolation',
      'Sandboxed execution boundary for untrusted actions',
    ],
    technologies: ['Python', 'LLM Tooling', 'Sandboxing'],
    categories: ['Systems', 'Research'],
    github: null, // TODO: paste exact repo URL
    live: null,
    image: 'images/projects/aegis-lite.svg',
    featured: false,
  },
  {
    slug: 'chest-xray-super-resolution',
    title: 'Chest X-Ray Super-Resolution',
    problem:
      'Diagnosis depends on fine anatomical detail that low-resolution chest radiographs simply do not carry.',
    description:
      'A deep-learning pipeline that reconstructs high-resolution chest radiographs from low-resolution inputs using a SwinIR transformer backbone. Trained with a VGG-based perceptual loss so outputs are optimised for diagnostic legibility rather than pixel-wise error alone, then evaluated on downstream diagnostic quality.',
    highlights: [
      'SwinIR transformer backbone for image restoration',
      'VGG perceptual loss over plain pixel-wise objectives',
      'Diagnostic-quality evaluation, not just PSNR/SSIM',
      'Medical imaging research pipeline end to end',
    ],
    technologies: ['Python', 'PyTorch', 'SwinIR', 'OpenCV', 'NumPy'],
    categories: ['Computer Vision', 'Research', 'AI / ML'],
    github: null, // TODO: paste exact repo URL
    live: null,
    image: 'images/projects/chest-xray-super-resolution.svg',
    featured: false,
  },
  {
    slug: 'portfolio',
    title: 'This Portfolio',
    problem:
      'A developer portfolio should demonstrate engineering ability, not just describe it.',
    description:
      'Statically generated with Astro and animated with GSAP over a Lenis smooth-scroll pipeline. Motion runs on a single shared ticker and IntersectionObserver, the hero sits on a hand-written WebGL2 shader with no 3D library, and every effect degrades cleanly under prefers-reduced-motion.',
    highlights: [
      'Astro static output with zero client framework',
      'Dependency-free WebGL2 perspective-grid backdrop',
      'Shared ticker + IntersectionObserver motion system',
      'Reduced-motion and keyboard accessible throughout',
    ],
    technologies: ['Astro', 'TypeScript', 'GSAP', 'WebGL', 'SCSS'],
    categories: ['Full Stack'],
    github: 'https://github.com/Ashwanthbingi/gnaneswanth-bingi.github.io',
    live: 'https://ashwanthbingi.github.io/gnaneswanth-bingi.github.io/',
    image: 'images/projects/portfolio.svg',
    featured: false,
  },
]

/** The single featured project, with a safe fallback to the first entry. */
export const featuredProject: Project =
  projects.find((project) => project.featured) ?? projects[0]

/** Everything that isn't featured, in display order. */
export const gridProjects: Project[] = projects.filter(
  (project) => project !== featuredProject
)

/**
 * Resolve a project's repo link. Never returns a guessed URL — an unset
 * `github` falls back to the repositories listing.
 */
export function repoUrl(project: Project): string {
  return project.github ?? GITHUB_REPOS
}

/** True when we have a verified repo URL for this project. */
export function hasRepo(project: Project): boolean {
  return project.github !== null
}
