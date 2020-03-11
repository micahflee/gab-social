import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import Icon from './icon'

const cx = classNames.bind(_s)

const COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  white: 'white',
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
    iconWidth: PropTypes.string,
    iconHeight: PropTypes.string,
    iconClassName: PropTypes.string,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    block: PropTypes.bool,
    text: PropTypes.bool,
    disabled: PropTypes.bool,
    outline: PropTypes.bool,
    narrow: PropTypes.bool,
    underlineOnHover: PropTypes.bool,
    radiusSmall: PropTypes.bool,
  }

  static defaultProps = {
    color: COLORS.white,
    backgroundColor: COLORS.brand,
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

  render() {
    const {
      block,
      className,
      disabled,
      text,
      to,
      icon,
      iconWidth,
      iconHeight,
      iconClassName,
      children,
      href,
      outline,
      color,
      backgroundColor,
      underlineOnHover,
      narrow,
      radiusSmall,
      ...otherProps
    } = this.props

    const theIcon = !!icon ? (
      <Icon
        id={icon}
        width={iconWidth}
        height={iconWidth}
        className={iconClassName}
      />
    ) : undefined

    // : todo :
    const classes = cx(className, {
      default: 1,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      outlineNone: 1,
      flexRow: !!children && !!icon,

      backgroundColorPrimary: backgroundColor === COLORS.white,
      backgroundColorBrand: backgroundColor === COLORS.brand,
      backgroundTransparent: backgroundColor === COLORS.none,
      backgroundSubtle2: backgroundColor === COLORS.tertiary,
      backgroundSubtle: backgroundColor === COLORS.secondary,

      colorPrimary: color === COLORS.primary,
      colorSecondary: color === COLORS.secondary,
      colorTertiary: color === COLORS.tertiary,
      colorWhite: color === COLORS.white,
      colorBrand: color === COLORS.brand,

      borderColorBrand: color === COLORS.brand && outline,
      border1PX: outline,

      circle: !text,
      radiusSmall: radiusSmall,

      py5: narrow,
      py10: !text && !narrow,
      px15: !text,

      width100PC: block,

      underline_onHover: underlineOnHover,

      backgroundSubtle2Dark_onHover: backgroundColor === COLORS.tertiary,

      backgroundColorBrandDark_onHover: backgroundColor === COLORS.brand,

      backgroundColorBrand_onHover: color === COLORS.brand && outline,
      colorWhite_onHover: color === COLORS.brand && outline,
    })

    const tagName = !!href ? 'a' : !!to ? 'NavLink' : 'button'

    const theChildren = !!icon ? (
      <Fragment>
        {theIcon}
        {children}
      </Fragment>
    ) : children

    const options = {
      disabled,
      className: classes,
      ref: this.setRef,
      to: to || undefined,
      href: href || undefined,
      onClick: this.handleClick || undefined,
      ...otherProps,
    }

    if (tagName === 'NavLink' && !!to) {
      return (
        <NavLink {...options}>
          {theChildren}
        </NavLink>
      )
    }

    return React.createElement(tagName, options, theChildren)
  }

}
