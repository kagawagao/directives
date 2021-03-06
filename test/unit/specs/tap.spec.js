import Vue from 'vue'
import tap from 'directives/tap'

Vue.directive('tap', tap)

describe('tap', () => {
  let el
  let vm

  const threshold = window.innerWidth / 10

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    vm.$destroy()
  })

  it('should dispatch tap event', done => {
    vm = new Vue({
      el,
      template: '<div v-tap @tap="onTap"></div>',
      methods: {
        onTap () {
          assert(Date.now() - start < 300, 'should NOT have delay')
          done()
        }
      }
    })

    const start = Date.now()

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: threshold - 1,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')
  })

  it('should NOT bubble tap event', done => {
    vm = new Vue({
      el,
      template: '<div @tap="onTap"><div v-tap></div></div>',
      methods: {
        onTap () {
          assert(false, '')
        }
      }
    })

    setTimeout(done, 50)

    triggerTouchEvents(vm.$el.children[0], 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el.children[0], 'touchend')
  })

  it('should handle touchcancel', done => {
    vm = new Vue({
      el,
      template: '<div v-tap @tap="onTap"></div>',
      methods: {
        onTap () {
          assert(false, 'should NOT be called')
        }
      }
    })

    setTimeout(done, 500)

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchcancel')
  })

  it('should NOT dispatch tap event on disabled element', done => {
    vm = new Vue({
      el,
      template: '<button disabled v-tap @tap="onTap"></button>',
      methods: {
        onTap () {
          assert(false, 'should NOT be called')
        }
      }
    })

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')

    setTimeout(done, 500)
  })

  it('should NOT dispatch tap event', done => {
    vm = new Vue({
      el,
      template: '<div v-tap @tap="onTap"></div>',
      methods: {
        onTap () {
          assert(false, 'should NOT be called')
        }
      }
    })

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      // moving out of range
      e.touches = [{
        pageX: threshold,
        pageY: threshold
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')

    setTimeout(done, 500)
  })

  it('should dispatch tap event with delay', done => {
    vm = new Vue({
      el,
      template: '<div v-tap.delay @tap="onTap"></div>',
      methods: {
        onTap () {
          assert((Date.now() - start > 300) && (Date.now() - start < 500), 'should have 300ms delay be default')
          done()
        }
      }
    })

    const start = Date.now()

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: threshold - 1,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')
  })

  it('should dispatch tap event with given delay', done => {
    vm = new Vue({
      el,
      template: '<div v-tap.delay="500" @tap="onTap"></div>',
      methods: {
        onTap () {
          assert(Date.now() - start >= 500, 'should have 500ms delay')
          done()
        }
      }
    })

    const start = Date.now()

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: threshold - 1,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')
  })
})
