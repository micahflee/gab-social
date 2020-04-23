import { withRouter } from 'react-router-dom'
import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Text from './text'

// Bind CSS Modules global variable `_s` to classNames module
const cx = classNames.bind(_s)

/**
 * Renders a tab bar item component
 * @param {string} [props.icon] - icon to use
 * @param {bool} [props.isLarge] - to style the tab bar larger
 * @param {bool} [props.isActive] - if item is active
 * @param {func} [props.onClick] - function to call on click
 * @param {string} [props.title] - title to use
 * @param {string} [props.to] - location to direct to on click
 */
export default
@withRouter
class TabBarItem extends PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    isLarge: PropTypes.bool,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    title: PropTypes.string,
    to: PropTypes.string,
  }

  state = {
    isCurrent: -1,
  }

  componentDidUpdate(prevProps) {
    // If user navigates to different page, ensure tab bar item
    // with this.props.to that is on location is set to active.
    if (this.props.location !== prevProps.location) {
      const isCurrent = this.props.to === this.props.location.pathname

      if (this.state.isCurrent !== isCurrent) {
        this.setState({ isCurrent })
      }
    }
  }

  render() {
    const {
      title,
      to,
      onClick,
      location,
      isLarge,
      icon,
      isActive,
    } = this.props
    const { isCurrent } = this.state

    // Combine state, props, location to make absolutely
    // sure of active status.
    const active = isActive ||
      (isCurrent === -1 ? to === location.pathname : false)

    const containerClasses = cx({
      default: 1,
      height53PX: 1,
      noUnderline: 1,
      text: 1,
      displayFlex: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      borderBottom2PX: 1,
      py5: 1,
      outlineNone: 1,
      cursorPointer: 1,
      backgroundTransparent: 1,
      borderColorTransparent: !active,
      borderColorBrand: active,
      mr5: isLarge,
      mr2: !isLarge,
    })

    const textParentClasses = cx({
      default: 1,
      height100PC: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      radiusSmall: 1,
      px10: !isLarge,
      px15: isLarge,
      backgroundSubtle2Dark_onHover: !active,
    })

    const textOptions = {
      size: !!isLarge ? 'normal' : 'small',
      color: active ? 'brand' : isLarge ? 'secondary' : 'primary',
      weight: active ? 'bold' : isLarge ? 'medium' : 'normal',
    }

    const iconOptions = {
      id: icon,
      width: !!isLarge ? 20 : 14,
      height: !!isLarge ? 20 : 14,
    }

    return (
      <Button
        onClick={onClick}
        className={containerClasses}
        to={to || undefined}
        noClasses
      >
        <span className={textParentClasses}>
          {
            !!title &&
            <Text {...textOptions}>
              {title}
            </Text>
          }

          {
            !!icon &&
            <Icon {...iconOptions} />
          }
        </span>
      </Button>
    )
  }

}