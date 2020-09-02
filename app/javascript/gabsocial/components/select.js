import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Icon from './icon'

/**
 * Renders a select element with options
 * @param {func} props.onChange - function to call on option selection
 * @param {object} props.options - options for selection
 * @param {string} [props.value] - value to set selected
 */
class Select extends ImmutablePureComponent {

  updateOnProps = [
    'options',
    'value',
  ]

  render() {
    const {
      value,
      options,
      onChange,
    } = this.props

    return (
      <div className={_s.d}>
        <select
          className={[_s.d, _s.outlineNone, _s.text, _s.border1PX, _s.borderColorSecondary, _s.px15, _s.select, _s.fs14PX, _s.circle].join(' ')}
          value={value}
          onChange={onChange}
        >
          {
            options.map((option) => (
              <option key={`option-${option.value}`} value={option.value}>
                {option.title}
              </option>
            ))
          }
        </select>
        <Icon
          id='select'
          size='14px'
          className={[_s.cSecondary, _s.posAbs, _s.right0, _s.mr10, _s.bottom0, _s.mb15].join(' ')}
        />
      </div>
    )
  }

}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOf([
    ImmutablePropTypes.map,
    PropTypes.object,
  ]).isRequired,
  value: PropTypes.string,
}

export default Select