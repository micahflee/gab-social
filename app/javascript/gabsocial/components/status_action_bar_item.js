import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Text from './text'

const cx = classNames.bind(_s)

export default class StatusActionBarItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    buttonRef: PropTypes.node,
  }

  render() {
    const {
      title,
      onClick,
      icon,
      active,
      disabled,
      buttonRef
    } = this.props

    const btnClasses = cx({
      justifyContentCenter: 1,
      alignItemsCenter: 1,
      px10: 1,
      backgroundSubtle_onHover: 1,
    })

    const color = active ? 'brand' : 'secondary'
    const weight = active ? 'bold' : 'medium'

    return (
      <div className={[_s.default, _s.flexNormal, _s.px5].join(' ')}>
        <Button
          block
          radiusSmall
          backgroundColor='none'
          color={color}
          buttonRef={buttonRef}
          className={btnClasses}
          onClick={onClick}
          active={active}
          disabled={disabled}
          icon={icon}
          iconWidth='16px'
          iconHeight='16px'
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