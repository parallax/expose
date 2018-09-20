import { h, Component } from 'preact'
import Location from './location.js'
import { Subscribe, Container } from './unstated.js'
import dlv from 'dlv'
import dset from 'dset'
import { root, isAdmin, joinLocation } from './util.js'

class EditableContainer extends Container {
  constructor(initialValue, location) {
    super()
    this.state = {
      value: initialValue || {}
    }
    this.location = location
  }
  set = (key, value) => {
    if (typeof value === 'undefined') {
      dset(root.Expose.data, this.location, key)
      this.setState({ value: key })
    } else {
      dset(root.Expose.data, joinLocation(this.location, key), value)
      this.setState(state => {
        return {
          value: {
            ...state.value,
            [key]: value
          }
        }
      })
    }
  }
}

class Foo extends Component {
  constructor(props) {
    super(props)
    let container

    this.location = props.model
      ? joinLocation('$models', props.model.$name, props.model.$id, props.name)
      : joinLocation(props.location, props.name)

    if (root.Expose.containers[this.location]) {
      container = root.Expose.containers[this.location]
    } else {
      container = root.Expose.containers[this.location] = new EditableContainer(
        this.getValue(),
        this.location
      )
    }
    this.state = { container }

    if (isAdmin) {
      this.foo = e => {
        console.log('hmmm')
        window.setHighlightedElement(e.target, {
          location: this.location,
          editableProps: this.props.props,
          editableStateContainer: this.state.container
        })
      }
    }
  }
  componentDidMount() {
    if (!isAdmin) return

    if (this.props.isPage) {
      window.parent &&
        window.parent.Expose &&
        window.parent.Expose.setPage(this.location)

      window.parent &&
        window.parent.Expose &&
        window.parent.Expose.setEditableOptions({
          location: this.location,
          options: this.props.props,
          stateContainer: this.state.container
        })
    } else {
      this.base.addEventListener('mouseenter', this.foo)
    }
  }
  componentWillUnmount() {
    if (isAdmin && !this.props.isPage) {
      this.base.removeEventListener('mouseenter', this.foo)
    }
  }
  getValue() {
    return filter(this.props.props, dlv(root.Expose.data, this.location, {}))
  }
  componentDidUpdate() {
    this.state.container.set(this.getValue())
  }
  render() {
    return (
      <Subscribe to={[this.state.container]}>
        {c =>
          typeof this.props.children[0] === 'function'
            ? this.props.children[0](c.state.value)
            : this.props.children[0]
        }
      </Subscribe>
    )
  }
}

export default class Editable extends Component {
  render() {
    return (
      <Location.Consumer>
        {location => <Foo location={location} {...this.props} />}
      </Location.Consumer>
    )
  }
}

function filter(definedProps, data) {
  let definedNames = Object.keys(definedProps)

  return definedNames.reduce((acc, name) => {
    return { ...acc, [name]: data[name] || getDefault(definedProps[name]) }
  }, {})
  // let d = Object.keys(data).reduce((acc, curr) => {
  //   if (curr.indexOf('$') === 0) return acc
  //   if (definedNames.indexOf(curr) === -1) return acc
  //   return { ...acc, [curr]: data[curr] }
  // }, {})

  // definedNames.forEach(name => {
  //   if (!d[name]) {
  //     d[name] = getDefault(definedProps[name])
  //   }
  // })

  // return d
}

function getDefault(data) {
  if (typeof data.default !== 'undefined') return data.default
  if (data.type === 'number') {
    if (typeof data.min !== 'undefined') return data.min
    return 0
  }
  if (data.type === 'date' || data.type === 'datetime') {
    if (typeof data.min !== 'undefined') return data.min
    if (typeof data.max !== 'undefined') return data.max
    let today = new Date()
    let date = `${today.getFullYear()}-${pad(
      `${today.getMonth() + 1}`,
      '0',
      2
    )}-${pad(`${today.getDate()}`, '0', 2)}`
    if (data.type === 'date') return date
    return (
      date +
      'T' +
      pad(`${today.getHours()}`, '0', 2) +
      ':' +
      pad(`${today.getMinutes()}`, '0', 2) +
      ':00'
    )
  }
  if (data.type === 'text') return ''
}

function pad(str, padStr, length) {
  return (repeat(padStr, length) + str).substring(str.length)
}

function repeat(str, length) {
  return Array(length + 1).join(str)
}
