import React from 'react'
import PropTypes from 'prop-types'

class Slider extends React.PureComponent {

  handleOnInput = (e) => {
    this.props.onInput(e.target.value)
  }
  
  handleOnChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const {
      className,
      min,
      max,
      value,
    } = this.props

    return (
      <input
        type='range'
        min={min}
        value={value}
        max={max}
        onInput={this.handleOnInput}
        onChange={this.handleOnChange}
        className={className}
      />
    )
  }

}

Slider.propTypes = {
  className: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  value: PropTypes.number,
}

export default Slider