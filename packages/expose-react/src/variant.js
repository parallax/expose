import { h, Component } from 'preact'

export default class Variant extends Component {
  render() {
    let { name, render, component: Component, ...props } = this.props
    if (Component) {
      return <Component {...props} />
    }
    return render(props)
  }
}
