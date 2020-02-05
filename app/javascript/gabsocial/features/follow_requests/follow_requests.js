import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import { fetchFollowRequests, expandFollowRequests } from '../../actions/accounts';
import ColumnIndicator from '../../components/column_indicator';
import Column from '../../components/column';
import AccountAuthorize from './components/account_authorize';
import ScrollableList from '../../components/scrollable_list';

const messages = defineMessages({
  heading: { id: 'column.follow_requests', defaultMessage: 'Follow requests' },
});

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'follow_requests', 'items']),
  hasMore: !!state.getIn(['user_lists', 'follow_requests', 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class FollowRequests extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    accountIds: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  };

  componentWillMount () {
    this.props.dispatch(fetchFollowRequests());
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandFollowRequests());
  }, 300, { leading: true });

  render () {
    const { intl, accountIds, hasMore } = this.props;

    if (!accountIds) {
      return (<ColumnIndicator type='loading' />);
    }

    return (
      <Column icon='user-plus' heading={intl.formatMessage(messages.heading)} backBtn='slim'>
        <ScrollableList
          scrollKey='follow_requests'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          emptyMessage={<FormattedMessage id='empty_column.follow_requests' defaultMessage="You don't have any follow requests yet. When you receive one, it will show up here." />}
        >
          {accountIds.map(id =>
            <AccountAuthorize key={id} id={id} />
          )}
        </ScrollableList>
      </Column>
    );
  }

}