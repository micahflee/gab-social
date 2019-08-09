import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Avatar from '../avatar';
import DisplayName from '../display_name';
import { makeGetAccount } from '../../selectors';

import './autosuggest_account.scss';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { id }) => ({
    account: getAccount(state, id),
  });

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
class AutosuggestAccount extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  };

  render () {
    const { account } = this.props;

    return (
      <div className='autosuggest-account' title={account.get('acct')}>
        <div className='autosuggest-account__icon'>
          <Avatar account={account} size={18} />
        </div>
        <DisplayName account={account} />
      </div>
    );
  }

}
