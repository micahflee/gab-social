import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'

const cx = classNames.bind(_s)

export default class SidebarSectionItem extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    active: PropTypes.bool,
    icon: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    me: PropTypes.bool,
    suffix: PropTypes.node,
    buttonRef: PropTypes.func,
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
    const {
      to,
      active,
      icon,
      image,
      title,
      me,
      count,
      onClick,
      href,
      buttonRef
    } = this.props
    const { hovering } = this.state

    const iconSize = '16px'
    const shouldShowActive = hovering || active
    const isNotifications = to === '/notifications'

    const containerClasses = cx({
      default: 1,
      maxWidth100PC: 1,
      width100PC: 1,
      flexRow: 1,
      py5: 1,
      px10: 1,
      alignItemsCenter: 1,
      radiusSmall: 1,
      // border1PX: shouldShowActive,
      // borderColorSecondary: shouldShowActive,
      backgroundSubtle2: shouldShowActive,
      backgroundTransparent: 1,
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
      fillColorSecondary: !hovering && !active,
    })

    const countClasses = cx({
      default: 1,
      text: 1,
      marginLeftAuto: 1,
      fontSize12PX: 1,
      px5: 1,
      mr2: 1,
      lineHeight15: 1,
      ml5: 1,
      colorSecondary: !isNotifications,
      colorWhite: isNotifications,
      backgroundColorBrand: isNotifications,
      radiusSmall: isNotifications,
    })

    return (
      <Button
        to={to}
        href={href}
        onClick={onClick}
        noClasses
        buttonRef={buttonRef}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
        className={[_s.default, _s.noUnderline, _s.cursorPointer, _s.width100PC, _s.backgroundTransparent].join(' ')}
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
          <div className={[_s.default, _s.flexNormal, _s.px10, _s.textOverflowEllipsis, _s.overflowWrapBreakWord, _s.flexRow, _s.width100PC].join(' ')}>
            <span className={textClasses}>{title}</span>
          </div>
          { count > 0 &&
            <span className={countClasses}>
              {count}
            </span>
          }
        </div>
      </Button>
    )
  }
}
