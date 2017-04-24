export function createEvent (name, options, mixins) {
  let event
  try {
    // Not supported in some versions of Android's old WebKit-based WebView
    // use document.createEvent() instead
    event = new Event(name, options)
  } catch (e) {
    if (!options) {
      options = {}
    }
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(name, !!options.bubbles, !!options.cancelable)
  }
  return Object.assign(event, mixins)
}

export const checkOptionsSupported = (function () {
  let supported = false
  try {
    window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
      get () {
        supported = true
      }
    }))
  } catch (e) {}

  return () => supported
})()
