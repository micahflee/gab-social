import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../../../constants'
import Button from '../../../components/button'
import Text from '../../../components/text'

class ComposeExtraButton extends React.PureComponent {

  render() {
    const {
      title,
      disabled,
      onClick,
      icon,
      children,
      active,
      buttonRef,
      isLast,
      small,
      iconClassName,
    } = this.props

    const containerClasses = CX({
      d: 1,
      mr5: 1,
      jcCenter: 1,
      h40PX: 1,
    })

    const btnClasses = CX({
      d: 1,
      circle: 1,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      outlineNone: 1,
      bgTransparent: 1,
      flexRow: 1,
      bgSubtle_onHover: !active,
      bgBrandLight: active,
      py10: 1,
      px10: 1,
    })

    const iconClasses = CX(iconClassName, {
      cSecondary: !active,
      cWhite: active,
      mr10: 1,
      py2: small,
      ml10: small,
    })

    const iconSize = !small ? '18px' : '16px'
    const textColor = !active ? 'primary' : 'white'

    return (
      <div className={containerClasses} ref={buttonRef}>
        <Button
          noClasses
          className={btnClasses}
          title={title}
          isDisabled={disabled}
          onClick={onClick}
          backgroundColor='none'
          iconClassName={iconClasses}
          icon={icon}
          iconSize={iconSize}
          buttonRef={!children ? buttonRef : undefined}
        >
          { children }
          {
            !small &&
            <Text color={textColor} weight='medium' className={[_s.pr5].join(' ')}>
              {title}
            </Text>
          }
        </Button>
      </div>
    )
  }

}

ComposeExtraButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  active: PropTypes.bool,
  buttonRef: PropTypes.func,
  small: PropTypes.bool,
  iconClassName: PropTypes.string,
}

export default ComposeExtraButton