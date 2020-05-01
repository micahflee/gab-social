import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { me } from '../../initial_state'
import { fetchFollowRequests, expandFollowRequests } from '../../actions/accounts'
import AccountAuthorize from './components/account_authorize'
import ScrollableList from '../../components/scrollable_list'

const messages = defineMessages({
  heading: { id: 'column.follow_requests', defaultMessage: 'Follow requests' },
})

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'follow_requests', 'items']),
  isLoading: state.getIn(['user_lists', 'follow_requests', 'isLoading'], true),
  hasMore: !!state.getIn(['user_lists', 'follow_requests', 'next']),
  locked: !!state.getIn(['accounts', me, 'locked']),
  domain: state.getIn(['meta', 'domain']),
})

export default
@connect(mapStateToProps)
@injectIntl
class FollowRequests extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    locked: PropTypes.bool,
    domain: PropTypes.string,
    isLoading: PropTypes.bool,
    accountIds: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  }

  componentWillMount () {
    this.props.dispatch(fetchFollowRequests())
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandFollowRequests())
  }, 300, { leading: true })

  render () {
    const { intl, accountIds, hasMore, locked, domain, isLoading } = this.props

    // : todo :
    const unlockedPrependMessage = locked ? null : (
      <div className='follow_requests-unlocked_explanation'>
        <FormattedMessage
          id='follow_requests.unlocked_explanation'
          defaultMessage='Even though your account is not locked, the {domain} staff thought you might want to review follow requests from these accounts manually.'
          values={{ domain: domain }}
        />
      </div>
    );

    return (
      <ScrollableList
        scrollKey='follow_requests'
        onLoadMore={this.handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        emptyMessage={<FormattedMessage id='empty_column.follow_requests' defaultMessage="You don't have any follow requests yet. When you receive one, it will show up here." />}
      >
        {
          !!accountIds && accountIds.map(id =>
            <AccountAuthorize key={id} id={id} />
          )
        }
      </ScrollableList>
    );
  }

}
