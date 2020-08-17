import React from 'react'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchFollowers,
  expandFollowers,
} from '../actions/accounts'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import AccountPlaceholder from '../components/placeholder/account_placeholder'

const mapStateToProps = (state, { account }) => {
  const accountId = !!account ? account.get('id') : -1

  return {
    accountId,
    accountIds: state.getIn(['user_lists', 'followers', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'followers', accountId, 'next']),
    isLoading: state.getIn(['user_lists', 'followers', accountId, 'isLoading'], true),
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
    isLoading: PropTypes.bool,
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
      intl,
      isLoading,
    } = this.props

    return (
      <Block>
        <BlockHeading title={intl.formatMessage(messages.followers)} />
        <ScrollableList
          scrollKey='followers'
          hasMore={hasMore}
          isLoading={isLoading}
          showLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          placeholderComponent={AccountPlaceholder}
          placeholderCount={4}
          emptyMessage={intl.formatMessage(messages.empty)}
        >
          {
            account && accountIds && accountIds.map((id) => (
              <Account key={`follower-${id}`} id={id} compact withBio />
            ))
          }
        </ScrollableList>
      </Block>
    )
  }

}
