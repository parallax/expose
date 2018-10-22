import { h, Component } from 'preact'
import { Expose, Text, Editable, Repeater, Variant } from 'expose-react'

let Square = () => (
    <Editable
        name="square-props"
        props={{
            color: {
                type: 'color',
                default: 'tomato',
                options: ['tomato', 'hotpink', 'lime']
            }
        }}
    >
        {({ color: backgroundColor }) => (
            <div
                style={{
                    width: 50,
                    height: 50,
                    margin: 50,
                    backgroundColor
                }}
            />
        )}
    </Editable>
)

export default class Welcome extends Component {
    constructor(props) {
        super(props)
        this.extends = 'layouts.example'
    }
    render() {
        return (
            <Expose>
                <div style={{ maxWidth: 600, margin: 'auto' }}>
                    <h1>
                        <Text name="title" />
                    </h1>
                    <Text name="body" allow={['b', 'p', 'h1']} />
                    <Editable
                        name="testing"
                        props={{
                            color: { type: 'color', options: ['red', 'blue'] },
                            date: { type: 'datetime' }
                        }}
                    >
                        {({ color, date }) => (
                            <div style={{ color: color || '' }}>
                                editable test {date}
                            </div>
                        )}
                    </Editable>
                    <Repeater
                        name="repeat"
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Variant
                            name="text"
                            render={() => <Text name="text" allow={['b']} />}
                        />
                        <Variant name="square" component={Square} />
                    </Repeater>
                </div>
            </Expose>
        )
    }
}
