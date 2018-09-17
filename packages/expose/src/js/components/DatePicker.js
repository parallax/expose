import React from 'react'
import ReactDatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: moment(props.selected)
    }
  }
  handleChange = date => {
    this.setState({
      date
    })
    this.props.onChange && this.props.onChange(date)
  }
  render() {
    let { selected, onChange, ...props } = this.props
    return (
      <ReactDatePicker
        inline
        fixedHeight
        selected={this.state.date}
        onChange={this.handleChange}
        {...props}
      />
    )
  }
}
