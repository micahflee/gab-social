import { NavLink, withRouter } from 'react-router-dom'
import classNames from 'classnames/bind'
import Text from './text'

const cx = classNames.bind(_s)

export default
@withRouter
class TabBarItem extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    title: PropTypes.string,
    to: PropTypes.string,
    large: PropTypes.bool,
  }

  state = {
    active: -1,
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const isCurrent = this.props.to === this.props.location.pathname

      if (this.state.active !== isCurrent) {
        this.setState({
          active: isCurrent,
        })
      }
    }
  }

  render() {
    const { title, to, location, large } = this.props
    const { active } = this.state

    const isCurrent = active === -1 ? to === location.pathname : active

    const containerClasses = cx({
      default: 1,
      height53PX: 1,
      noUnderline: 1,
      text: 1,
      displayFlex: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      borderBottom2PX: 1,
      paddingVertical5PX: 1,
      borderColorTransparent: !isCurrent,
      borderColorBrand: isCurrent,
      marginRight5PX: large,
    })

    const textParentClasses = cx({
      default: 1,
      height100PC: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      radiusSmall: 1,
      paddingHorizontal10PX: !large,
      paddingHorizontal15PX: large,
      backgroundSubtle2Dark_onHover: !isCurrent,
    })

    const textOptions = {
      size: !!large ? 'normal' : 'small',
      color: isCurrent ? 'brand' : large ? 'secondary' : 'primary',
      weight: isCurrent ? 'bold' : large ? 'medium' : 'normal',
      className: cx({
        paddingHorizontal5PX: large,
      }),
    }

    return (
      <NavLink to={to} className={containerClasses}>
        <span className={textParentClasses}>
          <Text {...textOptions}>
            {title}
          </Text>
        </span>
      </NavLink>
    )
  }
}