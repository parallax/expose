import { h, Component } from 'preact'
import { Subscribe, Container } from './unstated.js'
import Location from './location.js'
import dlv from 'dlv'
import dset from 'dset'
import editor from './editor.js'
import { root, isAdmin, joinLocation } from './util.js'
import { EditableContainer } from './editable.js'

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
    dset(root.Expose.data, this.location, value)
    this.setState({ value })
  }
}

class Foo extends Component {
  editing = false
  constructor(props) {
    super(props)

    this.location = props.model
      ? joinLocation('$models', props.model.$name, props.model.$id, props.name)
      : joinLocation(props.location, props.name)

    let containerLocation = props.model
      ? joinLocation('$models', props.model.$name, props.model.$id)
      : this.location

    if (!isAdmin) return

    let container

    if (root.Expose.containers[containerLocation]) {
      container = root.Expose.containers[containerLocation]
    } else {
      if (props.model) {
        container = root.Expose.containers[
          containerLocation
        ] = new EditableContainer(
          { [props.name]: this.getValue() },
          this.location
        )
      } else {
        container = root.Expose.containers[
          containerLocation
        ] = new TextContainer(this.getValue(), this.location)
      }
    }
    this.state = { container }
  }
  componentDidMount() {
    if (!isAdmin) return

    root.parent.Expose.loadProseMirror().then(prosemirror => {
      this.prosemirror = prosemirror

      let { schema, plugins } = editor(
        prosemirror,
        this.props.allow || [],
        this.location
      )
      this.schema = schema
      this.plugins = plugins

      this.editor = new prosemirror.view.EditorView(
        { mount: this.root },
        {
          state: prosemirror.state.EditorState.create({
            doc: prosemirror.model.DOMParser.fromSchema(schema).parse(
              this.root,
              {
                preserveWhitespace: true
              }
            ),
            plugins
          })
        }
      )
    })
  }
  componentDidUpdate() {
    let val = this.getValue()
    if (this.props.model) {
      this.state.container.set(this.props.name, val)
    } else {
      this.state.container.set(val)
    }

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
    return dlv(root.Expose.data, this.location, 'Lorem ipsum')
  }
  shouldComponentUpdate() {
    if (!this.prosemirror) return false

    let val = this.getValue()
    let dom = document.createElement('div')
    dom.innerHTML = val

    this.editor.updateState(
      this.prosemirror.state.EditorState.create({
        plugins: this.editor.state.config.plugins,
        doc: this.prosemirror.model.DOMParser.fromSchema(this.schema).parse(
          dom,
          {
            preserveWhitespace: true
          }
        )
      })
    )

    return false
  }
  render() {
    let Tag = this.props.as || 'div'
    let style = {
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      WebkitFontVariantLigatures: 'none',
      fontVariantLigatures: 'none',
      outline: 'none'
    }

    if (!isAdmin) {
      return <Tag dangerouslySetInnerHTML={{ __html: this.getValue() }} />
    }

    return (
      <Subscribe to={[this.state.container]}>
        {c => (
          <Tag
            style={style}
            onBlur={() => {
              this.editing = false
              if (this.props.model) {
                c.set(this.props.name, this.editor.dom.innerHTML)
              } else {
                c.set(this.editor.dom.innerHTML)
              }
            }}
            onMouseEnter={() => {
              window.setHighlightedElement(this.root)
            }}
            onFocus={() => (this.editing = true)}
            dangerouslySetInnerHTML={{
              __html: this.props.model
                ? c.state.value[this.props.name]
                : c.state.value
            }}
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
