import classNames from 'classnames/bind'
import Icon from '../../../components/icon'

export default class ComposeExtraButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    icon: PropTypes.string,
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
    const { title, disabled, onClick, icon, children } = this.props
    const { hovering } = this.state

    const cx = classNames.bind(styles)

    const btnClasses = cx({
      default: 1,
      circle: 1,
      flexRow: 1,
      paddingVertical10PX: 1,
      paddingHorizontal10PX: 1,
      cursorPointer: 1,
      backgroundSubtle: !hovering,
      backgroundSubtle2: hovering,
    })

    const titleClasses = cx({
      default: 1,
      marginLeft5PX: 1,
      text: 1,
      lineHeight15: 1,
      fontSize12PX: 1,
      fontWeight500: 1,
      colorSubtle: 1,
      displayNone: !hovering,
    })

    return (
      <div className={[styles.default, styles.marginRight10PX].join(' ')}>
        <button
          className={btnClasses}
          title={title}
          disabled={disabled}
          onClick={onClick}
          onMouseEnter={() => this.handleOnMouseEnter()}
          onMouseLeave={() => this.handleOnMouseLeave()}
        >
          <Icon id={icon} width='18px' height='18px' className={styles.fillColorSubtle} />
          <span className={titleClasses}>
            {title}
          </span>
        </button>
        {children}
      </div>
    )
  }
}