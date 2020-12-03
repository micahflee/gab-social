import React from 'react'
import PropTypes from 'prop-types'
import { shortNumberFormat } from '../utils/numbers'
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
      isXS,
    } = this.props

    const active = `${window.location.pathname}`.indexOf(`${to}`) > -1

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
      px15: !!title && !!icon,
      px5: !title && !isXS,
      px2: !title && isXS,
      py5: !title && !isXS,
      cWhite: !!title,
      fs13PX: !!title,
      fw400: !!title,
      navigationUnderlineActive: !!title && active,
    })

    const iconClasses = CX({
      inherit: (!!title || active) || isXS,
      fillNavigationBlend: !title && !isXS,
      px2: !title && !isXS,
      py5: !title && !isXS,
      px5: !title,
      mr2: !title && isXS,
      ml2: !title && isXS,
    })

    const countClasses = CX({
      d: 1,
      text: 1,
      textAlignCenter: 1,
      minW20PX: 1,
      mlAuto: 1,
      fs12PX: 1,
      px5: 1,
      mr2: 1,
      lineHeight15: 1,
      ml5: 1,
      cWhite: 1,
      rightNeg5PX: 1,
      top0: 1,
      mt5: 1,
      bgRed: 1,
      posAbs: 1,
      circle: 1,
    })

    const iconContainerClasses = CX({
      d: 1,
      aiCenter: 1,
      jcCenter: 1,
      bgNavigationBlendLight: !title,
      circle: !title,
      px5: !title,
      py5: !title,
      py10: !title && isXS,
    })

    const titleClasses = CX({
      mt5: !!icon,
      bgNavigationBlendLight: !!title && !icon,
      px15: !!title && !icon,
      py10: !!title && !icon,
      radiusSmall: !!title && !icon,
    })

    const iconSize = !!title ? '18px' : '20px'
    const titleSize = !!icon ? 'extraSmall' : 'large'
    const titleWeight = !!icon ? 'normal' : 'bold'

    return (
      <Button
        to={to}
        href={href}
        title={attrTitle}
        onClick={onClick}
        className={classes}
        noClasses
      > 
        {
          !!icon &&
          <div className={iconContainerClasses}>
            <Icon className={iconClasses} id={icon} size={iconSize} />
          </div>
        }
        {
          !!title &&
          <Text color='inherit' size={titleSize} weight={titleWeight} className={titleClasses}>
            {title}
          </Text>
        }
        {
          !title && count > 0 &&
          <span className={countClasses}>
            {shortNumberFormat(count)}
          </span>
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
  isXS: PropTypes.bool,
}

export default NavigationBarButton