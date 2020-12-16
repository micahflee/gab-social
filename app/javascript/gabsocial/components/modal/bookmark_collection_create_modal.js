import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import BookmarkCollectionCreate from '../../features/bookmark_collection_create'

class BookmarkCollectionCreateModal extends React.PureComponent {

  render() {
    const { onClose } = this.props

    return (
      <ModalLayout
        title='Create Bookmark Collection'
        width={500}
        onClose={onClose}
      >
        <BookmarkCollectionCreate isModal />
      </ModalLayout>
    )
  }

}

BookmarkCollectionCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default BookmarkCollectionCreateModal