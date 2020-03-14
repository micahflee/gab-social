import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Text from './text'

const cx = classNames.bind(_s)

export default class ListItem extends PureComponent {
  static propTypes = {
    isLast: PropTypes.bool,
    to: PropTypes.string,
    href: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    small: PropTypes.bool,
  }

  render() {
    const { title, isLast, to, href, onClick, small } = this.props

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
      backgroundSubtle_onHover: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const textSize = small ? 'small' : 'normal'

    return (
      <Button
        to={to}
        href={href}
        onClick={onClick}
        className={containerClasses}
        noClasses
      >
        <Text color='primary' size={textSize}>
          {title}
        </Text>

        <Icon
          id='angle-right'
          width='10px'
          height='10px'
          className={[_s.marginLeftAuto, _s.fillColorBlack].join(' ')}
        />
      </Button>
    )
  }
}