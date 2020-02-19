import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'

const cx = classNames.bind(_s)

const COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  brand: 'brand',
  error: 'error',
  none: 'none',
}

export default class Button extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    to: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    block: PropTypes.bool,
    text: PropTypes.bool,
    disabled: PropTypes.bool,
    outline: PropTypes.bool,
  }

  static defaultProps = {
    color: COLORS.brand,
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
    const { block, className, disabled, text, to, children, href, outline, color } = this.props

    // : todo :
    const classes = cx(className, {
      default: 1,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,

      backgroundColorBrand: !text && !outline,

      // colorPrimary: 1,
      // colorSecondary: 1,
      colorWhite: [].indexOf(color) > -1,
      colorBrand: text || [].indexOf(color) > -1,

      // borderColorBrand: 1,
      // border1PX: 1,

      circle: !text,

      paddingVertical10PX: !text,
      paddingHorizontal15PX: !text,

      width100PC: block,
    })

    const tagName = !!href ? 'a' : !!to ? 'NavLink' : 'button'

    return React.createElement(
      tagName,
      {
        className: classes,
        ref: this.setRef,
        disabled: disabled,
        to: to || undefined,
        to: href || undefined,
        onClick: this.handleClick || undefined,
      },
      children,
    )
  }

}
