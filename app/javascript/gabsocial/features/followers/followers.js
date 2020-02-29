import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { debounce } from 'lodash'
import { defineMessages, injectIntl } from 'react-intl'
import ColumnIndicator from '../../components/column_indicator'
import {
  fetchAccount,
  fetchFollowers,
  expandFollowers,
  fetchAccountByUsername,
} from '../../actions/accounts'
import { me } from '../../initial_state'
import AccountContainer from '../../containers/account_container'
import ScrollableList from '../../components/scrollable_list'
import Block from '../../components/block'
import Heading from '../../components/heading'

const mapStateToProps = (state, { params: { username } }) => {
  const accounts = state.getIn(['accounts'])
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() == username.toLowerCase())

  let accountId = -1
  if (accountFetchError) {
    accountId = null
  } else {
    let account = accounts.find(acct => username.toLowerCase() == acct.getIn(['acct'], '').toLowerCase())
    accountId = account ? account.getIn(['id'], null) : -1
  }

  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false)
  const isLocked = state.getIn(['accounts', accountId, 'locked'], false)
  const isFollowing = state.getIn(['relationships', accountId, 'following'], false)
  const unavailable = (me == accountId) ? false : (isBlocked || (isLocked && !isFollowing))

  return {
    accountId,
    unavailable,
    isAccount: !!state.getIn(['accounts', accountId]),
    accountIds: state.getIn(['user_lists', 'followers', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'followers', accountId, 'next']),
  }
}

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  empty: { id: 'account.followers.empty', defaultMessage: 'No one follows this user yet.' },
  unavailable: { id: 'empty_column.account_unavailable', defaultMessage: 'Profile unavailable' },
})

export default
@connect(mapStateToProps)
@injectIntl
class Followers extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
  }

  componentWillMount() {
    const { params: { username }, accountId } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchAccount(accountId))
      this.props.dispatch(fetchFollowers(accountId))
    } else {
      this.props.dispatch(fetchAccountByUsername(username))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== -1 && (nextProps.accountId !== this.props.accountId && nextProps.accountId)) {
      this.props.dispatch(fetchAccount(nextProps.accountId))
      this.props.dispatch(fetchFollowers(nextProps.accountId))
    }
  }

  handleLoadMore = debounce(() => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandFollowers(this.props.accountId))
    }
  }, 300, { leading: true })

  render() {
    const {
      accountIds,
      hasMore,
      isAccount,
      accountId,
      unavailable,
      intl
    } = this.props

    if (!isAccount && accountId !== -1) {
      return <ColumnIndicator type='missing' />
    } else if (accountId === -1 || (!accountIds)) {
      return <ColumnIndicator type='loading' />
    } else if (unavailable) {
      return <ColumnIndicator type='error' message={intl.formatMessage(messages.unavailable)} />
    }

    return (
      <Block>
        <div className={[_s.default, _s.paddingHorizontal15PX, _s.paddingVertical10PX, _s.justifyContentCenter, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')}>
          <Heading size='h3'>
            {intl.formatMessage(messages.followers)}
          </Heading>
        </div>
        <div className={[_s.default, _s.paddingHorizontal15PX, _s.paddingVertical10PX].join(' ')}>
          <ScrollableList
            scrollKey='followers'
            hasMore={hasMore}
            onLoadMore={this.handleLoadMore}
            emptyMessage={intl.formatMessage(messages.empty)}
          >
            {accountIds.map((id, i) => (
              <AccountContainer key={id} id={id} withNote={false} compact />
            ))}
          </ScrollableList>
        </div>
      </Block>
    )
  }

}
