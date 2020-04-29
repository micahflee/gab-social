import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Text from './text'

const cx = classNames.bind(_s)

export default class StatusActionBarItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    altTitle: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    buttonRef: PropTypes.oneOf([
      PropTypes.func,
      PropTypes.node,
    ]),
  }

  render() {
    const {
      title,
      onClick,
      icon,
      active,
      disabled,
      buttonRef,
      altTitle
    } = this.props

    const btnClasses = cx({
      justifyContentCenter: 1,
      alignItemsCenter: 1,
      px10: 1,
      bgSubtle_onHover: !disabled,
    })

    const color = active ? 'brand' : 'secondary'
    const weight = active ? 'bold' : 'medium'

    return (
      <div className={[_s.default, _s.flexNormal, _s.px5].join(' ')}>
        <Button
          isBlock
          radiusSmall
          backgroundColor='none'
          title={altTitle}
          color={color}
          buttonRef={buttonRef}
          className={btnClasses}
          onClick={onClick}
          isDisabled={disabled}
          icon={icon}
          iconSize='16px'
          iconClassName={[_s.default, _s.mr10, _s.inheritFill].join(' ')}
        >
          <Text color='inherit' size='small' weight={weight}>
            {title}
          </Text>
        </Button>
      </div>
    )
  }
}