import classNames from 'classnames/bind'

export default class Button extends PureComponent {

  static propTypes = {
    text: PropTypes.node,
    href: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    secondary: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({
      hovering: true,
    })
  }

  handleOnMouseLeave = () => {
    this.setState({
      hovering: false,
    })
  }

  handleClick = (e) => {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(e)
    }
  }

  setRef = (c) => {
    this.node = c
  }

  focus() {
    this.node.focus()
  }

  render () {
    const { secondary, block, className, disabled, text, children, href } = this.props
    const { hovering } = this.state

    const cx = classNames.bind(styles)

    const classes = cx(className, {
      default: 1,
      noUnderline: 1,
      font: 1,
      colorWhite: 1,
      circle: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      paddingVertical10PX: 1,
      paddingHorizontal15PX: 1,
      width100PC: block,
      backgroundColorBrand: !hovering,
      backgroundColorBrandDark: hovering,
    })

    if (href) {
      return (
        <a
          className={classes}
          href={href}
          onMouseEnter={() => this.handleOnMouseEnter()}
          onMouseLeave={() => this.handleOnMouseLeave()}
        >
          {text || children}
        </a>
      )
    }

    return (
      <button
        ref={this.setRef}
        disabled={disabled}
        onClick={this.handleClick}
        className={classes}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        {text || children}
      </button>
    );
  }

}
