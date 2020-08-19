import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import debounce from 'lodash.debounce'
import { fetchBookmarkedStatuses, expandBookmarkedStatuses } from '../actions/bookmarks'
import { meUsername } from '../initial_state'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'

class BookmarkedStatuses extends ImmutablePureComponent {

  componentWillMount() {
    this.props.dispatch(fetchBookmarkedStatuses())
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandBookmarkedStatuses())
  }, 300, { leading: true })

  render() {
    const {
      statusIds,
      hasMore,
      isLoading,
      isMyAccount,
    } = this.props

    if (!isMyAccount) {
      return <ColumnIndicator type='missing' />
    }

    return (
      <StatusList
        statusIds={statusIds}
        scrollKey='bookmarked_statuses'
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.bookmarked_statuses' defaultMessage="You don't have any bookmarked gabs yet. If you are GabPRO, when you bookmark one, it will show up here." />}
      />
    )
  }

}

const mapStateToProps = (state, { params: { username } }) => {
  return {
    isMyAccount: (username.toLowerCase() === meUsername.toLowerCase()),
    statusIds: state.getIn(['status_lists', 'bookmarks', 'items']),
    isLoading: state.getIn(['status_lists', 'bookmarks', 'isLoading'], true),
    hasMore: !!state.getIn(['status_lists', 'bookmarks', 'next']),
  }
}

BookmarkedStatuses.propTypes = {
  dispatch: PropTypes.func.isRequired,
  statusIds: ImmutablePropTypes.list.isRequired,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMyAccount: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(BookmarkedStatuses)