import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import {
  updateBookmarkCollection,
  removeBookmarkCollection,
} from '../actions/bookmarks'
import { closeModal } from '../actions/modal'
import Button from '../components/button'
import Input from '../components/input'
import Form from '../components/form'
import Text from '../components/text'

class BookmarkCollectionEdit extends React.PureComponent {

  state = {
    value: '',
  }

  componentDidMount() {
    if (!this.props.bookmarkCollection) {
      this.props.onFetchBookmarkCollection(this.props.bookmarkCollectionId)
    }
  }

  onChange = (value) => {
    this.setState({ value })
  }

  handleOnSubmit = () => {
    this.props.onSubmit(this.state.value)
  }

  handleOnRemove = () => {
    this.props.onRemove()
  }

  render() {
    const { value } = this.state

    const isDisabled = !value

    return (
      <Form>
        <Input
          title='Title'
          placeholder='Bookmark collection title'
          value={value}
          onChange={this.onChange}
        />

        <Button
          isDisabled={isDisabled}
          onClick={this.handleOnSubmit}
          className={[_s.mt10].join(' ')}
        >
          <Text color='inherit' align='center'>
            Update
          </Text>
        </Button>

        <Button
          backgroundColor='danger'
          color='white'
          onClick={this.handleOnRemove}
          className={[_s.mt10].join(' ')}
        >
          <Text color='inherit' align='center'>
            Update
          </Text>
        </Button>
      </Form>
    )
  }

}

const mapStateToProps = (state, { bookmarkCollectionId }) => ({
  bookmarkCollection: state.getIn(['bookmark_collections', bookmarkCollectionId]),
})

const mapDispatchToProps = (dispatch, { isModal, bookmarkCollectionId }) => ({
  onSubmit(title) {
    if (isModal) dispatch(closeModal())
    dispatch(updateBookmarkCollection(title))
  },
  onRemove() {
    if (isModal) dispatch(closeModal())
    dispatch(removeBookmarkCollection(bookmarkCollectionId))
  },
})

BookmarkCollectionEdit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkCollectionEdit)