import { NavLink } from 'react-router-dom'
import Text from './text'

export default class UserStat extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const { to, title, value } = this.props
    const { hovering } = this.state

    return (
      <NavLink
        to={to}
        title={`${value} ${title}`}
        className={[_s.default, _s.flexGrow1, _s.cursorPointer, _s.noUnderline, _s.paddingRight15PX].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <Text size='large' weight='bold' color='brand'>
          {value}
        </Text>
        <Text size='small' weight='medium' color='secondary' underline={hovering}>
          {title}
        </Text>
      </NavLink>
    )
  }
}