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
      jcCenter: 1,
      h40PX: 1,
      mr5: 1,
    })

    const btnClasses = CX({
      d: 1,
      circle: small,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      outlineNone: 1,
      bgTransparent: 1,
      flexRow: 1,
      aiCenter: 1,
      // jcCenter: !small,
      bgSubtle_onHover: !active,
      bgBrandLight: active,
      py10: 1,
      px10: small,
      radiusSmall: !small,
    })

    const iconClasses = CX(active ? null : iconClassName, {
      cSecondary: !active,
      cWhite: active,
      mr10: !small,
      py2: small,
      ml10: !small,
      px2: small,
    })

    const iconSize = '16px'
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
          iconSize='16px'
          buttonRef={!children ? buttonRef : undefined}
        >
          { children }
          {
            !small &&
            <Text color={textColor} weight='medium' className={[_s.pr10].join(' ')}>
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