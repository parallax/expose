import { h, Component, cloneElement } from 'preact'
import { Subscribe, Container } from './unstated.js'
import Sortable from './sortable.js'
import Location from './location.js'
import dset from 'dset'
import dlv from 'dlv'
import { root, isAdmin } from './util.js'

let Wrapper = ({ condition, ifTrue, ifFalse, children }) =>
  condition ? ifTrue(children) : ifFalse(children)

class RepeaterContainer extends Container {
  constructor(initialValue, location) {
    super()
    this.location = location
    this.state = {
      value: initialValue || []
    }
  }
  set = value => {
    this.setState({ value })
  }
  add = (name, after) => {
    this.setState(state => {
      let nextValue = state.value.concat([])
      if (typeof after !== 'undefined') {
        nextValue.splice(after + 1, 0, { name, $children: {} })
      } else {
        nextValue.push({ name, $children: {} })
      }
      dset(root.Expose.data, this.location, nextValue)
      return { value: nextValue }
    }, this.broadcast)
  }
  move = (from, to, location) => {
    this.setState(state => {
      let nextValue = state.value.concat([])
      nextValue.splice(to, 0, nextValue.splice(from, 1)[0])
      dset(root.Expose.data, location, nextValue)
      return { value: nextValue }
    })
  }
}

class RepeaterInner extends Component {
  constructor(props) {
    super(props)
    let location = appendLocation(props.location, props.name)
    this.location = location
    let container
    if (root.Expose.containers[location]) {
      container = root.Expose.containers[location]
    } else {
      container = root.Expose.containers[location] = new RepeaterContainer(
        this.getValue(),
        location
      )
    }
    this.state = { container }
    this.dragging = false
  }
  getValue() {
    return dlv(root.Expose.data, this.location, [])
  }
  componentDidUpdate() {
    this.state.container.set(this.getValue())
  }
  render() {
    return (
      <Subscribe to={[this.state.container]}>
        {c => {
          let variantCount = {}

          return (
            <Wrapper
              condition={isAdmin}
              ifTrue={children => (
                <Sortable
                  {...this.props}
                  data-expose-repeater={this.props.location}
                  onStart={() => {
                    this.dragging = true
                  }}
                  onEnd={() => {
                    this.dragging = false
                  }}
                  onChange={(order, sortable, e) => {
                    c.move(
                      e.oldIndex,
                      e.newIndex,
                      appendLocation(this.props.location, this.props.name)
                    )
                  }}
                  onMouseOver={e => {
                    if (this.dragging) return
                    let v = e.target.closest(
                      `[data-expose-repeater="${this.props.location}"] > *`
                    )
                    if (!v) return

                    e.stopPropagation()

                    window.setHighlightedElement(v, {
                      variantIndex: getElementIndex(v),
                      variants: this.props.children.map(n => n.attributes.name),
                      stateContainer: c,
                      editableProps: null
                    })
                    // let rect = v.getBoundingClientRect()
                    // window.setHighlightState({
                    //   variantIndex: getElementIndex(v),
                    //   variants: this.props.children.map(n => n.attributes.name),
                    //   stateContainer: c,
                    //   styles: {
                    //     top: `${rect.top - 10 + window.pageYOffset}px`,
                    //     left: `${rect.left - 10}px`,
                    //     width: `${rect.width + 20}px`,
                    //     height: `${rect.height + 20}px`
                    //   }
                    // })
                  }}
                >
                  {children}
                </Sortable>
              )}
              ifFalse={children => (
                <Wrapper
                  condition={c.state.value.length === 0}
                  ifTrue={e => e[0]}
                  ifFalse={e => <div {...this.props}>{e}</div>}
                >
                  {children}
                </Wrapper>
              )}
            >
              {c.state.value.length === 0 ? (
                isAdmin ? (
                  <button
                    onClick={() => {
                      c.add('text')
                    }}
                  >
                    add
                  </button>
                ) : null
              ) : (
                c.state.value.map((v, i) => {
                  variantCount[v.name] =
                    typeof variantCount[v.name] === 'undefined'
                      ? 1
                      : variantCount[v.name] + 1

                  return (
                    <Location.Provider
                      value={appendLocation(
                        this.props.location,
                        `${this.props.name}.${i}.$children`
                      )}
                    >
                      {cloneElement(
                        this.props.children.filter(
                          child => child.attributes.name === v.name
                        )[0],
                        { index: i, variantIndex: variantCount[v.name] - 1 }
                      )}
                    </Location.Provider>
                  )
                })
              )}
            </Wrapper>
          )
        }}
      </Subscribe>
    )
  }
}

export default class Repeater extends Component {
  render() {
    return (
      <Location.Consumer>
        {location => <RepeaterInner location={location} {...this.props} />}
      </Location.Consumer>
    )
  }
}

function getElementIndex(node) {
  var index = 0
  while ((node = node.previousElementSibling)) {
    index++
  }
  return index
}

function appendLocation(currentLocation, add) {
  if (currentLocation === '') return add
  return `${currentLocation}.${add}`
}
