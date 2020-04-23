import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import Icon from './icon'

// Bind CSS Modules global variable `_s` to classNames module
const cx = classNames.bind(_s)

// Define colors for enumeration for Button component `color`, `backgroundColor` props
const COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  white: 'white',
  black: 'black',
  brand: 'brand',
  danger: 'danger',
  none: 'none',
}

/**
 * Renders a button component
 * @param {string} [props.backgroundColor='brand'] - background color of the button
 * @param {func|node} [props.buttonRef] - ref to send to button component
 * @param {string} [props.className] - add custom className
 * @param {string} [props.color='white'] - text color of the button
 * @param {string} [props.href] - href to send to on click
 * @param {string} [props.icon] - prepend icon id
 * @param {string} [props.iconClassName] - add custom className to icon
 * @param {string} [props.iconSize] - size of the icon
 * @param {bool} [props.isBlock] - if button is width: 100%
 * @param {bool} [props.isDisabled] - if the button is disabled
 * @param {bool} [props.isNarrow] - if the button is narrow
 * @param {bool} [props.isOutline] - if the button is outline design
 * @param {bool} [props.noClasses] - if the button has no default classes
 * @param {func} [props.onClick] - function to call on button click
 * @param {func} [props.onMouseEnter] - function to call on button mouse enter
 * @param {func} [props.onMouseLeave] - function to call on button mouse leave
 * @param {bool} [props.radiusSmall] - if the button has small radius
 * @param {bool} [props.text] - if the button is just text (i.e. link)
 * @param {bool} [props.title] - `title` attribute for button
 * @param {bool} [props.to] - `to` to send to on click
 * @param {bool} [props.type] - `type` attribute for button
 * @param {bool} [props.underlineOnHover] - if the button has underline on hover
 */
export default class Button extends PureComponent {

  static propTypes = {
    backgroundColor: PropTypes.string,
    buttonRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    children: PropTypes.node,
    className: PropTypes.string,
    color: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.string,
    iconClassName: PropTypes.string,
    iconSize: PropTypes.string,
    isBlock: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isNarrow: PropTypes.bool,
    isText: PropTypes.bool,
    noClasses: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    isOutline: PropTypes.bool,
    radiusSmall: PropTypes.bool,
    title: PropTypes.string,
    to: PropTypes.string,
    type: PropTypes.string,
    underlineOnHover: PropTypes.bool,
  }

  static defaultProps = {
    color: COLORS.white,
    backgroundColor: COLORS.brand,
  }

  handleClick = (e) => {
    if (!this.props.isDisabled && this.props.onClick) {
      this.props.onClick(e)
    }
  }

  setRef = (c) => {
    try {
      this.node = c
      this.props.buttonRef(c) 
    } catch (error) {
      //
    }
  }

  focus() {
    this.node.focus()
  }

  render() {
    const {
      backgroundColor,
      children,
      className,
      color,
      href,
      icon,
      iconClassName,
      iconSize,
      isBlock,
      isDisabled,
      isNarrow,
      isOutline,
      isText,
      noClasses,
      onClick,
      onMouseEnter,
      onMouseLeave,
      radiusSmall,
      title,
      to,
      type,
      underlineOnHover,
    } = this.props

    // Style the component according to props
    const classes = noClasses ? className : cx(className, {
      default: 1,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      outlineNone: 1,
      flexRow: !!children && !!icon,
      cursorNotAllowed: isDisabled,
      opacity05: isDisabled,

      backgroundColorPrimary: backgroundColor === COLORS.white,
      backgroundColorBlack: backgroundColor === COLORS.black,
      backgroundColorBrand: backgroundColor === COLORS.brand,
      backgroundTransparent: backgroundColor === COLORS.none,
      backgroundSubtle2: backgroundColor === COLORS.tertiary,
      backgroundSubtle: backgroundColor === COLORS.secondary,
      backgroundColorDanger: backgroundColor === COLORS.danger,
      
      colorPrimary: !!children && color === COLORS.primary,
      colorSecondary: !!children && color === COLORS.secondary,
      colorTertiary: !!children && color === COLORS.tertiary,
      colorWhite: !!children && color === COLORS.white,
      colorBrand: !!children && color === COLORS.brand,

      borderColorBrand: color === COLORS.brand && isOutline,
      border1PX: isOutline,

      circle: !isText,
      radiusSmall: radiusSmall,

      py5: isNarrow,
      py10: !isText && !isNarrow,
      px15: !isText,

      width100PC: isBlock,

      underline_onHover: underlineOnHover,

      backgroundSubtle2Dark_onHover: backgroundColor === COLORS.tertiary || backgroundColor === COLORS.secondary,
      backgroundColorBlackOpaque_onHover: backgroundColor === COLORS.black,
      backgroundColorBrandDark_onHover: backgroundColor === COLORS.brand,
      backgroundColorDangerDark_onHover: backgroundColor === COLORS.danger,

      backgroundColorBrand_onHover: color === COLORS.brand && isOutline,
      colorWhite_onHover: !!children && color === COLORS.brand && isOutline,

      fillColorSecondary: !!icon && color === COLORS.secondary,
      fillColorWhite: !!icon && color === COLORS.white,
      fillColorBrand: !!icon && color === COLORS.brand,
      fillColorWhite_onHover: !!icon && color === COLORS.brand && isOutline,
    })

    const tagName = !!href ? 'a' : !!to ? 'NavLink' : 'button'

    const theIcon = !!icon ? (
      <Icon
        id={icon}
        size={iconSize}
        className={iconClassName}
      />
    ) : undefined

    const theChildren = !!icon ? (
      <Fragment>
        {theIcon}
        {children}
      </Fragment>
    ) : children

    const handlers = {
      onClick: !!onClick ? this.handleClick : undefined,
      onMouseEnter: !!onMouseEnter ? onMouseEnter : undefined,
      onMouseLeave: !!onMouseLeave ? onMouseLeave : undefined,
    }

    if (tagName === 'NavLink' && !!to) {
      return (
        <NavLink
          title={title}
          className={classes}
          disabled={isDisabled}
          to={to}
          {...handlers}
        >
          {theChildren}
        </NavLink>
      )
    }

    const options = {
      title,
      type,
      disabled: isDisabled,
      className: classes,
      href: href || undefined,
      ref: this.setRef,
      ...handlers,
    }

    return React.createElement(tagName, options, theChildren)
  }

}
