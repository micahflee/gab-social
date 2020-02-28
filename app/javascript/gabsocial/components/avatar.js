import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Map as ImmutableMap } from 'immutable'
import { autoPlayGif } from '../initial_state'
import Image from './image'

export default
class Avatar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    size: PropTypes.number.isRequired,
    animate: PropTypes.bool,
  }

  static defaultProps = {
    account: ImmutableMap(),
    animate: autoPlayGif,
    size: 40,
  }

  state = {
    hovering: false,
    sameImg: this.props.account.get('avatar') === this.props.account.get('avatar_static'),
  }

  handleMouseEnter = () => {
    // : todo : user popover
    this.setState({ hovering: true })
  }

  handleMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const { account, size, animate } = this.props
    const { hovering, sameImg } = this.state

    const shouldAnimate = animate || !sameImg

    const options = {
      className: [_s.default, _s.circle].join(' '),
      onMouseEnter: shouldAnimate ? this.handleMouseEnter : undefined,
      onMouseLeave: shouldAnimate ? this.handleMouseLeave : undefined,
      src: account.get((hovering || animate) ? 'avatar' : 'avatar_static'),
      alt: account.get('display_name'),
      style: {
        width: `${size}px`,
        height: `${size}px`,
      },
    }

    return (
      <Image {...options} />
    )
  }

}
