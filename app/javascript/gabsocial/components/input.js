import { Fragment } from 'react'
import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Text from './text'

const cx = classNames.bind(_s)

export default class Input extends PureComponent {
  static propTypes = {
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
    id: PropTypes.string,
    hideLabel: PropTypes.bool,
  }

  render() {
    const {
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
      hideLabel
    } = this.props

    const inputClasses = cx({
      default: 1,
      text: 1,
      outlineNone: 1,
      lineHeight125: !small,
      lineHeight1: small,
      displayBlock: 1,
      py10: !small,
      py5: small,
      backgroundTransparent: !readOnly,
      backgroundSubtle2: readOnly,
      colorSecondary: readOnly,
      fontSize15PX: !small,
      fontSize13PX: small,
      flexGrow1: 1,
      circle: 1,
      px5: !!prependIcon,
      pl15: !prependIcon,
      pr15: !hasClear,
    })

    const titleClasses = cx({
      default: 1,
      mb10: 1,
      pl15: 1,
      displayNone: hideLabel,
    })

    const btnClasses = cx({
      displayNone: !value || value.length === 0,
      px10: 1,
      mr5: 1,
    })

    return (
      <Fragment>
        {
          !!title &&
          <div className={titleClasses}>
            <Text htmlFor={id} size='small' weight='medium' color='secondary' tagName='label'>
              {title}
            </Text>
          </div>
        }
        <div className={[_s.default, _s.backgroundColorPrimary, _s.border1PX, _s.borderColorSecondary, _s.flexRow, _s.circle, _s.alignItemsCenter].join(' ')}>
          {
            !!prependIcon &&
            <Icon id={prependIcon} width='16px' height='16px' className={[_s.ml15, _s.mr5].join(' ')} />
          }

          <input
            id={id}
            className={inputClasses}
            type='text'
            placeholder={placeholder}
            ref={inputRef}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
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
              iconHeight='10px'
              iconWidth='10px'
            />
          }
        </div>
      </Fragment>
    )
  }
}