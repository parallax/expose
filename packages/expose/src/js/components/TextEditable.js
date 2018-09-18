import React from 'react'
import Page from './Page.js'
import BackLink from './BackLink.js'
import icons from '../icons.js'

let Commands = ({ editorView, commands }) => (
  <div className="btn-group flex border border-purple-dark rounded mt-4">
    <div
      className="-ml-px flex"
      style={{ height: 35, width: 'calc(100% + 2px)' }}
    >
      {commands.map(command => {
        let Icon = icons[command.name]
        return (
          <button
            key={command.name}
            className={
              'appearance-none relative w-1/6 flex items-center justify-center border-0 rounded-none p-0 bg-transparent' +
              (command.active ? ' is-active' : '')
            }
            onMouseDown={e => {
              e.preventDefault()
              command.command(editorView.state, editorView.dispatch, editorView)
            }}
          >
            {Icon ? (
              <Icon
                className={
                  'relative z-10 ' +
                  (command.active ? 'fill-white' : 'fill-purple-dark')
                }
              />
            ) : (
              command.name
            )}
          </button>
        )
      })}
    </div>
  </div>
)

export default class TextEditable extends React.Component {
  render() {
    let { editorView, commands } = this.props.textEditables[this.props.loc]
    let formatting = commands.filter(c => c.group === 'format')
    let macros = commands.filter(c => c.group === 'macros')

    return (
      <Page>
        <BackLink to="/" />
        <h2>Text Editable</h2>
        {formatting.length > 0 && (
          <Commands commands={formatting} editorView={editorView} />
        )}
        {macros.length > 0 && (
          <Commands commands={macros} editorView={editorView} />
        )}
      </Page>
    )
  }
}
