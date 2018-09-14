import { h, Component } from 'preact'

export default class Highlighter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      styles: null
    }
    window.setHighlightState = this.setState.bind(this)

    window.setHighlightedElement = this.foo
  }
  foo = (el, state) => {
    let rect = el.getBoundingClientRect()
    this.setState({
      ...state,
      styles: {
        top: `${rect.top - 10 + window.pageYOffset}px`,
        left: `${rect.left - 10}px`,
        width: `${rect.width + 20}px`,
        height: `${rect.height + 20}px`
      }
    })
    // state.editableStateContainer &&
    //   state.editableStateContainer.set({ color: 'red' })
  }
  render() {
    return this.state.styles ? (
      <div
        style={{
          position: 'absolute',
          border: '1px solid red',
          pointerEvents: 'none',
          ...this.state.styles
        }}
      >
        {typeof this.state.variantIndex !== 'undefined' && (
          <button
            type="button"
            style={{
              position: 'absolute',
              bottom: -16,
              right: -16,
              width: 32,
              height: 32,
              background: 'blue',
              pointerEvents: 'auto'
            }}
            onClick={() => {
              this.state.stateContainer.add('text', this.state.variantIndex)
            }}
          />
        )}
        {this.state.editableProps && (
          <button
            class="expose-show-editable-popout"
            type="button"
            style={{
              position: 'absolute',
              top: -1,
              left: -32,
              width: 32,
              height: 32,
              pointerEvents: 'auto'
            }}
            onClick={() => {
              window.parent &&
                window.parent.Expose.showEditableOptions({
                  location: this.state.location,
                  options: this.state.editableProps,
                  stateContainer: this.state.editableStateContainer
                })
            }}
          />
        )}
      </div>
    ) : null
  }
}
