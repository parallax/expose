let root = typeof window === 'undefined' ? global : window

root.Expose = root.Expose || {
  containers: {},
  data: {}
}

export { default as Expose } from './expose.js'
export { default as Text } from './text.js'
export { default as Editable } from './editable.js'
export { default as Repeater } from './repeater.js'
export { default as Variant } from './variant.js'
export { default as Page } from './page.js'
