import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Text from './text'

const cx = classNames.bind(_s)

export default class SidebarSectionItem extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    active: PropTypes.bool,
    icon: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    me: PropTypes.bool,
    suffix: PropTypes.node,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const { to, active, icon, image, title, me, count } = this.props
    const { hovering } = this.state

    const iconSize = '16px'
    const shouldShowActive = hovering || active
    const isNotifications = to === '/notifications'

    const containerClasses = cx({
      default: 1,
      maxWidth100PC: 1,
      width100PC: 1,
      flexRow: 1,
      paddingVertical5PX: 1,
      paddingHorizontal10PX: 1,
      alignItemsCenter: 1,
      radiusSmall: 1,
      // border1PX: shouldShowActive,
      // borderColorSecondary: shouldShowActive,
      backgroundSubtle2: shouldShowActive,
    })

    const textClasses = cx({
      default: 1,
      fontWeightNormal: 1,
      fontSize15PX: 1,
      text: 1,
      textOverflowEllipsis: 1,
      colorPrimary: shouldShowActive || me,
      colorSecondary: !hovering && !active && !me,
    })

    const iconClasses = cx({
      fillColorBlack: shouldShowActive,
      fillcolorSecondary: !hovering && !active,
    })

    const countClasses = cx({
      default: 1,
      text: 1,
      marginLeftAuto: 1,
      fontSize12PX: 1,
      paddingHorizontal5PX: 1,
      marginRight2PX: 1,
      lineHeight15: 1,
      marginLeft5PX: 1,
      colorSecondary: !isNotifications,
      colorWhite: isNotifications,
      backgroundColorBrand: isNotifications,
      radiusSmall: isNotifications,
    })

    return (
      <NavLink
        to={to}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
        className={[_s.default, _s.noUnderline, _s.cursorPointer, _s.width100PC, _s.alignItemsStart].join(' ')}
      >
        <div className={containerClasses}>
          <div className={[_s.default]}>
            { icon && <Icon id={icon} className={iconClasses} width={iconSize} height={iconSize} /> }
            { image &&
              <img
                className={[_s.default, _s.circle].join(' ')}
                width={iconSize}
                height={iconSize}
                src={image}
              />
            }
          </div>
          <div className={[_s.default, _s.flexNormal, _s.paddingHorizontal10PX, _s.textOverflowEllipsis, _s.overflowWrapBreakWord, _s.flexRow, _s.width100PC].join(' ')}>
            <span className={textClasses}>{title}</span>
          </div>
          { count > 0 &&
            <span className={countClasses}>
              {count}
            </span>
          }
        </div>
      </NavLink>
    )
  }
}
