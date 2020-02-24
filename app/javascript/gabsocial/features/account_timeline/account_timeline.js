import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { List as ImmutableList } from 'immutable';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { fetchAccount, fetchAccountByUsername } from '../../actions/accounts';
import { expandAccountFeaturedTimeline, expandAccountTimeline } from '../../actions/timelines';
import { fetchAccountIdentityProofs } from '../../actions/identity_proofs';
import { me } from '../../initial_state';
import StatusList from '../../components/status_list/status_list';
import ColumnIndicator from '../../components/column_indicator';

const messages = defineMessages({
  posts: { id: 'account.posts', defaultMessage: 'Gabs' },
  postsWithReplies: { id: 'account.posts_with_replies', defaultMessage: 'Gabs and replies' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  error: { id: 'empty_column.account_unavailable', defaultMessage: 'Profile unavailable' },
});

const emptyList = ImmutableList();

const mapStateToProps = (state, { params: { username }, withReplies = false }) => {
  const accounts = state.getIn(['accounts']);
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() == username.toLowerCase());

  let accountId = -1;
  let accountUsername = username;
  if (accountFetchError) {
    accountId = null;
  } else {
    let account = accounts.find(acct => username.toLowerCase() == acct.getIn(['acct'], '').toLowerCase());
    accountId = account ? account.getIn(['id'], null) : -1;
    accountUsername = account ? account.getIn(['acct'], '') : '';
  }

  const path = withReplies ? `${accountId}:with_replies` : accountId;

  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
  const isLocked = state.getIn(['accounts', accountId, 'locked'], false);
  const isFollowing = state.getIn(['relationships', accountId, 'following'], false);
  const unavailable = (me == accountId) ? false : (isBlocked || (isLocked && !isFollowing));

  return {
    accountId,
    unavailable,
    accountUsername,
    isAccount: !!state.getIn(['accounts', accountId]),
    statusIds: state.getIn(['timelines', `account:${path}`, 'items'], emptyList),
    featuredStatusIds: withReplies ? ImmutableList() : state.getIn(['timelines', `account:${accountId}:pinned`, 'items'], emptyList),
    isLoading: state.getIn(['timelines', `account:${path}`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${path}`, 'hasMore']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class AccountTimeline extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list,
    featuredStatusIds: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    withReplies: PropTypes.bool,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { params: { username }, accountId, withReplies } = this.props;

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchAccount(accountId));
      this.props.dispatch(fetchAccountIdentityProofs(accountId));

      if (!withReplies) {
        this.props.dispatch(expandAccountFeaturedTimeline(accountId));
      }

      this.props.dispatch(expandAccountTimeline(accountId, { withReplies }));
    } else {
      this.props.dispatch(fetchAccountByUsername(username));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== -1 && (nextProps.accountId !== this.props.accountId && nextProps.accountId) || nextProps.withReplies !== this.props.withReplies) {
      this.props.dispatch(fetchAccount(nextProps.accountId));
      this.props.dispatch(fetchAccountIdentityProofs(nextProps.accountId));

      if (!nextProps.withReplies) {
        this.props.dispatch(expandAccountFeaturedTimeline(nextProps.accountId));
      }

      this.props.dispatch(expandAccountTimeline(nextProps.accountId, { withReplies: nextProps.withReplies }));
    }
  }

  handleLoadMore = maxId => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountTimeline(this.props.accountId, { maxId, withReplies: this.props.withReplies }));
    }
  }

  render() {
    const { statusIds, featuredStatusIds, isLoading, hasMore, isAccount, accountId, unavailable, accountUsername, intl } = this.props;

    if (!isAccount && accountId !== -1) {
      return (<ColumnIndicator type='missing' />);
    } else if (accountId === -1 || (!statusIds && isLoading)) {
      return (<ColumnIndicator type='loading' />);
    } else if (unavailable) {
      return (<ColumnIndicator type='error' message={intl.formatMessage(messages.error)} />);
    }

    /* <SectionHeadlineBar
        className='account-section-headline'
        items={[
          {
            exact: true,
            to: `/${accountUsername}`,
            title: intl.formatMessage(messages.posts),
          },
          {
            exact: true,
            to: `/${accountUsername}/with_replies`,
            title: intl.formatMessage(messages.postsWithReplies),
          },
          {
            exact: true,
            to: `/${accountUsername}/media`,
            title: intl.formatMessage(messages.media),
          },
        ]}
      />
      */

    return (
      <StatusList
        scrollKey='account_timeline'
        statusIds={statusIds}
        featuredStatusIds={featuredStatusIds}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.account_timeline' defaultMessage='No gabs here!' />}
      />
    );
  }

}
