import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { List as ImmutableList } from 'immutable'
import { injectIntl, defineMessages } from 'react-intl'
import { expandAccountFeaturedTimeline, expandAccountTimeline } from '../actions/timelines'
import { fetchAccountIdentityProofs } from '../actions/identity_proofs'
import StatusList from '../components/status_list'

const messages = defineMessages({
  empty: { id: 'empty_column.account_timeline', defaultMessage: 'No gabs here!' },
})

const emptyList = ImmutableList()

const mapStateToProps = (state, { account, withReplies = false }) => {
  const accountId = !!account ? account.getIn(['id'], null) : -1

  const path = withReplies ? `${accountId}:with_replies` : accountId

  return {
    accountId,
    statusIds: state.getIn(['timelines', `account:${path}`, 'items'], emptyList),
    featuredStatusIds: withReplies ? ImmutableList() : state.getIn(['timelines', `account:${accountId}:pinned`, 'items'], emptyList),
    isLoading: state.getIn(['timelines', `account:${path}`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${path}`, 'hasMore']),
  }
}

export default
@connect(mapStateToProps)
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
    intl: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { accountId, withReplies } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchAccountIdentityProofs(accountId))

      if (!withReplies) {
        this.props.dispatch(expandAccountFeaturedTimeline(accountId))
      }

      this.props.dispatch(expandAccountTimeline(accountId, { withReplies }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== -1 && (nextProps.accountId !== this.props.accountId && nextProps.accountId) || nextProps.withReplies !== this.props.withReplies) {
      this.props.dispatch(fetchAccountIdentityProofs(nextProps.accountId))

      if (!nextProps.withReplies) {
        this.props.dispatch(expandAccountFeaturedTimeline(nextProps.accountId))
      }

      this.props.dispatch(expandAccountTimeline(nextProps.accountId, { withReplies: nextProps.withReplies }))
    }
  }

  handleLoadMore = maxId => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountTimeline(this.props.accountId, {
        maxId,
        withReplies: this.props.withReplies
      }))
    }
  }

  render() {
    const {
      account,
      statusIds,
      featuredStatusIds,
      isLoading,
      hasMore,
      intl
    } = this.props

    if (!account) return null

    return (
      <StatusList
        scrollKey='account_timeline'
        statusIds={statusIds}
        featuredStatusIds={featuredStatusIds}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={this.handleLoadMore}
        emptyMessage={intl.formatMessage(messages.empty)}
      />
    )
  }

}
