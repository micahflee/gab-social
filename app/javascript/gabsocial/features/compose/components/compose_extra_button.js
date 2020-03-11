import classNames from 'classnames/bind'
import Icon from '../../../components/icon'

const cx = classNames.bind(_s)

export default class ComposeExtraButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    icon: PropTypes.string,
    small: PropTypes.bool,
    active: PropTypes.bool,
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
      title,
      disabled,
      onClick,
      icon,
      children,
      small,
      active
    } = this.props
    const { hovering } = this.state

    const containerClasses = cx({
      default: 1,
      mr10: !small,
      mr2: small,
    })

    const btnClasses = cx({
      default: 1,
      circle: 1,
      flexRow: 1,
      cursorPointer: 1,
      outlineNone: 1,
      backgroundSubtle: !hovering && !active,
      backgroundSubtle2: hovering && !active,
      backgroundColorBrandLight: active,
      py10: !small,
      px10: !small,
      py5: small,
      px5: small,
    })

    const titleClasses = cx({
      default: 1,
      ml5: 1,
      text: 1,
      lineHeight15: 1,
      fontSize12PX: 1,
      fontWeightMedium: 1,
      colorSecondary: !active,
      colorWhite: active,
      displayNone: !hovering,
    })

    const iconClasses = cx({
      fillColorSecondary: !active,
      fillColorWhite: active,
    })

    const iconSize = !!small ? '12px' : '18px'

    return (
      <div className={containerClasses}>
        <button
          className={btnClasses}
          title={title}
          disabled={disabled}
          onClick={onClick}
          onMouseEnter={() => this.handleOnMouseEnter()}
          onMouseLeave={() => this.handleOnMouseLeave()}
        >
          <Icon id={icon} width={iconSize} height={iconSize} className={iconClasses} />
          {
            (!small && !!title) &&
            <span className={titleClasses}>
              {title}
            </span>
          }
        </button>
        {children}
      </div>
    )
  }
}