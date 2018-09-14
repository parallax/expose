import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from '@reach/router'
import Router, { navigate } from './components/Router.js'
import EditableOptions from './components/EditableOptions.js'
import { Provider } from 'unstated'
import BackLink from './components/BackLink.js'
import '../css/main.css'
import icons from './icons.js'

window.Expose = {}

let MenuLink = ({ to, children }) => (
  <Link
    to={to}
    className="menu-link no-underline flex items-center h-8 rounded text-purple-dark px-6 mb-4"
    style={{
      transition: 'background 0.3s'
    }}
  >
    {children}
  </Link>
)

let Home = () => (
  <div className="p-6">
    <MenuLink to="/page-options">
      <svg width={20} height={20} className="fill-current mr-4">
        <path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
      </svg>
      Page Options
    </MenuLink>
    <MenuLink to="/blog-posts">
      <svg
        width={20}
        height={20}
        className="fill-current mr-4"
        viewBox="0 0 24 24"
      >
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      </svg>
      Blog Posts
    </MenuLink>
    <div className="btn-group flex border border-purple-dark rounded">
      <div
        className="-ml-px flex"
        style={{ height: 35, width: 'calc(100% + 2px)' }}
      >
        <button
          type="button"
          className="appearance-none relative w-1/6 border-0 rounded-none p-0 bg-transparent"
        />
        <button
          type="button"
          className="appearance-none relative w-1/6 border-0 rounded-none p-0 bg-transparent"
        />
        <button
          type="button"
          className="appearance-none relative w-1/6 border-0 rounded-none p-0 bg-transparent"
        />
        <button
          type="button"
          className="appearance-none relative w-1/6 border-0 rounded-none p-0 bg-transparent"
        />
        <button
          type="button"
          className="appearance-none relative w-1/6 border-0 rounded-none p-0 bg-transparent"
        />
        <button
          type="button"
          className="appearance-none relative w-1/6 border-0 rounded-none p-0 bg-transparent"
        />
      </div>
    </div>
  </div>
)

let PageOptions = () => (
  <div className="p-6">
    <BackLink to="/" />
    <h2>Page Options</h2>
  </div>
)
let BlogPosts = () => (
  <div className="p-6">
    <BackLink to="/" />
    <h2>Blog Posts</h2>
  </div>
)

let TextEditable = ({ textEditables, loc }) => {
  let { editorView, commands } = textEditables[loc]
  return (
    <div className="p-6">
      <BackLink to="/" />
      <h2>Text Editable</h2>
      <div className="btn-group flex border border-purple-dark rounded">
        <div
          className="-ml-px flex"
          style={{ height: 35, width: 'calc(100% + 2px)' }}
        >
          {commands.map(command => {
            let Icon = icons[command.name]
            return (
              <button
                className={
                  'appearance-none relative w-1/6 flex items-center justify-center border-0 rounded-none p-0 bg-transparent' +
                  (command.active ? ' is-active' : '')
                }
                onMouseDown={e => {
                  e.preventDefault()
                  command.command(
                    editorView.state,
                    editorView.dispatch,
                    editorView
                  )
                }}
              >
                <Icon
                  className={
                    'relative z-10 ' +
                    (command.active ? 'fill-white' : 'fill-purple-dark')
                  }
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

class App extends React.Component {
  state = {
    manageFocus: true,
    editables: {},
    editableOptions: [],
    editableStateContainer: null,
    // textEditableEditorView: null,
    // textEditableCommands: []
    textEditables: {}
  }
  showEditableOptions = ({ location, options, stateContainer }) => {
    this.setState(
      state => ({
        manageFocus: true,
        editables: {
          ...state.editables,
          [location]: { options, stateContainer }
        }
      }),
      () => {
        navigate('/editable-options/' + location)
      }
    )
    // this.setState(
    //   { editableOptions: options, editableStateContainer: stateContainer },
    //   () => {
    //     navigate('/editable-options')
    //   }
    // )
  }
  showTextEditable = a => {
    this.updateTextEditable(a, () => {
      navigate('/text-editable/' + a.location)
    })
  }
  updateTextEditable = ({ location, editor, commands }, cb) => {
    this.setState(
      state => ({
        manageFocus: false,
        // textEditableEditorView: editor,
        // textEditableCommands: commands
        textEditables: {
          ...state.textEditables,
          [location]: {
            editorView: editor,
            commands
          }
        }
      }),
      cb
    )
  }
  componentDidMount() {
    window.Expose.showEditableOptions = this.showEditableOptions
    window.Expose.showTextEditable = this.showTextEditable
    window.Expose.updateTextEditable = this.updateTextEditable
  }
  render() {
    return (
      <Provider>
        <div className="flex h-screen">
          <Router primary={this.state.manageFocus}>
            <Home path="/" />
            <PageOptions path="/page-options" />
            <BlogPosts path="/blog-posts" />
            <EditableOptions
              path="/editable-options/:loc"
              editables={this.state.editables}
              // props={this.state.editableOptions}
              // stateContainer={this.state.editableStateContainer}
            />
            <TextEditable
              path="/text-editable/:loc"
              // editorView={this.state.textEditableEditorView}
              // commands={this.state.textEditableCommands}
              textEditables={this.state.textEditables}
            />
          </Router>
          <iframe src="/nocache" className="relative border-0 w-full" />
        </div>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
