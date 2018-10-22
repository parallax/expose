import React from 'react'
import Page from './Page.js'
import BackLink from './BackLink.js'
import icons from '../icons.js'
import dlv from 'dlv'
import Select from 'react-select'

export default class TextEditable extends React.Component {
  render() {
    let { editorView, commands, dropdown = [] } = this.props.textEditables[
      this.props.loc
    ]

    let options = dropdown.map(command => ({
      value: command.name,
      label: command.prettyName,
      active: command.active
    }))

    return (
      <Page>
        <BackLink to="/" />
        <h2>Text Editable</h2>
        {dropdown &&
          dropdown.length > 0 && (
            <Select
              styles={{
                control: (base, { isFocused }) => ({
                  ...base,
                  background: isFocused ? 'white' : 'transparent',
                  borderColor: isFocused ? '#282828' : '#453f56',
                  boxShadow: 'none',
                  ':hover': { borderColor: '#453f56', background: 'white' }
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  background: isSelected
                    ? '#7d63ce'
                    : isFocused
                      ? '#eae8ec'
                      : 'transparent'
                }),
                indicatorSeparator: () => ({ display: 'none' })
              }}
              options={options}
              onChange={({ value }) => {
                dropdown
                  .filter(x => x.name === value)[0]
                  .command(editorView.state, editorView.dispatch, editorView)
              }}
              value={options.filter(x => x.active)[0] || null}
              placeholder="Type"
              isSearchable={false}
            />
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
