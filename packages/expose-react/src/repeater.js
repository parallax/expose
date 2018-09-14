import { h, Component } from 'preact'
import { Subscribe, Container } from './unstated.js'
import Sortable from './sortable.js'
import Location from './location.js'
import dset from 'dset'
import dlv from 'dlv'

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
      dset(window.expose.data, this.location, nextValue)
      return { value: nextValue }
    }, this.broadcast)
  }
  move = (from, to, location) => {
    this.setState(state => {
      let nextValue = state.value.concat([])
      nextValue.splice(to, 0, nextValue.splice(from, 1)[0])
      dset(window.expose.data, location, nextValue)
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
    if (window.expose.containers[location]) {
      container = window.expose.containers[location]
    } else {
      container = window.expose.containers[location] = new RepeaterContainer(
        this.getValue(),
        location
      )
    }
    this.state = { container }
    this.dragging = false
  }
  getValue() {
    return dlv(window.expose.data, this.location, [])
  }
  componentDidUpdate() {
    this.state.container.set(this.getValue())
  }
  render() {
    return (
      <Subscribe to={[this.state.container]}>
        {c => (
          <Sortable
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
            {c.state.value.length === 0 ? (
              <button
                onClick={() => {
                  c.add('text')
                }}
              >
                add
              </button>
            ) : (
              c.state.value.map((v, i) => (
                <Location.Provider
                  value={appendLocation(
                    this.props.location,
                    `${this.props.name}.${i}.$children`
                  )}
                >
                  {this.props.children
                    .filter(child => child.attributes.name === v.name)[0]
                    .attributes.render()}
                </Location.Provider>
              ))
            )}
          </Sortable>
        )}
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
