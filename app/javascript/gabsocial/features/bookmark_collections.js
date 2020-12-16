import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchBookmarkCollections } from '../actions/bookmarks'
import ColumnIndicator from '../components/column_indicator'
import List from '../components/list'

class BookmarkCollections extends ImmutablePureComponent {

  componentDidMount() {
    this.props.onFetchBookmarkCollections()
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

    const listItems = shortcuts.map((s) => ({
      to: s.get('to'),
      title: s.get('title'),
      image: s.get('image'),
    }))

    return (
      <List
        scrollKey='bookmark-collections'
        emptyMessage='You have no bookmark collections'
        items={listItems}
        showLoading={isLoading}
      />
    )
  }

}

const mapStateToProps = (state) => ({
  isError: state.getIn(['bookmark_collections', 'isError']),
  isLoading: state.getIn(['bookmark_collections', 'isLoading']),
  shortcuts: state.getIn(['bookmark_collections', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchBookmarkCollections() {
    dispatch(fetchBookmarkCollections())
  },
})

BookmarkCollections.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onFetchBookmarkCollections: PropTypes.func.isRequired,
  bookmarkCollections: ImmutablePropTypes.list,
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkCollections)