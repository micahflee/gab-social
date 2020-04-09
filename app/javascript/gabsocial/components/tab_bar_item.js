import { withRouter } from 'react-router-dom'
import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Text from './text'

const cx = classNames.bind(_s)

export default
@withRouter
class TabBarItem extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    title: PropTypes.string,
    onClick: PropTypes.func,
    icon: PropTypes.string,
    to: PropTypes.string,
    large: PropTypes.bool,
    active: PropTypes.bool,
  }

  state = {
    isCurrent: -1,
  }

  componentDidUpdate(prevProps) {
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
      large,
      icon,
      active
    } = this.props
    const { isCurrent } = this.state

    const isActive = active || (isCurrent === -1 ? to === location.pathname : false)

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
      borderColorTransparent: !isActive,
      borderColorBrand: isActive,
      mr5: large,
    })

    const textParentClasses = cx({
      default: 1,
      height100PC: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      radiusSmall: 1,
      px10: !large,
      px15: large,
      backgroundSubtle2Dark_onHover: !isActive,
    })

    const textOptions = {
      size: !!large ? 'normal' : 'small',
      color: isActive ? 'brand' : large ? 'secondary' : 'primary',
      weight: isActive ? 'bold' : large ? 'medium' : 'normal',
    }

    const iconOptions = {
      id: icon,
      width: !!large ? 20 : 14,
      height: !!large ? 20 : 14,
    }

    return (
      <Button
        onClick={onClick}
        className={containerClasses}
        to={to || undefined}
        noClasses
      >
        <span className={textParentClasses}>
          { !!title &&
          <Text {...textOptions}>
            {title}
          </Text>
          }

          { !!icon &&
            <Icon {...iconOptions} />
          }
        </span>
      </Button>
    )
  }
}