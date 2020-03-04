import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { debounce } from 'lodash'
import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchFollowers,
  expandFollowers,
} from '../actions/accounts'
import AccountContainer from '../containers/account_container'
import ScrollableList from '../components/scrollable_list'
import Block from '../components/block'
import Heading from '../components/heading'

const mapStateToProps = (state, { account }) => {
  const accountId = !!account ? account.get('id') : -1

  return {
    accountId,
    accountIds: state.getIn(['user_lists', 'followers', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'followers', accountId, 'next']),
  }
}

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  empty: { id: 'account.followers.empty', defaultMessage: 'No one follows this user yet.' },
})

export default
@connect(mapStateToProps)
@injectIntl
class Followers extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    accountId: PropTypes.string,
    intl: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
  }

  componentWillMount() {
    const { accountId } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchFollowers(accountId))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.accountId && nextProps.accountId !== -1 && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(fetchFollowers(nextProps.accountId))
    }
  }

  handleLoadMore = debounce(() => {
    const { accountId } = this.props
    if (!!accountId && accountId !== -1) {
      this.props.dispatch(expandFollowers(accountId))
    }
  }, 300, { leading: true })

  render() {
    const {
      account,
      accountIds,
      hasMore,
      intl
    } = this.props

    if (!account) return null

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
            {
              !!accountIds && accountIds.map((id) => (
                <AccountContainer key={`follower-${id}`} id={id} withNote={false} compact />
              ))
            }
          </ScrollableList>
        </div>
      </Block>
    )
  }

}
