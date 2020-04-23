import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { autoPlayGif } from '../initial_state'
import Image from './image'

/**
 * Renders an avatar component
 * @param {map} [props.account] - the account for image
 * @param {number} [props.size=40] - the size of the avatar
 */
export default class Avatar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 40,
  }

  state = {
    hovering: false,
    sameImg: !this.props.account ? false : this.props.account.get('avatar') === this.props.account.get('avatar_static'),
  }

  componentDidUpdate (prevProps) {
    if (prevProps.account !== this.props.account) {
      this.setState({
        sameImg: !this.props.account ? false : this.props.account.get('avatar') === this.props.account.get('avatar_static'),
      })
    }
  }

  handleMouseEnter = () => {
    // : todo : user popover
    this.setState({ hovering: true })
  }

  handleMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const { account, size } = this.props
    const { hovering, sameImg } = this.state

    const shouldAnimate = autoPlayGif || !sameImg

    const options = {
      alt: !account ? 'Avatar' : account.get('display_name'),
      className: [_s.default, _s.circle, _s.overflowHidden].join(' '),
      onMouseEnter: shouldAnimate ? this.handleMouseEnter : undefined,
      onMouseLeave: shouldAnimate ? this.handleMouseLeave : undefined,
      src: !account ? undefined : account.get((hovering || autoPlayGif) ? 'avatar' : 'avatar_static'),
      alt: !account ? undefined : account.get('display_name'),
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
