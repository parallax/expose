import { h, Component } from 'preact'

export default class Highlighter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      styles: null,
      el: null
    }
    window.setHighlightState = this.setState.bind(this)

    window.setHighlightedElement = this.foo
  }
  foo = (el, state) => {
    let rect = el.getBoundingClientRect()
    let s = {
      ...state,
      el,
      styles: {
        top: `${rect.top - 10 + window.pageYOffset}px`,
        left: `${rect.left - 10}px`,
        width: `${rect.width + 20}px`,
        height: `${rect.height + 20}px`
      }
    }

    if (this.state.el) {
      if (
        this.state.el === el ||
        isDescendant(this.state.el, el) ||
        isDescendant(el, this.state.el)
      ) {
      } else {
        if (s.editableProps) {
          s.variantIndex = undefined
        } else if (typeof s.variantIndex !== 'undefined') {
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
        {typeof this.state.variantIndex !== 'undefined' && (
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
              this.state.stateContainer.add('text', this.state.variantIndex)
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        )}
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
                background: '#453f56',
                border: 0,
                borderRadius: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => {
                window.parent &&
                  window.parent.Expose.showEditableOptions({
                    location: this.state.location,
                    options: this.state.editableProps,
                    stateContainer: this.state.editableStateContainer
                  })
              }}
            >
              <svg width={16} height={16} viewBox="0 0 20 20" fill="#fff">
                <path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
              </svg>
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
