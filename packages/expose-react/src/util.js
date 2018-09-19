import dlv from 'dlv'

let root = typeof window === 'undefined' ? global : window
let isAdmin = dlv(root, 'Expose.isAdmin', false)

export { root, isAdmin }
