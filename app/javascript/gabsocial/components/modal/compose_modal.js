import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'
import ModalLayout from './modal_layout'
import TimelineComposeBlock from '../timeline_compose_block'

class ComposeModal extends ImmutablePureComponent {

  onClickClose = () => {
    const {
      composeText,
      dispatch,
      onClose,
      intl,
    } = this.props

    if (composeText) {
      dispatch(openModal('CONFIRM', {
        title: <FormattedMessage id='discard-gab-title' defaultMessage='Discard gab?' />,
        message: <FormattedMessage id='discard-gab-message' defaultMessage="This can't be undone and you'll lose your draft." />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => dispatch(cancelReplyCompose()),
        onCancel: () => dispatch(openModal('COMPOSE')),
      }))
    }
    else {
      onClose('COMPOSE')
    }
  }

  render() {
    const {
      intl,
      isEditing,
      isComment,
    } = this.props

    const title = isEditing ? messages.edit : isComment ? messages.comment : messages.title

    return (
      <ModalLayout
        noPadding
        title={intl.formatMessage(title)}
        onClose={this.onClickClose}
      >
        <TimelineComposeBlock modal />
      </ModalLayout>
    )
  }
}

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  title: { id: 'navigation_bar.compose', defaultMessage: 'Compose new gab' },
  comment: { id: 'navigation_bar.compose_comment', defaultMessage: 'Compose new comment' },
  edit: { id: 'navigation_bar.edit_gab', defaultMessage: 'Edit' },
})

const mapStateToProps = (state) => {
  const status = state.getIn(['statuses', state.getIn(['compose', 'id'])])

  return {
    composeText: state.getIn(['compose', 'text']),
    isEditing: !!status,
    isComment: !!state.getIn(['compose', 'in_reply_to']),
  }
}

ComposeModal.propTypes = {
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  composeText: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  isComment: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps)(ComposeModal))