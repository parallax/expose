import { h, Component } from 'preact'

export default class Highlighter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      styles: null,
      el: null,
      active: false,
      showVariantList: false
    }
  }
  componentDidMount() {
    window.setHighlightState = this.setState.bind(this)
    window.setHighlightedElement = this.setHighlightedElement
    window.updateHighlight = this.updateHighlight
  }
  updateHighlight = () => {
    let rect = this.state.el.getBoundingClientRect()
    this.setState({
      styles: {
        top: `${rect.top - 10 + window.pageYOffset}px`,
        left: `${rect.left - 10}px`,
        width: `${rect.width + 20}px`,
        height: `${rect.height + 20}px`,
        transition: 'none'
      }
    })
  }
  setHighlightedElement = (el, state = {}) => {
    if (this.state.active) return

    let rect = el.getBoundingClientRect()
    let s = {
      ...state,
      el,
      showVariantList: false,
      styles: {
        top: `${rect.top - 10 + window.pageYOffset}px`,
        left: `${rect.left - 10}px`,
        width: `${rect.width + 20}px`,
        height: `${rect.height + 20}px`,
        transition: '250ms'
      }
    }

    if (this.state.el) {
      if (
        this.state.el === el ||
        isDescendant(this.state.el, el) ||
        isDescendant(el, this.state.el)
      ) {
      } else {
        if (typeof s.variantIndex === 'undefined') {
          s.variantIndex = undefined
        }
        if (typeof s.editableProps === 'undefined') {
          s.editableProps = null
        }
      }
    }

    this.setState(s)
    // state.editableStateContainer &&
    //   state.editableStateContainer.set({ color: 'red' })
  }
  render() {
    return this.state.styles ? (
      <div
        style={{
          position: 'absolute',
          border: '1px dashed #8360d6',
          pointerEvents: 'none',
          ...this.state.styles
        }}
      >
        {typeof this.state.variantIndex !== 'undefined' &&
          (this.state.showVariantList ? (
            <ul
              style={{
                listStyle: 'none',
                position: 'absolute',
                top: '100%',
                marginTop: -16,
                left: '100%',
                marginLeft: -16,
                padding: 0,
                pointerEvents: 'auto',
                width: 180,
                background: 'white',
                boxShadow: '0 8px 20px 0 rgba(0, 0, 0, 0.24)'
              }}
            >
              {this.state.variants.map(variant => (
                <li key={variant}>
                  <button
                    type="button"
                    style={{
                      appearance: 'none',
                      display: 'block',
                      width: '100%',
                      padding: '0 18px',
                      borderRadius: 0,
                      border: 0,
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#453f56',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      height: 42
                    }}
                    onClick={() => {
                      this.state.stateContainer.add(
                        variant,
                        this.state.variantIndex
                      )
                      this.setState({ showVariantList: false })
                    }}
                  >
                    {kebabToSentence(variant)}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <button
              type="button"
              style={{
                appearance: 'none',
                position: 'absolute',
                bottom: -16,
                right: -16,
                width: 32,
                height: 32,
                border: 0,
                borderRadius: 0,
                padding: 0,
                background: '#453f56',
                pointerEvents: 'auto',
                boxShadow: '0px 4px 9px 0px rgba(0,0,0,0.39)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (this.state.variants.length === 1) {
                  this.state.stateContainer.add(
                    this.state.variants[0],
                    this.state.variantIndex
                  )
                } else {
                  this.setState({ showVariantList: true })
                }
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
          ))}
        {this.state.editableProps && (
          <div
            style={{
              position: 'absolute',
              top: -1,
              left: -32,
              pointerEvents: 'auto',
              boxShadow: '0px 4px 9px 0px rgba(0,0,0,0.39)',
              display: 'flex'
            }}
          >
            <button
              class="expose-show-editable-popout"
              type="button"
              style={{
                appearance: 'none',
                width: 32,
                height: 32,
                background: this.state.active ? '#8360d6' : '#453f56',
                border: 0,
                borderRadius: 0,
                padding: 0,
                display: 'block',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (this.state.active) {
                  this.setState({ active: false })
                  window.parent &&
                    window.parent.Expose &&
                    window.parent.Expose.closeEditableOptions()
                  return
                }

                this.setState({ active: true })
                window.parent &&
                  window.parent.Expose &&
                  window.parent.Expose.showEditableOptions({
                    location: this.state.location,
                    options: this.state.editableProps,
                    stateContainer: this.state.editableStateContainer
                  })
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="#fff"
                  style={{
                    transition: 'opacity 0.25s, transform 0.25s',
                    opacity: this.state.active ? 1 : 0,
                    transform: this.state.active ? '' : 'scale(0.8)'
                  }}
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 20 20"
                  fill="#fff"
                  style={{
                    transition: 'opacity 0.25s, transform 0.25s',
                    opacity: this.state.active ? 0 : 1,
                    transform: this.state.active ? 'scale(0.8)' : ''
                  }}
                >
                  <path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>
    ) : null
  }
}

function isDescendant(parent, child) {
  let node = child.parentNode
  while (node !== null) {
    if (node === parent) {
      return true
    }
    node = node.parentNode
  }
  return false
}

function kebabToSentence(string) {
  return string
    .replace(/^[a-z]/, m => m.toUpperCase())
    .replace(/-([a-z])/i, (m, p1) => ' ' + p1.toLowerCase())
}
