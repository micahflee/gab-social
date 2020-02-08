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
      <div className={[styles.default, styles.flexRow, styles.radiusSmall, styles.border1PX, styles.borderColorSubtle, styles.backgroundWhite, styles.marginBottom15PX, styles.paddingVertical10PX, styles.paddingHorizontal15PX].join(' ')}>
        <div className={[styles.default, styles.marginRight10PX].join(' ')}>
          <Avatar account={account} size={46} />
        </div>
        <ComposeFormContainer {...rest} />
      </div>
    )
  }

}