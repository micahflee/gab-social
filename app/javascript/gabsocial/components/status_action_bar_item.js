import { compactMode } from '../initial_state'
import { CX } from '../constants'
import Button from './button'
import Text from './text'

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

    const containerClasses = CX({
      default: 1,
      px5: !compactMode,
      px10: compactMode,
      flexNormal: !compactMode,
    })

    const btnClasses = CX({
      justifyContentCenter: 1,
      alignItemsCenter: 1,
      px10: !compactMode,
      px15: compactMode,
      pt10: compactMode,
      bgSubtle_onHover: !disabled,
    })

    const iconClasses = CX({
      default: 1,
      inheritFill: 1,
      mr10: !!title,
    })

    const color = active ? 'brand' : 'secondary'
    const weight = active ? 'bold' : 'medium'
    const iconSize = compactMode ? '14px' : '16px'

    return (
      <div className={containerClasses}>
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
          iconSize={iconSize}
          iconClassName={iconClasses}
        > 
          {
            !!title &&
            <Text color='inherit' size='small' weight={weight}>
              {title}
            </Text>
          }
        </Button>
      </div>
    )
  }
}