import { h, Component } from 'preact'
import { Expose, Text, Editable, Repeater, Variant } from 'expose-react'

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
                    <Editable
                        name="testing"
                        props={{
                            color: { type: 'color', options: ['red', 'blue'] }
                        }}
                    >
                        {({ color }) => (
                            <div style={{ color: color || '' }}>
                                editable test
                            </div>
                        )}
                    </Editable>
                    <Repeater name="repeat">
                        <Variant name="basic" render={() => <div>basic</div>} />
                    </Repeater>
                </div>
            </Expose>
        )
    }
}
