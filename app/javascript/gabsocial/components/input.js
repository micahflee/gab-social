import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Button from './button'
import Icon from './icon'
import Text from './text'

class Input extends React.PureComponent {

  handleOnChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const {
      isDisabled,
      placeholder,
      prependIcon,
      value,
      hasClear,
      onChange,
      onKeyUp,
      onFocus,
      onBlur,
      onClear,
      title,
      small,
      readOnly,
      inputRef,
      id,
      hideLabel,
      maxLength,
      isRequired,
    } = this.props

    const inputClasses = CX({
      d: 1,
      text: 1,
      outlineNone: 1,
      lineHeight125: !small,
      lineHeight1: small,
      displayBlock: 1,
      py10: !small,
      py5: small,
      bgTransparent: !readOnly,
      bgSecondary: readOnly,
      cPrimary: !readOnly,
      cSecondary: readOnly,
      fs15PX: !small,
      fs13PX: small,
      flexGrow1: 1,
      circle: 1,
      px5: !!prependIcon,
      pl15: !prependIcon,
      pr15: !hasClear,
      cursorNotAllowed: isDisabled,
    })

    const btnClasses = CX({
      displayNone: !value || value.length === 0,
      px10: 1,
      mr5: 1,
    })

    return (
      <React.Fragment>
        {
          !!title && !hideLabel &&
          <div className={[_s.d, _s.mb10, _s.pl15].join(' ')}>
            <Text htmlFor={id} size='small' weight='medium' color='secondary' tagName='label'>
              {title}
            </Text>
          </div>
        }
        <div className={[_s.d, _s.flexGrow1, _s.bgPrimary, _s.border1PX, _s.borderColorSecondary, _s.flexRow, _s.circle, _s.aiCenter].join(' ')}>
          {
            !!prependIcon &&
            <Icon id={prependIcon} size='16px' className={[_s.cPrimary, _s.ml15, _s.mr5].join(' ')} />
          }

          {
            !!title && hideLabel &&
            <label className={_s.visiblyHidden} htmlFor={id}>{title}</label>
          }
          
          <input
            id={id}
            className={inputClasses}
            type='text'
            placeholder={placeholder}
            ref={inputRef}
            value={value}
            onChange={this.handleOnChange}
            onKeyUp={onKeyUp}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            maxLength={maxLength}
            disabled={isDisabled}
            required={isRequired ? true : undefined}
          />

          {
            hasClear &&
            <Button
              className={btnClasses}
              tabIndex='0'
              title='Clear'
              onClick={onClear}
              icon='close'
              iconClassName={_s.inheritFill}
              iconSize='10px'
            />
          }
        </div>
      </React.Fragment>
    )
  }
}

Input.propTypes = {
  placeholder: PropTypes.string,
  prependIcon: PropTypes.string,
  value: PropTypes.string,
  hasClear: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClear: PropTypes.func,
  title: PropTypes.string,
  small: PropTypes.bool,
  readOnly: PropTypes.string,
  inputRef: PropTypes.func,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  hideLabel: PropTypes.bool,
  maxLength: PropTypes.number,
  isDisabled: PropTypes.bool,
}

export default Input