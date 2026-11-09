import { test } from 'node:test'
import assert from 'node:assert/strict'
import { initProjectMotion } from '../src/utils/projectMotion.ts'

function fixture(t, { reduced = false, pinned = false } = {}) {
  class Classes extends Set {
    contains(value) { return this.has(value) }
    add(...values) { values.forEach(value => super.add(value)) }
    remove(...values) { values.forEach(value => this.delete(value)) }
    toggle(value, force) { if (force) this.add(value); else this.delete(value) }
  }
  class Element {
    classList = new Classes()
    listeners = new Map()
    properties = new Map()
    style = { setProperty: (key, value) => this.properties.set(key, value) }
    addEventListener(type, handler) { this.listeners.set(type, handler) }
    removeEventListener(type) { this.listeners.delete(type) }
    emit(type, event = {}) { this.listeners.get(type)?.(event) }
  }
  const slots = Array.from({ length: 8 }, () => new Element())
  const root = new Element()
  root.querySelectorAll = () => slots
  root.contains = slot => slots.includes(slot)
  if (pinned) root.classList.add('is-cluster-js')
  const document = new Element()
  document.hidden = false
  const preference = new Element()
  preference.matches = reduced
  let intersection, mutation
  class IntersectionObserver {
    disconnected = false
    constructor(callback) { this.callback = callback; intersection = this }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  class MutationObserver {
    disconnected = false
    constructor(callback) { this.callback = callback; mutation = this }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const globals = { document, window: { IntersectionObserver, matchMedia: () => preference }, IntersectionObserver, MutationObserver }
  const previous = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  Object.entries(globals).forEach(([key, value]) => Object.defineProperty(globalThis, key, { configurable: true, writable: true, value }))
  t.after(() => previous.forEach((descriptor, key) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor)
    else delete globalThis[key]
  }))
  const cleanup = initProjectMotion(root)
  return {
    slots, root, document, preference, intersection, mutation, cleanup,
    show: (...indices) => intersection.callback(indices.map(index => ({ target: slots[index], isIntersecting: true }))),
    hide: (...indices) => intersection.callback(indices.map(index => ({ target: slots[index], isIntersecting: false }))),
  }
}

test('waits for the pinned aperture, then staggers visible cards in DOM order', t => {
  const f = fixture(t, { pinned: true })
  f.show(2, 0, 1)
  assert.ok(f.slots.every(slot => !slot.classList.contains('is-entered')))
  f.root.classList.add('is-cluster')
  f.mutation.callback()
  assert.deepEqual(f.slots.slice(0, 3).map(slot => slot.properties.get('--entrance-delay')), ['0ms', '120ms', '240ms'])
  assert.ok(f.slots.slice(0, 3).every(slot => slot.classList.contains('is-motion-visible')))
  assert.ok(f.slots.slice(3).every(slot => !slot.classList.contains('is-entered')))
})

test('later rail cards enter on first visibility and never replay on re-entry', t => {
  const f = fixture(t)
  f.show(0, 1)
  f.hide(0, 1)
  assert.equal(f.slots[0].classList.contains('is-motion-visible'), false)
  f.show(6, 7)
  assert.equal(f.slots[6].properties.get('--entrance-delay'), '0ms')
  assert.equal(f.slots[7].properties.get('--entrance-delay'), '120ms')
  f.slots[0].properties.set('--entrance-delay', 'already-played')
  f.show(0)
  assert.equal(f.slots[0].properties.get('--entrance-delay'), 'already-played')
})

test('entrance completion settles only its wrapper while the orbit remains active', t => {
  const f = fixture(t)
  f.show(0)
  f.root.emit('animationend', { target: {
    classList: { contains: name => name === 's__entrance' },
    closest: () => f.slots[0],
  } })
  assert.equal(f.slots[0].classList.contains('is-settled'), true)
  assert.equal(f.slots[0].classList.contains('is-motion-visible'), true)
})

test('reduced motion reveals all eight immediately and does not replay when disabled', t => {
  const f = fixture(t, { reduced: true })
  assert.ok(f.slots.every(slot => slot.classList.contains('is-entered') && slot.classList.contains('is-settled')))
  f.show(0, 1)
  assert.ok(f.slots.every(slot => !slot.classList.contains('is-motion-visible')))
  f.preference.matches = false
  f.preference.emit('change')
  assert.equal(f.slots[0].classList.contains('is-motion-visible'), true)
  assert.equal(f.slots[0].classList.contains('is-settled'), true)
})

test('hidden tabs pause active motion and keyboard focus reveals off-rail destinations', t => {
  const f = fixture(t)
  f.show(0)
  f.document.hidden = true
  f.document.emit('visibilitychange')
  assert.equal(f.slots[0].classList.contains('is-motion-visible'), false)
  f.document.hidden = false
  f.document.emit('visibilitychange')
  assert.equal(f.slots[0].classList.contains('is-motion-visible'), true)
  f.root.emit('focusin', { target: { closest: () => f.slots[7] } })
  assert.equal(f.slots[7].classList.contains('is-focus-revealed'), true)
  assert.equal(f.slots[7].properties.get('--entrance-delay'), '0ms')
})

test('teardown removes observers and listeners and leaves every card readable', t => {
  const f = fixture(t)
  f.cleanup()
  assert.equal(f.intersection.disconnected, true)
  assert.equal(f.mutation.disconnected, true)
  assert.equal(f.root.listeners.size, 0)
  assert.equal(f.document.listeners.size, 0)
  assert.equal(f.preference.listeners.size, 0)
  assert.equal(f.root.classList.contains('has-project-motion'), false)
  assert.ok(f.slots.every(slot => slot.classList.contains('is-entered')))
})
