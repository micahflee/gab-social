import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FormattedMessage } from 'react-intl'
import debounce from 'lodash.debounce'
import { fetchLikes, expandLikes } from '../actions/interactions'
import { fetchStatus } from '../actions/statuses'
import { makeGetStatus } from '../selectors'
import Account from '../components/account'
import ColumnIndicator from '../components/column_indicator'
import ScrollableList from '../components/scrollable_list'
import AccountPlaceholder from '../components/placeholder/account_placeholder'

class StatusLikes extends ImmutablePureComponent {

  componentWillMount () {
    this.props.dispatch(fetchLikes(this.props.statusId))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.statusId !== this.props.statusId && nextProps.statusId) {
      this.props.dispatch(fetchLikes(nextProps.statusId))
    }
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandLikes(this.props.statusId))
  }, 300, { leading: true })

  render () {
    const {
      accountIds,
      isLoading,
      hasMore,
      list,
      statusId,
    } = this.props

    if (!statusId) {
      return <ColumnIndicator type='missing' />
    }

    const accountIdCount = !!accountIds ? accountIds.count() : 0

    return (
      <ScrollableList
        scrollKey='likes'
        emptyMessage={<FormattedMessage id='status.likes.empty' defaultMessage='No one has liked this gab yet. When someone does, they will show up here.' />}
        onLoadMore={this.handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading && accountIdCount === 0}
        showLoading={isLoading && accountIdCount === 0}
        placeholderComponent={AccountPlaceholder}
        placeholderCount={3}
      >
        {
          accountIdCount > 0 && accountIds.map((id) => (
            <Account
              compact
              key={`liked-by-${id}`}
              id={id}
            />
          ))
        }
      </ScrollableList>
    )
  }

}

const mapStateToProps = (state, props) => {
  const statusId = props.params ? props.params.statusId : props.statusId
  return {
    accountIds: state.getIn(['user_lists', 'liked_by', statusId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'liked_by', statusId, 'next']),
    isLoading: state.getIn(['user_lists', 'liked_by', statusId, 'isLoading']),
  }
}

StatusLikes.propTypes = {
  accountIds: ImmutablePropTypes.list,
  dispatch: PropTypes.func.isRequired,
  statusId: PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(StatusLikes)
