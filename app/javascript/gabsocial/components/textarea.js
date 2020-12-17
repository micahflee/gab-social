import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Text from './text'

class Textarea extends React.PureComponent {

  handleOnChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const {
      placeholder,
      prependIcon,
      value,
      onKeyUp,
      onFocus,
      onBlur,
      title,
      isRequired,
      maxLength,
    } = this.props

    const inputClasses = CX({
      d: 1,
      text: 1,
      outlineNone: 1,
      lineHeight125: 1,
      displayBlock: 1,
      py10: 1,
      bgTransparent: 1,
      fs15PX: 1,
      flexGrow1: 1,
      maxH100VH: 1,
      resizeVertical: 1,
      cPrimary: 1,
      px5: !!prependIcon,
      pl15: !prependIcon,
    })

    return (
      <div>
        {
          !!title &&
          <div className={[_s.d, _s.mb10, _s.pl15].join(' ')}>
            <Text size='small' weight='medium' color='secondary'>
              {title}
            </Text>
          </div>
        }
        <div className={[_s.d, _s.bgPrimary, _s.border1PX, _s.borderColorSecondary, _s.flexRow, _s.radiusSmall, _s.aiCenter].join(' ')}>
          <textarea
            className={inputClasses}
            type='text'
            placeholder={placeholder}
            value={value}
            onChange={this.handleOnChange}
            onKeyUp={onKeyUp}
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={maxLength}
            required={isRequired ? true : undefined}
          />

        </div>
      </div>
    )
  }
}

Textarea.propTypes = {
  placeholder: PropTypes.string,
  prependIcon: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  title: PropTypes.string,
  isRequired: PropTypes.bool,
  maxLength: PropTypes.number,
}

export default Textarea