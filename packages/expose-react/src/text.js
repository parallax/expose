import { h, Component } from 'preact'
import { Subscribe, Container } from './unstated.js'
import Location from './location.js'
import dlv from 'dlv'
import dset from 'dset'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import editor from './editor.js'

// let schema = new Schema({
//   nodes: {
//     doc: { content: 'text*' },
//     text: {
//       group: 'inline'
//     }
//   },
//   marks: {}
// })

class TextContainer extends Container {
  constructor(initialValue, location) {
    super()
    this.state = {
      value: initialValue || 'Lorem ipsum'
    }
    this.location = location
  }
  set = value => {
    dset(window.expose.data, this.location, value)
    this.setState({ value })
  }
}

class Foo extends Component {
  editing = false
  constructor(props) {
    super(props)
    let container
    if (window.expose.containers[`${props.location}.${props.name}`]) {
      console.log('yeah')
      container = window.expose.containers[`${props.location}.${props.name}`]
    } else {
      container = window.expose.containers[
        `${props.location}.${props.name}`
      ] = new TextContainer(this.getValue(), `${props.location}.${props.name}`)
    }
    this.state = { container }
  }
  componentDidMount() {
    let { schema, plugins } = editor(
      this.props.allow || [],
      `${this.props.location}.${this.props.name}`
    )
    this.schema = schema
    this.plugins = plugins

    this.editor = new EditorView(
      { mount: this.root },
      {
        state: EditorState.create({
          doc: DOMParser.fromSchema(schema).parse(this.root, {
            preserveWhitespace: true
          }),
          plugins
        })
      }
    )
  }
  componentDidUpdate() {
    let val = this.getValue()
    this.state.container.set(val)

    let dom = document.createElement('div')
    dom.innerHTML = val

    console.log(val)

    // this.editor.updateState(
    //   EditorState.create({
    //     plugins: this.editor.state.config.plugins,
    //     doc: DOMParser.fromSchema(this.schema).parse(dom, {
    //       preserveWhitespace: true
    //     })
    //   })
    // )

    // this.editor = new EditorView(
    //   { mount: this.root },
    //   {
    //     state: EditorState.create({
    //       doc: DOMParser.fromSchema(this.schema).parse(dom, {
    //         preserveWhitespace: true
    //       }),
    //       plugins: this.plugins
    //     })
    //   }
    // )
  }
  getValue() {
    return dlv(
      window.expose.data,
      `${this.props.location}.${this.props.name}`,
      'Lorem ipsum'
    )
  }
  shouldComponentUpdate() {
    let val = this.getValue()
    let dom = document.createElement('div')
    dom.innerHTML = val

    this.editor.updateState(
      EditorState.create({
        plugins: this.editor.state.config.plugins,
        doc: DOMParser.fromSchema(this.schema).parse(dom, {
          preserveWhitespace: true
        })
      })
    )

    return false
  }
  render() {
    let Tag = this.props.as || 'div'

    return (
      <Subscribe to={[this.state.container]}>
        {c => (
          <Tag
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              WebkitFontVariantLigatures: 'none',
              fontVariantLigatures: 'none'
            }}
            onBlur={() => {
              this.editing = false
              c.set(this.editor.dom.innerHTML)
            }}
            onMouseEnter={() => {
              window.setHighlightedElement(this.root)
            }}
            onFocus={() => (this.editing = true)}
            dangerouslySetInnerHTML={{ __html: c.state.value }}
            ref={ref =>
              (this.root = ref)
            } /*contentEditable onKeyUp={e => c.set(e.target.textContent)}*/
          />
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
