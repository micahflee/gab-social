import { Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
// import HeaderContainer from '../features/account_timeline/containers/header_container';
// import ProfileInfoPanel from '../features/account_timeline/components/profile_info_panel/profile_info_panel';
// import { WhoToFollowPanel, SignUpPanel } from '../components/panel';
// import LinkFooter from '../components/link_footer';
import ProfileLayout from '../components/layouts/profile_layout';

const mapStateToProps = (state, { params: { username }, withReplies = false }) => {
  const accounts = state.getIn(['accounts']);
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() == username.toLowerCase());

  let accountId = -1;
  let account = null;
  let accountUsername = username;
  if (accountFetchError) {
    accountId = null;
  }
  else {
    account = accounts.find(acct => username.toLowerCase() == acct.getIn(['acct'], '').toLowerCase());
    accountId = account ? account.getIn(['id'], null) : -1;
    accountUsername = account ? account.getIn(['acct'], '') : '';
  }

  //Children components fetch information

  return {
    account,
    accountId,
    accountUsername,
  };
};

export default @connect(mapStateToProps)
class ProfilePage extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map,
    accountUsername: PropTypes.string.isRequired,
    accountId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    children: PropTypes.node,
  };

  render() {
    const { accountId, account, accountUsername } = this.props;

    return (
      <ProfileLayout>
        { /*this.props.children */ }
      </ProfileLayout>
    )
  }
}