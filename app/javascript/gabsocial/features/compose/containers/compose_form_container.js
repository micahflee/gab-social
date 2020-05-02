import { List as ImmutableList } from 'immutable'
import ComposeForm from '../components/compose_form'
import {
  changeCompose,
  submitCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  changeComposeSpoilerText,
  uploadCompose,
  changeScheduledAt,
} from '../../../actions/compose'
import { me } from '../../../initial_state'

const mapStateToProps = (state, { replyToId }) => {

  const reduxReplyToId = state.getIn(['compose', 'in_reply_to'])
  const isMatch = reduxReplyToId || replyToId ? reduxReplyToId === replyToId : true

  if (!isMatch) {
    return {
      isMatch,
      edit: null,
      text: '',
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
      isModalOpen: false,
      quoteOfId: null,
      scheduledAt: null,
      account: state.getIn(['accounts', me]),
      hasPoll: false,
      selectedGifSrc: null,
      reduxReplyToId
    }
  }

  // console.log("isMatch:", isMatch, reduxReplyToId, replyToId, state.getIn(['compose', 'text']))

  return {
    isMatch,
    edit: state.getIn(['compose', 'id']) !== null,
    text: state.getIn(['compose', 'text']),
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
    isModalOpen: state.getIn(['modal', 'modalType']) === 'COMPOSE',
    quoteOfId: state.getIn(['compose', 'quote_of_id']),
    scheduledAt: state.getIn(['compose', 'scheduled_at']),
    account: state.getIn(['accounts', me]),
    hasPoll: state.getIn(['compose', 'poll']),
    selectedGifSrc: state.getIn(['tenor', 'selectedGif', 'src']),
    reduxReplyToId,
  }
}

const mapDispatchToProps = (dispatch, { reduxReplyToId, replyToId }) => ({

  onChange(text, markdown, newReplyToId) {
    console.log("text:", text, newReplyToId, replyToId, reduxReplyToId)
    dispatch(changeCompose(text, markdown, newReplyToId))
  },

  onSubmit(group, replyToId) {
    dispatch(submitCompose(group, replyToId))
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
})

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    ...stateProps,
    ...dispatchProps,
  })
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComposeForm)
