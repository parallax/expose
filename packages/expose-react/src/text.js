import { h, Component } from 'preact'
import { Subscribe, Container } from './unstated.js'
import Location from './location.js'
import dlv from 'dlv'

class TextContainer extends Container {
  constructor(initialValue) {
    super()
    this.state = {
      value: initialValue || 'Lorem ipsum'
    }
  }
  set = value => {
    this.setState({ value })
  }
}

class Foo extends Component {
  constructor(props) {
    super(props)
    let container
    if (window.expose.containers[`${props.location}.${props.name}`]) {
      console.log('yeah')
      container = window.expose.containers[`${props.location}.${props.name}`]
    } else {
      container = window.expose.containers[
        `${props.location}.${props.name}`
      ] = new TextContainer(this.getValue())
    }
    this.state = { container }
  }
  componentDidUpdate() {
    this.state.container.set(this.getValue())
  }
  getValue() {
    return dlv(
      window.expose.data,
      `${this.props.location}.${this.props.name}`,
      'Lorem ipsum'
    )
  }
  render() {
    return (
      <Subscribe to={[this.state.container]}>
        {c => (
          <div contentEditable onKeyUp={e => c.set(e.target.textContent)}>
            {c.state.value}
          </div>
        )}
      </Subscribe>
    )
  }
}

export default class Text extends Component {
  componentDidUpdate() {
    console.log('cDU')
  }
  render() {
    return (
      <Location.Consumer>
        {location => <Foo location={location} {...this.props} />}
      </Location.Consumer>
    )
  }
}
