/**
 * Frame-budget quality tier.
 *
 * The heaviest things on this site — the hero's line field and the WebGL depth
 * layer — are decorative, so their cost should scale with what the visitor's
 * machine can actually pay rather than being fixed at whatever looked fine on
 * one developer laptop.
 *
 * Two signals feed the tier. First the cheap device hints, so a phone or a
 * low-core laptop starts conservative instead of spending its first second
 * discovering it. Then the real frame delta reported by the shared Ticker,
 * which is the only honest measure. The tier only ever steps *down*, and only
 * once: a monitor that could also promote would let the page oscillate between
 * two looks while someone is reading it, which is worse than being slightly
 * too cautious.
 */
import Emitter from './Emitter'

export type QualityTier = 'high' | 'low'

/** ~0.6s of frames at 60fps — long enough to ignore a single hitch. */
const WINDOW_SIZE = 36

/** Sustained frames slower than this (ms) mean the budget is blown. */
const FRAME_BUDGET = 22

/** The loader and hero intro are legitimately spiky; don't judge them. */
const GRACE = 2000

/** Stop measuring after this many clean windows — the monitor isn't free. */
const MAX_WINDOWS = 8

class Quality {
  tier: QualityTier = 'high'

  private first = 0
  private last = 0
  private total = 0
  private frames = 0
  private windows = 0
  private watching = false

  constructor() {
    if (typeof window === 'undefined') return

    const cores = navigator.hardwareConcurrency || 4
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const dense = (window.devicePixelRatio || 1) >= 2

    /*
     * Four cores or fewer is a genuinely low-end machine, and a coarse pointer
     * on a dense screen is a phone or tablet — where a full-viewport fragment
     * shader and 7,000 noise samples a frame are never going to be free.
     */
    if (cores <= 4 || (coarse && dense)) {
      this.tier = 'low'
      return
    }

    this.watching = true
    Emitter.on('tick', this.sample, this)
  }

  /** True when the effects should run at reduced density / update rate. */
  get isLow(): boolean {
    return this.tier === 'low'
  }

  /**
   * Sample the frame delta. `time` arrives in milliseconds from the Ticker.
   */
  private sample(time: number) {
    if (!this.first) {
      this.first = time
      this.last = time

      return
    }

    const delta = time - this.last
    this.last = time

    if (time - this.first < GRACE) return

    // A tab switch or a debugger pause is not a slow frame.
    if (delta <= 0 || delta > 200) return

    this.total += delta
    this.frames++

    if (this.frames < WINDOW_SIZE) return

    const average = this.total / this.frames

    this.total = 0
    this.frames = 0
    this.windows++

    if (average > FRAME_BUDGET) {
      this.downgrade()
    } else if (this.windows >= MAX_WINDOWS) {
      this.stop()
    }
  }

  private downgrade() {
    this.tier = 'low'
    this.stop()

    Emitter.emit('qualitychange', this.tier)
  }

  private stop() {
    if (!this.watching) return

    this.watching = false
    Emitter.off('tick', this.sample, this)
  }
}

export default new Quality()
