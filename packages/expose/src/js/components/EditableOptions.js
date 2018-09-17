import React from 'react'
// import Slider from './slider.js';
import { Subscribe } from 'unstated'
import BackLink from './BackLink.js'
import Page from './Page.js'
import DatePicker from './DatePicker.js'

class EditableProp extends React.Component {
  render() {
    let set = this.props.set

    switch (this.props.type) {
      case 'text':
        return (
          <input
            type="text"
            defaultValue={this.props.value || ''}
            onInput={e => set(e.target.value)}
            className="appearance-none block w-full bg-transparent focus:bg-white border border-purple-dark rounded h-7 focus:outline-none"
            style={{ padding: '0 12px' }}
          />
        )
        break
      // case 'number':
      //   return (
      //     <Slider
      //       defaultValue={this.props.value || 0}
      //       onChange={val => set(val)}
      //     />
      //   );
      //   break;
      case 'select':
        return (
          <select id={this.props.id} onChange={e => set(e.target.value)}>
            {this.props.options.map((option, i) => (
              <option value={option} key={i}>
                {option}
              </option>
            ))}
          </select>
        )
        break
      case 'boolean':
        return (
          <div>
            <input
              type="checkbox"
              id={this.props.id}
              defaultChecked={
                typeof this.props.value !== 'undefined'
                  ? this.props.value
                  : typeof this.props.default !== 'undefined'
                    ? this.props.default
                    : false
              }
              onChange={e => {
                set(e.target.checked)
              }}
              className="sr-only"
            />
            <div
              className="checkbox absolute pin-r border border-purple-dark rounded-sm"
              style={{ width: 20, height: 20, top: '50%', marginTop: -10 }}
            />
          </div>
        )
        break
      case 'color':
        return (
          <ul
            className="list-reset flex flex-wrap"
            style={{
              margin: '-10px -5px 0'
            }}
          >
            {this.props.options.map((option, i) => (
              <li style={{ margin: '10px 5px 0' }} key={i}>
                <input
                  type="radio"
                  id={this.props.id + i}
                  name={this.props.id}
                  value={option}
                  onChange={e => {
                    set(e.target.value)
                  }}
                  className="sr-only"
                />
                <label
                  htmlFor={this.props.id + i}
                  className="block w-6 h-6 border-0 rounded relative cursor-pointer"
                  style={{
                    background: option
                  }}
                >
                  <span className="sr-only">{option}</span>
                  {this.props.value === option ? (
                    <div
                      className="absolute rounded-full bg-purple-dark border border-white"
                      style={{
                        top: -4,
                        right: -4,
                        width: 9,
                        height: 9
                      }}
                    />
                  ) : null}
                </label>
              </li>
            ))}
          </ul>
        )
        break
      case 'date':
        return (
          <DatePicker
            selected={this.props.value}
            onChange={date => {
              set(date.format('YYYY-MM-DD'))
            }}
          />
        )
        break
      case 'datetime':
        return (
          <DatePicker
            selected={this.props.value}
            onChange={date => {
              set(date.format('YYYY-MM-DDTHH:mm:00'))
            }}
            showTimeSelect
          />
        )
        break
    }
  }
}

export default class EditableOptions extends React.Component {
  render() {
    let props = this.props.editables[this.props.loc]
    return (
      <Subscribe to={[createContainer(props.stateContainer)]}>
        {s => (
          <Page padding="lg">
            <BackLink to="/" />
            {Object.keys(props.options).map((prop, i) => {
              let p = props.options[prop]
              return (
                <div key={`${s.location}.${prop}`} className="relative mt-5">
                  <label
                    htmlFor={`${s.location}.${prop}`}
                    className="relative block mb-3 z-10"
                  >
                    {p.displayName || camelToSentence(prop)}
                  </label>
                  <EditableProp
                    id={`${s.location}.${prop}`}
                    type={p.type}
                    value={s.state.value[prop]}
                    default={p.default}
                    set={x => s.set(prop, x)}
                    options={p.options}
                  />
                </div>
              )
            })}
          </Page>
        )}
      </Subscribe>
    )
  }
}

function camelToSentence(string) {
  return string
    .replace(/([a-z])([A-Z])/g, (m, p1, p2) => p1 + ' ' + p2.toLowerCase())
    .replace(/^([a-z])/, m => m.toUpperCase())
}

function createContainer(container) {
  return function() {
    return container
  }
}
