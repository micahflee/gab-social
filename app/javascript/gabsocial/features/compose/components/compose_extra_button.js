import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../../../constants'
import Button from '../../../components/button'

class ComposeExtraButton extends React.PureComponent {

  render() {
    const {
      title,
      disabled,
      onClick,
      icon,
      children,
      small,
      active,
      buttonRef
    } = this.props

    const btnClasses = CX({
      d: 1,
      circle: 1,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      outlineNone: 1,
      bgTransparent: 1,
      bgSubtle_onHover: !active,
      bgBrandLight: active,
      py10: !small,
      px10: !small,
      py5: small,
      px5: small,
      mr2: !children,
    })

    const iconClasses = CX({
      cSecondary: !active,
      cWhite: active,
    })

    const iconSize = !!small ? '14px' : '16px'

    const button = (
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
      />
    )

    if (!children) {
      return button
    }

    return (
      <div className={[_s.d, _s.mr2].join(' ')} ref={buttonRef}>
        {button}
        {children}
      </div>
    )
  }

}

ComposeExtraButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  small: PropTypes.bool,
  active: PropTypes.bool,
  buttonRef: PropTypes.func,
}

export default ComposeExtraButton