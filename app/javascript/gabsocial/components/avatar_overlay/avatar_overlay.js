import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { autoPlayGif } from '../../initial_state';

export default class AvatarOverlay extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    friend: ImmutablePropTypes.map.isRequired,
    animate: PropTypes.bool,
  };

  static defaultProps = {
    animate: autoPlayGif,
  };

  render() {
    const { account, friend, animate } = this.props;

    const baseSrc = account.get(animate ? 'avatar' : 'avatar_static');
    const overlaySrc = friend.get(animate ? 'avatar' : 'avatar_static');

    return (
      <div className='avatar-overlay'>
        <img className='avatar-overlay__base' src={baseSrc} />
        <img className='avatar-overlay__overlay' src={overlaySrc} />
      </div>
    );
  }

}
