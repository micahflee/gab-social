import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'

export default class Button extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    text: PropTypes.node,
    to: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    secondary: PropTypes.bool,
    className: PropTypes.string,
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
    const { block, className, disabled, text, to, children, href } = this.props

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
      backgroundColorBrand: 1,
      backgroundColorBrandDark_onHover: 1,
    })

    if (href) {
      return (
        <a className={classes} href={href}>
          {text || children}
        </a>
      )
    } else if (to) {
      return (
        <NavLink className={classes} to={to}>
          {text || children}
        </NavLink>
      )
    }

    return (
      <button
        ref={this.setRef}
        disabled={disabled}
        onClick={this.handleClick}
        className={classes}
      >
        {text || children}
      </button>
    );
  }

}
