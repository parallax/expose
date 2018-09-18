import { h, Component } from 'preact'
import Editable from './editable.js'

export default class Page extends Component {
  render() {
    return <Editable {...this.props} isPage={true} />
  }
}
