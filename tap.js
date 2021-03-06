/**
 * Simple directive for mocking tap event
 */
import { createEvent, checkOptionsSupported } from './util'

const opts = checkOptionsSupported() ? {
  passive: false
} : false

export default {
  name: 'tap',

  bind (el, { value, modifiers }) {
    const threshold = window.innerWidth / 10
    let startPoint

    el.addEventListener('touchstart', el._tap_touchstart = e => {
      startPoint = null

      // 仅允许单点触摸
      if (e.touches && e.touches.length === 1) {
        // fix e.touches bug in iOS 8.1.3:
        // touchmove 与 touchstart 的 e.touches[0] 是同一个对象
        startPoint = {
          pageX: e.touches[0].pageX,
          pageY: e.touches[0].pageY
        }

        el.addEventListener('touchmove', el._tap_touchmove = e => {
          if (startPoint) {
            if (Math.pow(e.touches[0].pageX - startPoint.pageX, 2) + Math.pow(e.touches[0].pageY - startPoint.pageY, 2) > threshold * threshold) {
              startPoint = null
            }
          }
        }, opts)

        el.addEventListener('touchend', el._tap_touchend = e => {
          el.removeEventListener('touchmove', el._tap_touchmove)
          el.removeEventListener('touchcancel', el._tap_touchcancel)
          el.removeEventListener('touchend', el._tap_touchend)

          // not fire tap event on disabled element
          const disabled = e.currentTarget.disabled

          if (startPoint && !disabled) {
            startPoint = null

            // dispatch a tap event
            const tapEvent = createEvent('tap', null, { originalEvent: e })

            if (modifiers.delay) {
              // useful for hiding el after tap that has a link inside
              // see: components/navibar.vue
              setTimeout(() => {
                el.dispatchEvent(tapEvent)
              }, value || 300)
            } else {
              el.dispatchEvent(tapEvent)
            }
          }
        }, opts)

        el.addEventListener('touchcancel', el._tap_touchcancel = e => {
          el.removeEventListener('touchmove', el._tap_touchmove)
          el.removeEventListener('touchcancel', el._tap_touchcancel)
          el.removeEventListener('touchend', el._tap_touchend)

          if (startPoint) {
            startPoint = null
          }
        }, opts)
      }
    }, opts)
  },

  unbind (el) {
    el.removeEventListener('touchstart', el._tap_touchstart)
    el.removeEventListener('touchmove', el._tap_touchmove)
    el.removeEventListener('touchcancel', el._tap_touchcancel)
    el.removeEventListener('touchend', el._tap_touchend)
  }
}
