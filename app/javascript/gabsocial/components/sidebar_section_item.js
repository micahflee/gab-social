import React from 'react'
import PropTypes from 'prop-types'
import {
  CX,
} from '../constants'
import Button from './button'
import Icon from './icon'
import Image from './image'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'

class SidebarSectionItem extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
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
      buttonRef,
    } = this.props
    const { hovering } = this.state

    const noRouter = !this.context.router
    const iconSize = '16px'
    const currentPathname = noRouter ? '' : this.context.router.route.location.pathname
    const shouldShowActive = hovering || active || currentPathname === to || currentPathname === href
    const isHighlighted = ['/notifications', '/messages'].indexOf(to) > -1

    const containerClasses = CX({
      d: 1,
      maxW100PC: 1,
      w100PC: 1,
      flexRow: 1,
      py5: 1,
      px10: 1,
      aiCenter: 1,
      radiusSmall: 1,
      border1PX: 1,
      outlineNone: 1,
      borderColorTransparent: !shouldShowActive,
      borderColorSecondary: shouldShowActive,
      bgTransparent: !shouldShowActive,
      bgPrimary: shouldShowActive,
    })

    const countClasses = CX({
      d: 1,
      text: 1,
      textAlignCenter: 1,
      minW20PX: 1,
      mlAuto: 1,
      fs12PX: 1,
      px5: 1,
      mr2: 1,
      lineHeight15: 1,
      ml5: 1,
      cSecondary: !isHighlighted,
      cWhite: isHighlighted,
      bgRed: isHighlighted,
      circle: isHighlighted,
    })

    return (
      <Button
        to={noRouter ? undefined : to}
        href={noRouter ? (to || href) : href}
        onClick={onClick}
        noClasses
        buttonRef={buttonRef}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
        className={[_s.d, _s.noUnderline, _s.outlineNone, _s.cursorPointer, _s.w100PC, _s.bgTransparent].join(' ')}
      >
        <div className={containerClasses}>
          {
            icon && 
            <Icon id={icon} className={_s.cPrimary} size={iconSize} />
          }
          
          {
            image &&
            <Image
              alt={title}
              className={[_s.circle, _s.overflowHidden].join(' ')}
              width={iconSize}
              height={iconSize}
              src={image}
            />
          }
          
          <div className={[_s.d, _s.flexNormal, _s.px10, _s.textOverflowEllipsis, _s.overflowWrapBreakWord, _s.flexRow, _s.w100PC].join(' ')}>
            <ResponsiveClassesComponent
              classNames={[_s.d, _s.fw400, _s.fs15PX, _s.text, _s.textOverflowEllipsis, _s.cPrimary].join(' ')}
              classNamesSmall={[_s.d, _s.fw400, _s.fs13PX, _s.text, _s.textOverflowEllipsis, _s.cPrimary].join(' ')}
            >
              {title}
            </ResponsiveClassesComponent>
          </div>

          {
            count > 0 &&
            <span className={countClasses}>
              {count}
            </span>
          }
        </div>
      </Button>
    )
  }

}

SidebarSectionItem.propTypes = {
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

export default SidebarSectionItem