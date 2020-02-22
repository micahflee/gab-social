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
    const { title, to, location } = this.props
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
      paddingHorizontal10PX: 1,
      borderBottom2PX: 1,
      borderColorTransparent: !isCurrent,
      borderColorBrand: isCurrent,
    })

    const textOptions = {
      size: 'small',
      color: isCurrent ? 'brand' : 'primary',
      weight: isCurrent ? 'bold' : 'normal',
    }

    return (
      <NavLink to={to} className={containerClasses}>
        <Text {...textOptions}>
          {title}
        </Text>
      </NavLink>
    )
  }
}