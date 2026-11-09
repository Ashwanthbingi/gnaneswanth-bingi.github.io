/**
 * Centralized project data — single source of truth for the Work section.
 *
 * Both the 3D flying scene (SWork) and the detail grid (SProjects) read from
 * this file, so a project only ever needs to be described once. The array order
 * is the scroll order: cover N flies through the scene as card N settles into
 * the cluster, so reordering here reorders both at once.
 *
 * Existing details come from the portfolio and CV. New project details come
 * from local source checkouts. Repository URLs were supplied by the owner or
 * read from the checkouts' Git remotes.
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
  /** Short summary, displayed in two lines on the card. */
  problem: string
  /** 2–3 sentences of supporting detail. */
  description: string
  /** Short capability bullets surfaced on the featured block only. */
  highlights: string[]
  technologies: string[]
  categories: ProjectCategory[]
  /** Exact repository URL; every selected project links directly to its code. */
  github: string
  /** Live deployment, or `null` to hide the demo button. */
  live: string | null
  /**
   * Project-specific SVG technical illustration, relative to /public.
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
      'Raft consensus keeps a distributed store consistent through node failures.',
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
    github: `${GITHUB_PROFILE}/raft-harmony`,
    live: null,
    image: 'images/projects/raft-key-value-store.svg',
    featured: true,
  },
  {
    slug: 'payment-recovery-bandits',
    title: 'Budget-Constrained Payment Recovery',
    problem:
      'Contextual bandits allocate a fixed budget across failed-payment recovery actions.',
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
    github: `${GITHUB_PROFILE}/Recovery-portfolio-optimizer`,
    live: null,
    image: 'images/projects/payment-recovery-bandits.svg',
    featured: false,
  },
  {
    slug: 'chest-xray-super-resolution',
    title: 'Chest X-Ray Super-Resolution',
    problem:
      'Reconstructing chest X-rays with attention to downstream diagnostic quality.',
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
    github: `${GITHUB_PROFILE}/Beyond-Perceptual-Quality-Task-Driven-Super-Resolution-for-Diagnostically-Reliable-Chest-X-ray-`,
    live: null,
    image: 'images/projects/chest-xray-super-resolution.svg',
    featured: false,
  },
  {
    slug: 'portfolio',
    title: 'This Portfolio',
    problem:
      'An Astro portfolio with a custom WebGL backdrop and scroll-driven motion.',
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
  {
    slug: 'contextedge',
    title: 'ContextEdge',
    problem:
      'On-device models detect behavioral drift across everyday computing contexts.',
    description:
      'A local behavioral monitoring pipeline that learns separate profiles for activities such as coding and browsing. Isolation Forest and a GRU autoencoder feed persistent drift detection, with observations and model adaptation surfaced in a Streamlit dashboard.',
    highlights: [
      'Activity-specific behavioral profiles',
      'Isolation Forest and GRU anomaly models',
      'ONNX Runtime inference on the device',
      'ADWIN and Page-Hinkley drift detection',
    ],
    technologies: ['Python', 'PyTorch', 'ONNX Runtime', 'scikit-learn', 'Streamlit'],
    categories: ['AI / ML', 'Systems'],
    github: `${GITHUB_PROFILE}/ContextEdge-Privacy-Preserving-Context-Aware-Behavioral-Drift-Detection-`,
    live: null,
    image: 'images/projects/contextedge.svg',
    featured: false,
  },
  {
    slug: 'verifier-induced-reasoning-corruption',
    title: 'Verifier-Induced Reasoning Corruption',
    problem:
      'A research pipeline studying how misleading feedback changes correct LLM answers.',
    description:
      'A paired experiment framework for comparing false-negative correctness feedback with a no-feedback control. Shared initial responses, isolated continuations, exact numeric scoring and append-only records support reproducible analysis without assuming a research outcome.',
    highlights: [
      'Paired control and misleading-feedback branches',
      'Exact numeric answer scoring for GSM8K',
      'Append-only JSONL experiment records',
      'Paired statistics and bootstrap intervals',
    ],
    technologies: ['Python', 'GSM8K', 'JSONL', 'unittest'],
    categories: ['Research', 'AI / ML'],
    github: `${GITHUB_PROFILE}/verifier-induced-reasoning-corruption`,
    live: null,
    image: 'images/projects/verifier-induced-reasoning-corruption.svg',
    featured: false,
  },
  {
    slug: 'career-twin',
    title: 'Career Twin',
    problem:
      'Resume and repository insights connect a skill profile to relevant career paths.',
    description:
      'A career platform with a Java Spring Boot backend, React interface and Python retrieval service. Resume parsing, GitHub analysis and skill matching build a digital profile used for career recommendations.',
    highlights: [
      'PDF resume parsing and skill extraction',
      'GitHub profile and repository analysis',
      'Skill-based career matching',
      'FastAPI retrieval service with ChromaDB',
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'Python', 'FastAPI', 'MySQL'],
    categories: ['Full Stack', 'AI / ML'],
    github: `${GITHUB_PROFILE}/Career-Twin`,
    live: null,
    image: 'images/projects/career-twin.svg',
    featured: false,
  },
  {
    slug: 'system-call-simulation',
    title: 'System Call Simulation',
    problem:
      'A discrete-event model traces user requests through a simulated kernel queue.',
    description:
      'A Python simulation of two user processes submitting system calls to a shared kernel. SimPy models request handling and service delays, while Matplotlib plots queue length over simulated time.',
    highlights: [
      'Two processes sharing a kernel request queue',
      'Time, sleep, file and device call simulation',
      'Response events and simulated error codes',
      'Queue-length visualization with Matplotlib',
    ],
    technologies: ['Python', 'SimPy', 'Matplotlib'],
    categories: ['Systems'],
    github: `${GITHUB_PROFILE}/system-call-simulation`,
    live: null,
    image: 'images/projects/system-call-simulation.svg',
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

/** Repository destination shared by cards and flying covers. */
export function repoUrl(project: Project): string {
  return project.github
}
