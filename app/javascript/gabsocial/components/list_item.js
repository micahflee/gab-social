import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Text from './text'

const cx = classNames.bind(_s)

export default class ListItem extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    isLast: PropTypes.bool,
    to: PropTypes.string,
    href: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.oneOf([
      'small', 'large'
    ]),
    hideArrow: PropTypes.bool,
  }

  render() {
    const {
      title,
      isLast,
      to,
      href,
      onClick,
      size,
      icon,
      hideArrow,
    } = this.props

    const small = size === 'small'
    const large = size === 'large'

    const containerClasses = cx({
      default: 1,
      cursorPointer: 1,
      noUnderline: 1,
      px15: !small,
      py15: !small,
      px10: small,
      py10: small,
      flexRow: 1,
      alignItemsCenter: 1,
      width100PC: 1,
      backgroundColorSubtle_onHover: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const iconClasses = cx({
      mr10: !large,
      mr15: large,
      fillColorPrimary: 1,
    })

    const textSize = small ? 'small' : large ? 'medium' : 'normal'
    const iconSize = large ? '14px' : '10px'

    return (
      <Button
        to={to}
        href={href}
        onClick={onClick}
        className={containerClasses}
        noClasses
      >

        {
          !!icon &&
          <Icon
            id={icon}
            size={iconSize}
            className={iconClasses}
          />
        }

        <Text color='primary' size={textSize}>
          {title}
        </Text>

        {
          !hideArrow &&
          <Icon
            id='angle-right'
            size='10px'
            className={[_s.mlAuto, _s.fillColorSecondary].join(' ')}
          />
        }
      </Button>
    )
  }
}