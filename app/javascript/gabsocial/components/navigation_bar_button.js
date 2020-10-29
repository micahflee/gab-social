import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Button from './button'
import Icon from './icon'
import Text from './text'

class NavigationBarButton extends React.PureComponent {

  render() {
    const {
      title,
      icon,
      to,
      href,
      attrTitle,
      count,
      onClick,
    } = this.props

    const active = to == window.location.pathname

    const classes = CX({
      d: 1,
      h53PX: 1,
      aiCenter: 1,
      jcCenter: 1,
      outlineNone: 1,
      cursorPointer: 1,
      bgTransparent: 1,
      noUnderline: 1,
      colorNavigation: 1,
      px15: !!title,
      px5: !title,
      py2: !title,
      cWhite: !!title,
      fs13PX: !!title,
      fw400: !!title,
      navigationUnderlineActive: !!title && active,
    })

    const iconClasses = CX({
      fillNavigation: !!title || active,
      fillNavigationBlend: !title,
      px2: !title,
    })

    const countClasses = CX({
      d: 1,
      fs12PX: 1,
      posAbs: 1,
      top0: 1,
      mt15: 1,
      right0: 1,
      mr5: 1,
      h4PX: 1,
      w4PX: 1,
      cBrand: 1,
      bgNavigationBlend: 1,
      radiusSmall: 1,
    })

    const iconSize = !!title ? '18px' : '20px'

    return (
      <Button
        to={to}
        href={href}
        title={attrTitle}
        onClick={onClick}
        className={classes}
        noClasses
      > 
        <Icon className={iconClasses} id={icon} size={iconSize} />
        {
          !!title &&
          <Text color='white' size='extraSmall' className={_s.mt5}>
            {title}
          </Text>
        }
        {
          !title && count > 0 &&
          <span className={countClasses} />
        }
      </Button>
    )
  }

}

NavigationBarButton.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  to: PropTypes.string,
  href: PropTypes.string,
  attrTitle: PropTypes.string,
  count: PropTypes.number,
  onClick: PropTypes.func,
}

export default NavigationBarButton