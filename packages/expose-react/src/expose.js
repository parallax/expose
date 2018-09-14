import { h, Component } from 'preact'
import { Provider } from './unstated.js'
import Location from './location.js'
import Highlighter from './highlighter.js'

export default class Expose extends Component {
  render() {
    return (
      <Location.Provider>
        <Provider>
          <div id="expose">
            {this.props.children}
            <Highlighter />
          </div>
        </Provider>
      </Location.Provider>
    )
  }
}
