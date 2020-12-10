import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { List as ImmutableList } from 'immutable'
import { injectIntl, defineMessages } from 'react-intl'
import { expandAccountFeaturedTimeline, expandAccountTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'

class AccountCommentsTimeline extends ImmutablePureComponent {

  componentWillMount() {
    const { accountId } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(expandAccountTimeline(accountId, { commentsOnly: true }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== -1 && (nextProps.accountId !== this.props.accountId && nextProps.accountId)) {
      this.props.dispatch(expandAccountTimeline(nextProps.accountId, { commentsOnly: true }))
    }
  }

  handleLoadMore = (maxId) => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountTimeline(this.props.accountId, {
        maxId,
        commentsOnly: true
      }))
    }
  }

  render() {
    const {
      commentIds,
      isLoading,
      hasMore,
      intl,
    } = this.props

    return (
      <Block>
        <BlockHeading title='Comments' />
        <StatusList
          isComments
          scrollKey='account_comments_timeline'
          statusIds={commentIds}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={this.handleLoadMore}
          emptyMessage={intl.formatMessage(messages.empty)}
        />
      </Block>
    )
  }

}

const messages = defineMessages({
  empty: { id: 'empty_column.account_timeline', defaultMessage: 'No gabs here!' },
})

const emptyList = ImmutableList()

const mapStateToProps = (state, { account }) => {
  const accountId = !!account ? account.getIn(['id'], null) : -1
  const path = `${accountId}:comments_only`

  return {
    accountId,
    commentIds: state.getIn(['timelines', `account:${path}`, 'items'], emptyList),
    isLoading: state.getIn(['timelines', `account:${path}`, 'isLoading'], true),
    hasMore: state.getIn(['timelines', `account:${path}`, 'hasMore']),
  }
}

AccountCommentsTimeline.propTypes = {
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  commentIds: ImmutablePropTypes.list,
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(connect(mapStateToProps)(AccountCommentsTimeline))