import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import BookmarkCollectionEdit from '../../features/bookmark_collection_edit'

class BookmarkCollectionEditModal extends React.PureComponent {

  render() {
    const { onClose } = this.props

    return (
      <ModalLayout
        title='Edit Bookmark Collection'
        width={500}
        onClose={onClose}
      >
        <BookmarkCollectionEdit isModal />
      </ModalLayout>
    )
  }

}

BookmarkCollectionEditModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default BookmarkCollectionEditModal