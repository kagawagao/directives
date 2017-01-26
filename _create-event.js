export default (name, bubbles, mixins = {}) => {
  const e = new Event(name, { bubbles, cancelable: true })
  return Object.assign(e, mixins)
}
