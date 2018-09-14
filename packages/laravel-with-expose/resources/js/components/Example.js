import { Component, render, h } from 'preact'
import { Editable, Expose } from 'expose-react'

export default class Example extends Component {
    render() {
        return (
            <Expose>
                <div className="container">
                    <Editable
                        name="foo"
                        props={{
                            text: { type: 'text' },
                            textColor: {
                                type: 'color',
                                options: ['red', 'blue']
                            },
                            show: {
                                type: 'boolean',
                                default: true
                            },
                            exampleSelect: {
                                type: 'select',
                                options: ['one', 'two', 'three'],
                                default: 'one'
                            }
                        }}
                    >
                        {({ text, textColor, show, exampleSelect }) => (
                            <div style={{ color: textColor || '' }}>
                                {text || 'aaa'}
                                {exampleSelect}
                            </div>
                        )}
                    </Editable>
                    <Editable
                        name="bar"
                        props={{
                            text: { type: 'text' },
                            textColor: {
                                type: 'color',
                                options: ['red', 'blue']
                            }
                        }}
                    >
                        {({ text, textColor }) => (
                            <div style={{ color: textColor || '' }}>
                                {text || 'aaa'}
                            </div>
                        )}
                    </Editable>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    Example Component
                                </div>

                                <div className="card-body">
                                    I'm an example component!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Expose>
        )
    }
}

if (document.getElementById('root')) {
    render(
        <Example />,
        document.getElementById('root'),
        document.getElementById('app')
    )
}
