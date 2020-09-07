import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { CX } from '../constants'
import Icon from './icon'
import Tooltip from './tooltip'

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
 * @param {bool} [props.rel] - rel for the button
 * @param {bool} [props.target] - target for the button
 * @param {bool} [props.text] - if the button is just text (i.e. link)
 * @param {bool} [props.title] - `title` attribute for button
 * @param {bool} [props.to] - `to` to send to on click
 * @param {bool} [props.tooltip] - add a tooltip to the button on hover/click
 * @param {bool} [props.type] - `type` attribute for button
 * @param {bool} [props.underlineOnHover] - if the button has underline on hover
 */
class Button extends React.PureComponent {

  state = {
    isHovering: false,
  }

  handleClick = (e) => {
    if (!this.props.isDisabled && this.props.onClick) {
      this.props.onClick(e)
    }
  }

  handleOnMouseEnter = () => {
    if (!this.props.isDisabled && this.props.onMouseEnter) {
      this.props.onMouseEnter()
    }
    if (this.props.tooltip) {
      this.setState({ isHovering: true }) 
    }
  }
  
  handleOnMouseLeave = () => {
    if (!this.props.isDisabled && this.props.onMouseLeave) {
      this.props.onMouseLeave()
    }
    if (this.props.tooltip) {
      this.setState({ isHovering: false })
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
      rel,
      target,
      title,
      to,
      tooltip,
      type,
      underlineOnHover,
    } = this.props
    const { isHovering } = this.state

    // Style the component according to props
    const classes = noClasses ? className : CX(className, {
      d: 1,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      outlineNone: 1,
      // outlineOnFocus: !isText,
      flexRow: !!children && !!icon,
      cursorNotAllowed: isDisabled,
      opacity05: isDisabled,

      bgPrimary: backgroundColor === COLORS.primary,
      bgWhite: backgroundColor === COLORS.white,
      bgBlack: backgroundColor === COLORS.black,
      bgBrand: backgroundColor === COLORS.brand,
      bgTransparent: backgroundColor === COLORS.none,
      bgSecondary: backgroundColor === COLORS.tertiary,
      bgSubtle: backgroundColor === COLORS.secondary,
      bgDanger: backgroundColor === COLORS.danger,
      
      cPrimary: color === COLORS.primary,
      cSecondary: color === COLORS.secondary,
      cTertiary: color === COLORS.tertiary,
      cWhite: color === COLORS.white,
      cBrand: color === COLORS.brand,

      borderColorBrand: color === COLORS.brand && isOutline,
      border1PX: isOutline,

      circle: !isText,
      radiusSmall: radiusSmall,

      py5: isNarrow,
      py10: !isText && !isNarrow,
      px15: !isText,

      w100PC: isBlock,

      underline_onHover: underlineOnHover,

      bgSecondaryDark_onHover: backgroundColor === COLORS.tertiary || backgroundColor === COLORS.secondary && !isDisabled,
      bgBlackOpaque_onHover: backgroundColor === COLORS.black && !isDisabled,
      bgBrandDark_onHover: backgroundColor === COLORS.brand && !isDisabled,
      bgDangerDark_onHover: backgroundColor === COLORS.danger && !isDisabled,

      bgBrand_onHover: color === COLORS.brand && isOutline && !isDisabled,
      cWhite_onHover: color === COLORS.brand && isOutline && !isDisabled,
    })

    const tagName = !!href ? 'a' : !!to ? 'NavLink' : 'button'

    const theIcon = !!icon ? (
      <Icon
        id={icon}
        size={iconSize}
        className={iconClassName}
      />
    ) : undefined

    const theTooltip = !!tooltip && isHovering ? (
      <Tooltip
        message={tooltip}
        targetRef={this.node}
      />
    ) : undefined

    const theChildren = !!icon || !!tooltip ? (
      <React.Fragment>
        {theIcon}
        {children}
        {theTooltip}
      </React.Fragment>
    ) : children

    const handlers = {
      onClick: !!onClick ? this.handleClick : undefined,
      onMouseEnter: !!onMouseEnter || !!tooltip ? this.handleOnMouseEnter : undefined,
      onMouseLeave: !!onMouseLeave || !!tooltip ? this.handleOnMouseLeave : undefined,
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

    const isLogout = href === '/auth/sign_out'
    const dataMethod = isLogout ? 'delete' : undefined

    const options = {
      rel,
      target,
      title,
      'aria-label': title,
      type,
      disabled: isDisabled,
      className: classes,
      href: href || undefined,
      ref: this.setRef,
      'data-method': dataMethod,
      ...handlers,
    }

    return React.createElement(tagName, options, theChildren)
  }

}

Button.propTypes = {
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
  rel: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  to: PropTypes.string,
  type: PropTypes.string,
  underlineOnHover: PropTypes.bool,
}

Button.defaultProps = {
  color: COLORS.white,
  backgroundColor: COLORS.brand,
}

export default Button
