import classNames from 'classnames/bind'
import Icon from './icon'

const cx = classNames.bind(_s)

export default class StatusActionBarItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    buttonRef: PropTypes.node,
  }

  render() {
    const {
      title,
      onClick,
      icon,
      active,
      disabled,
      buttonRef
    } = this.props

    const btnClasses = cx({
      default: 1,
      text: 1,
      fontSize13PX: 1,
      fontWeightMedium: 1,
      cursorPointer: 1,
      displayFlex: 1,
      justifyContentCenter: 1,
      flexRow: 1,
      alignItemsCenter: 1,
      py10: 1,
      px10: 1,
      width100PC: 1,
      radiusSmall: 1,
      outlineNone: 1,
      backgroundTransparent: 1,
      backgroundSubtle_onHover: 1,
      colorSecondary: 1,
    })

    return (
      <div className={[_s.default, _s.flexGrow1, _s.px10].join(' ')}>
        <button
          ref={buttonRef}
          className={btnClasses}
          onClick={onClick}
          active={active}
          disabled={disabled}
        >
          <Icon width='16px' height='16px' id={icon} className={[_s.default, _s.mr10, _s.fillColorSecondary].join(' ')} />
          {title}
        </button>
      </div>
    )
  }
}