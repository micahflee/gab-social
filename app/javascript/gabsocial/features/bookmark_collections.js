import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  MODAL_BOOKMARK_COLLECTION_CREATE,
} from '../constants'
import {
  meUsername,
} from '../initial_state'
import { fetchBookmarkCollections } from '../actions/bookmarks'
import { openModal } from '../actions/modal'
import ColumnIndicator from '../components/column_indicator'
import Block from '../components/block'
import Button from '../components/button'
import Text from '../components/text'
import List from '../components/list'

class BookmarkCollections extends ImmutablePureComponent {

  componentDidMount() {
    this.props.onFetchBookmarkCollections()
  }

  handleOpenModal = () => {
    this.props.onOpenModal()
  }

  render() {
    const {
      isLoading,
      isError,
      bookmarkCollections,
    } = this.props

    if (isError) {
      return <ColumnIndicator type='error' message='Error fetching bookmark collections' />
    }

    const listItems = [{ to: `/${meUsername}/bookmark_collections/bookmarks`, title: 'Bookmarks' }].concat(!!bookmarkCollections ? bookmarkCollections.map((s) => ({
      to: s.get('to'),
      title: s.get('title'),
    })) : [])

    return (
      <Block>
        <div className={[_s.d, _s.px15, _s.py10].join(' ')}>
          <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
            <Text size='extraLarge' weight='bold'>Bookmark Collections</Text>
            <Button
              className={[_s.px10, _s.mlAuto].join(' ')}
              onClick={this.handleOpenModal}
              backgroundColor='tertiary'
              color='tertiary'
              icon='add'
            />
          </div>
        </div>
        <List
          scrollKey='bookmark-collections'
          emptyMessage='You have no bookmark collections'
          items={listItems}
          showLoading={isLoading}
        />
      </Block>
    )
  }

}

const mapStateToProps = (state) => ({
  isError: state.getIn(['bookmark_collections', 'isError']),
  isLoading: state.getIn(['bookmark_collections', 'isLoading']),
  shortcuts: state.getIn(['bookmark_collections', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenModal() {
    dispatch(openModal(MODAL_BOOKMARK_COLLECTION_CREATE))
  },
  onFetchBookmarkCollections() {
    dispatch(fetchBookmarkCollections())
  },
})

BookmarkCollections.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onFetchBookmarkCollections: PropTypes.func.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  bookmarkCollections: ImmutablePropTypes.list,
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkCollections)