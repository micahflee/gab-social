import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import Icon from './icon'

const cx = classNames.bind(_s)

export default class ListItem extends PureComponent {
  static propTypes = {
    isLast: PropTypes.bool,
    to: PropTypes.string,
    title: PropTypes.string,
  }

  render() {
    const { to, title, isLast } = this.props

    const containerClasses = cx({
      default: 1,
      cursorPointer: 1,
      noUnderline: 1,
      paddingHorizontal15PX: 1,
      paddingVertical15PX: 1,
      flexRow: 1,
      alignItemsCenter: 1,
      backgroundSubtle_onHover: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    return (
      <NavLink to={to} className={containerClasses} >
        <span className={[_s.default, _s.text, _s.colorPrimary, _s.fontSize14PX].join(' ')}>
          {title}
        </span>
        <Icon
          id='angle-right'
          width='10px'
          height='10px'
          className={[_s.marginLeftAuto, _s.fillColorBlack].join(' ')}
        />
      </NavLink>
    )
  }
}