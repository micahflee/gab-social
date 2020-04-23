import { NavLink } from 'react-router-dom'
import Text from './text'

/**
 * Renders a user stat component
 * @param {string} props.title - bottom title
 * @param {string} props.to - location to go to on click
 * @param {string} props.value - top value
 */
export default class UserStat extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
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
        className={[_s.default, _s.flexGrow1, _s.cursorPointer, _s.noUnderline, _s.pr15].join(' ')}
        onMouseEnter={this.handleOnMouseEnter}
        onMouseLeave={this.handleOnMouseLeave}
      >
        <Text size='large' weight='bold' color='brand'>
          {value}
        </Text>
        <Text size='small' weight='medium' color='secondary' hasUnderline={hovering}>
          {title}
        </Text>
      </NavLink>
    )
  }

}