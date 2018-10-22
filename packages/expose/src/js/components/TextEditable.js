import React from 'react'
import Page from './Page.js'
import BackLink from './BackLink.js'
import icons from '../icons.js'
import dlv from 'dlv'

export default class TextEditable extends React.Component {
  render() {
    let { editorView, commands, dropdown } = this.props.textEditables[
      this.props.loc
    ]

    return (
      <Page>
        <BackLink to="/" />
        <h2>Text Editable</h2>
        {dropdown &&
          dropdown.length > 0 && (
            <select
              onChange={e => {
                dropdown
                  .filter(x => x.name === e.target.value)[0]
                  .command(editorView.state, editorView.dispatch, editorView)
              }}
              value={dlv(dropdown.filter(x => x.active), '0.name', '')}
            >
              <option value="" disabled>
                Type
              </option>
              {dropdown.map(command => (
                <option key={command.name} value={command.name}>
                  {command.prettyName}
                </option>
              ))}
            </select>
          )}
        <div className="btn-group flex border border-purple-dark rounded">
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
                    (command.active ? ' is-active ' : '') +
                    (command.enabled ? '' : ' cursor-not-allowed ')
                  }
                  disabled={!command.enabled}
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
                      'relative z-10' +
                      (command.active ? ' fill-white ' : ' fill-purple-dark ') +
                      (command.enabled ? '' : ' opacity-25 ')
                    }
                  />
                </button>
              )
            })}
          </div>
        </div>
      </Page>
    )
  }
}
