import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { me } from '../../initial_state';
import ComposeFormContainer from '../../features/compose/containers/compose_form_container';
import Avatar from '../avatar';

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
      <section className={[styles.default, styles.radiusSmall, styles.border1PX, styles.borderColorSubtle, styles.backgroundWhite, styles.marginBottom15PX].join(' ')}>
        <div className={[styles.default, styles.backgroundSubtle, styles.borderBottom1PX, styles.borderColorSubtle, styles.paddingHorizontal15PX, styles.paddingVertical2PX].join(' ')}>
          <h1 className={[styles.default, styles.text, styles.colorSubtle, styles.fontSize12PX, styles.fontWeight500, styles.lineHeight2, styles.paddingVertical2PX].join(' ')}>
            Create Post
          </h1>
        </div>
        <div className={[styles.default, styles.flexRow, styles.paddingVertical15PX, styles.paddingHorizontal15PX].join(' ')}>
          <div className={[styles.default, styles.marginRight10PX].join(' ')}>
            <Avatar account={account} size={46} />
          </div>
          <ComposeFormContainer {...rest} />
        </div>
      </section>
    )
  }

}