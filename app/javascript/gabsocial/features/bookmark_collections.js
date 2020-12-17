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
      isMyAccount,
      isLoading,
      isError,
      bookmarkCollections,
    } = this.props

    if (!isMyAccount) {
      return <ColumnIndicator type='missing' />
    }

    if (isError) {
      return <ColumnIndicator type='error' message='Error fetching bookmark collections' />
    }

    console.log("bookmarkCollections:", bookmarkCollections)

    let listItems = !!bookmarkCollections ? bookmarkCollections.map((b) => ({
      to: `/${meUsername}/bookmark_collections/${b.get('id')}`,
      title: b.get('title'),
    })) : []
    listItems = listItems.unshift({
      to: `/${meUsername}/bookmark_collections/saved`,
      title: 'Bookmarks',
    })

    console.log("listItems:", listItems)

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

const mapStateToProps = (state, { params: { username } }) => ({
  isMyAccount: (username.toLowerCase() === meUsername.toLowerCase()),
  isError: state.getIn(['bookmark_collections', 'isError']),
  isLoading: state.getIn(['bookmark_collections', 'isLoading']),
  bookmarkCollections: state.getIn(['bookmark_collections', 'items']),
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