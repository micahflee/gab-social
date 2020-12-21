import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import AlbumCreate from '../../features/album_create'

class AlbumCreateModal extends React.PureComponent {

  render() {
    const { onClose } = this.props

    return (
      <ModalLayout
        title='Create Album'
        width={500}
        onClose={onClose}
      >
        <AlbumCreate isModal />
      </ModalLayout>
    )
  }

}

AlbumCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default AlbumCreateModal