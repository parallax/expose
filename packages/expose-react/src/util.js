import dlv from 'dlv'

let root = typeof window === 'undefined' ? global : window
let isAdmin = dlv(root, 'Expose.isAdmin', false)

function joinLocation(...locations) {
  return locations
    .filter(x => x !== null && x !== '' && typeof x !== 'undefined') // 0 (zero) is valid
    .join('.')
}

let baseStyles = { all: 'initial', boxSizing: 'border-box' }

let buttonReset = {
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  MsUserSelect: 'none',
  userSelect: 'none'
}

export { root, isAdmin, joinLocation, baseStyles, buttonReset }
