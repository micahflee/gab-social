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
import Block from '../components/block'
import Button from '../components/button'
import Text from '../components/text'

class BookmarkedStatuses extends ImmutablePureComponent {

  componentWillMount() {
    this.props.dispatch(fetchBookmarkedStatuses(this.props.bookmarkCollectionId))
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandBookmarkedStatuses(this.props.bookmarkCollectionId))
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

    console.log("statusIds:", statusIds)

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <Block>
          <div className={[_s.d, _s.px15, _s.py10].join(' ')}>
            <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
              <Text size='extraLarge' weight='bold'>
                Bookmarks:
              </Text>
              <Button
                className={[_s.px10, _s.mlAuto].join(' ')}
                onClick={this.handleOpenModal}
                backgroundColor='tertiary'
                color='tertiary'
                icon='cog'
              />
            </div>
          </div>
        </Block>
        <div className={[_s.d, _s.w100PC, _s.mt10].join(' ')}>
          <StatusList
            statusIds={statusIds}
            scrollKey='bookmarked_statuses'
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={this.handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.bookmarked_statuses' defaultMessage="You don't have any bookmarked gabs yet. If you are GabPRO, when you bookmark one, it will show up here." />}
          />
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state, { params: { username, bookmarkCollectionId } }) => ({
  bookmarkCollectionId,
  isMyAccount: (username.toLowerCase() === meUsername.toLowerCase()),
  statusIds: state.getIn(['status_lists', 'bookmarks', bookmarkCollectionId, 'items']),
  isLoading: state.getIn(['status_lists', 'bookmarks', bookmarkCollectionId, 'isLoading'], true),
  hasMore: !!state.getIn(['status_lists', 'bookmarks', bookmarkCollectionId, 'next']),
})

BookmarkedStatuses.propTypes = {
  dispatch: PropTypes.func.isRequired,
  statusIds: ImmutablePropTypes.list.isRequired,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  bookmarkCollectionId: PropTypes.string,
  isMyAccount: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(BookmarkedStatuses)