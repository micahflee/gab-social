import { List as ImmutableList } from 'immutable'
import ComposeForm from '../components/compose_form'
import {
  changeCompose,
  submitCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  changeComposeSpoilerText,
  insertEmojiCompose,
  uploadCompose,
  changeScheduledAt,
} from '../../../actions/compose'
import { me } from '../../../initial_state'

const mapStateToProps = (state, { replyToId }) => {

  const reduxReplyToId = state.getIn(['compose', 'in_reply_to'])
  const isMatch = reduxReplyToId || replyToId ? reduxReplyToId === replyToId : true

  // console.log("isMatch:", isMatch, reduxReplyToId, replyToId)

  return {
    isMatch,
    edit: !isMatch ? null : state.getIn(['compose', 'id']) !== null,
    text: !isMatch ? '' : state.getIn(['compose', 'text']),
    suggestions: !isMatch ? ImmutableList() : state.getIn(['compose', 'suggestions']),
    spoiler: !isMatch ? false : state.getIn(['compose', 'spoiler']),
    spoilerText: !isMatch ? '' : state.getIn(['compose', 'spoiler_text']),
    privacy: !isMatch ? null : state.getIn(['compose', 'privacy']),
    focusDate: !isMatch ? null : state.getIn(['compose', 'focusDate']),
    caretPosition: !isMatch ? null : state.getIn(['compose', 'caretPosition']),
    preselectDate: !isMatch ? null : state.getIn(['compose', 'preselectDate']),
    isSubmitting: !isMatch ? false : state.getIn(['compose', 'is_submitting']),
    isChangingUpload: !isMatch ? false : state.getIn(['compose', 'is_changing_upload']),
    isUploading: !isMatch ? false : state.getIn(['compose', 'is_uploading']),
    showSearch: !isMatch ? false : state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
    anyMedia: !isMatch ? false : state.getIn(['compose', 'media_attachments']).size > 0,
    isModalOpen: !isMatch ? false : state.getIn(['modal', 'modalType']) === 'COMPOSE',
    quoteOfId: !isMatch ? null : state.getIn(['compose', 'quote_of_id']),
    scheduledAt: !isMatch ? null : state.getIn(['compose', 'scheduled_at']),
    account: state.getIn(['accounts', me]),
    hasPoll: !isMatch ? false : state.getIn(['compose', 'poll']),
  }
}

const mapDispatchToProps = (dispatch) => ({

  onChange(text, markdown) {
    dispatch(changeCompose(text, markdown))
  },

  onSubmit(router, group) {
    dispatch(submitCompose(router, group))
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

  onPickEmoji(position, data, needsSpace) {
    dispatch(insertEmojiCompose(position, data, needsSpace))
  },

  setScheduledAt(date) {
    dispatch(changeScheduledAt(date))
  },
})

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    ...stateProps,
    ...dispatchProps,
  })
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComposeForm)
