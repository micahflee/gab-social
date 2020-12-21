import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List as ImmutableList } from 'immutable'
import ComposeForm from '../components/compose_form'
import {
  changeCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  changeComposeSpoilerText,
  uploadCompose,
  changeScheduledAt,
  changeComposeGroupId,
} from '../../../actions/compose'
import { openModal } from '../../../actions/modal'
import { MODAL_COMPOSE } from '../../../constants'
import { me } from '../../../initial_state'

const mapStateToProps = (state, props) => {
  const {
    replyToId,
    formLocation,
    shouldCondense,
    isModal,
  } = props

  const isStandalone = formLocation === 'standalone'
  const reduxReplyToId = state.getIn(['compose', 'in_reply_to'])
  const isModalOpen = state.getIn(['modal', 'modalType']) === 'COMPOSE' || isStandalone
  let isMatch;

  if (!!reduxReplyToId && !!replyToId && replyToId === reduxReplyToId) {
    isMatch = true
  } else if (!reduxReplyToId && !replyToId) {
    isMatch = true
  } else {
    isMatch = false
  }

  if (isModalOpen) isMatch = true
  if (isModalOpen && shouldCondense) isMatch = false
  if (isModalOpen && (!isModal && !isStandalone)) isMatch = false
  
  if (!isMatch) {
    return {
      isStandalone,
      isMatch,
      isModalOpen,
      reduxReplyToId,
      edit: null,
      text: '',
      markdown: null,
      suggestions: ImmutableList(),
      spoiler: false,
      spoilerText: '',
      privacy: null,
      focusDate: null,
      caretPosition: null,
      preselectDate: null,
      isSubmitting: false,
      isChangingUpload: false,
      isUploading: false,
      showSearch: false,
      anyMedia: false,
      quoteOfId: null,
      scheduledAt: null,
      account: state.getIn(['accounts', me]),
      hasPoll: false,
    }
  }
  
  return {
    isMatch,
    isModalOpen,
    reduxReplyToId,
    isStandalone,
    edit: state.getIn(['compose', 'id']) !== null,
    text: state.getIn(['compose', 'text']),
    markdown: state.getIn(['compose', 'markdown']),
    suggestions: state.getIn(['compose', 'suggestions']),
    spoiler: state.getIn(['compose', 'spoiler']),
    spoilerText: state.getIn(['compose', 'spoiler_text']),
    privacy: state.getIn(['compose', 'privacy']),
    focusDate: state.getIn(['compose', 'focusDate']),
    caretPosition: state.getIn(['compose', 'caretPosition']),
    preselectDate: state.getIn(['compose', 'preselectDate']),
    isSubmitting: state.getIn(['compose', 'is_submitting']),
    isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
    isUploading: state.getIn(['compose', 'is_uploading']),
    showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
    anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
    quoteOfId: state.getIn(['compose', 'quote_of_id']),
    scheduledAt: state.getIn(['compose', 'scheduled_at']),
    account: state.getIn(['accounts', me]),
    isPro: state.getIn(['accounts', me, 'is_pro']),
    hasPoll: state.getIn(['compose', 'poll']),
  }
}

const mapDispatchToProps = (dispatch, { formLocation }) => ({

  onChange(text, markdown, newReplyToId, position) {
    const isStandalone = formLocation === 'standalone'
    dispatch(changeCompose(text, markdown, newReplyToId, isStandalone, position))
  },

  onClearSuggestions() {
    dispatch(clearComposeSuggestions())
  },

  onFetchSuggestions(token) {
    dispatch(fetchComposeSuggestions(token))
  },

  onSuggestionSelected(position, token, suggestion, path) {
    dispatch(selectComposeSuggestion(position, token, suggestion, path))
  },

  onChangeSpoilerText(checked) {
    dispatch(changeComposeSpoilerText(checked))
  },

  onPaste(files) {
    dispatch(uploadCompose(files))
  },

  setScheduledAt(date) {
    dispatch(changeScheduledAt(date))
  },

  openComposeModal() {
    dispatch(openModal(MODAL_COMPOSE))
  },

  onChangeComposeGroupId(groupId) {
    dispatch(changeComposeGroupId(groupId))
  }
})

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    ...stateProps,
    ...dispatchProps,
  })
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComposeForm)
