import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Text from './text'

class Switch extends React.PureComponent {

  handleOnChange = (e) => {
    this.props.onChange(e.currentTarget.checked)
  }

  render() {
    const {
      id,
      description,
      label,
      checked,
      onChange,
      onKeyDown,
      disabled,
      labelProps
    } = this.props

    const checkboxContainerClasses = CX({
      cursorPointer: 1,
      d: 1,
      h24PX: 1,
      w50PX: 1,
      circle: 1,
      border1PX: 1,
      mlAuto: 1,
      bgPrimary: 1,
      borderColorSecondary: 1,
      bgBrand: checked,
    })

    const checkboxLabelClasses = CX({
      d: 1,
      m1PX: 1,
      h20PX: 1,
      w20PX: 1,
      circle: 1,
      posAbs: 1,
      bgSecondary: !checked,
      bgPrimary: checked,
      left0: !checked,
      right0: checked,
    })

    return (
      <div className={[_s.d, _s.flexRow, _s.py5, _s.aiCenter].join(' ')}>
        <Text {...labelProps} htmlFor={id} className={_s.mr10}>
          {label}
        </Text>

        <label className={checkboxContainerClasses} htmlFor={id}>
          <span className={checkboxLabelClasses} />
          <input type='checkbox' id={id} onChange={this.handleOnChange} disabled={disabled} className={[_s.visibilityHidden].join(' ')} />
        </label>
      </div>
    )
  }

}

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  disabled: PropTypes.bool,
  labelProps: PropTypes.object,
}

export default Switch