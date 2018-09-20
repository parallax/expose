import dlv from 'dlv'

let root = typeof window === 'undefined' ? global : window
let isAdmin = dlv(root, 'Expose.isAdmin', false)

function joinLocation(...locations) {
  return locations
    .filter(x => x !== null && x !== '' && typeof x !== 'undefined') // 0 (zero) is valid
    .join('.')
}

export { root, isAdmin, joinLocation }
