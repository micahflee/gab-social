import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { me } from '../initial_state';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import Avatar from './avatar';

const mapStateToProps = state => {
  return {
    account: state.getIn(['accounts', me]),
  };
};

export default @connect(mapStateToProps)
class TimelineComposeBlock extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 32,
  }

  render() {
    const { account, size, ...rest } = this.props;

    return (
      <section className={[_s.default, _s.overflowHidden, _s.radiusSmall, _s.border1PX, _s.bordercolorSecondary, _s.backgroundWhite, _s.marginBottom15PX].join(' ')}>
        <div className={[_s.default, _s.backgroundSubtle, _s.borderBottom1PX, _s.bordercolorSecondary, _s.paddingHorizontal15PX, _s.paddingVertical2PX].join(' ')}>
          <h1 className={[_s.default, _s.text, _s.colorSecondary, _s.fontSize12PX, _s.fontWeightMedium, _s.lineHeight2, _s.paddingVertical2PX].join(' ')}>
            Create Post
          </h1>
        </div>
        <div className={[_s.default, _s.flexRow, _s.paddingVertical15PX, _s.paddingHorizontal15PX].join(' ')}>
          <div className={[_s.default, _s.marginRight10PX].join(' ')}>
            <Avatar account={account} size={46} />
          </div>
          <ComposeFormContainer {...rest} />
        </div>
      </section>
    )
  }

}