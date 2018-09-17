import React from 'react'
import Page from './Page.js'

export default class TextEditable extends React.Component {
  render() {
    let { editorView, commands } = this.props.textEditables[this.props.loc]

    return (
      <Page>
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
      </Page>
    )
  }
}
