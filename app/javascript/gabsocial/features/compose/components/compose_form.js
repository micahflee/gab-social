import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { length } from 'stringz'
import { isMobile } from '../../../utils/is_mobile'
import { countableText } from '../../ui/util/counter'
import {
  CX,
  MAX_POST_CHARACTER_COUNT,
  ALLOWED_AROUND_SHORT_CODE,
  BREAKPOINT_EXTRA_SMALL,
  BREAKPOINT_MEDIUM,
} from '../../../constants'
import AutosuggestTextbox from '../../../components/autosuggest_textbox'
import Responsive from '../../ui/util/responsive_component'
import ResponsiveClassesComponent from '../../ui/util/responsive_classes_component'
import Avatar from '../../../components/avatar'
import Button from '../../../components/button'
import EmojiPickerButton from './emoji_picker_button'
import PollButton from './poll_button'
import PollForm from './poll_form'
import SchedulePostButton from './schedule_post_button'
import SpoilerButton from './spoiler_button'
import ExpiresPostButton from './expires_post_button'
import RichTextEditorButton from './rich_text_editor_button'
import StatusContainer from '../../../containers/status_container'
import StatusVisibilityButton from './status_visibility_button'
import MoreButton from './more_button'
import UploadButton from './media_upload_button'
import UploadForm from './upload_form'
import Input from '../../../components/input'
import Text from '../../../components/text'
import Icon from '../../../components/icon'
import ComposeExtraButtonList from './compose_extra_button_list'
import ComposeDestinationHeader from './compose_destination_header'
import ComposeFormSubmitButton from './compose_form_submit_button'

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: "What's on your mind?" },
  commentPlaceholder: { id: 'compose_form.comment_placeholder', defaultMessage: "Write a comment..." },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Write your warning here' },
  post: { id: 'compose_form.post', defaultMessage: 'Post' },
  postEdit: { id: 'compose_form.post_edit', defaultMessage: 'Post Edit' },
  schedulePost: { id: 'compose_form.schedule_post', defaultMessage: 'Schedule Post' },
})

class ComposeForm extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    composeFocused: false,
  }

  handleChange = (e, selectionStart) => {
    this.props.onChange(e.target.value, e.target.markdown, this.props.replyToId, selectionStart)
  }

  handleComposeFocus = () => {
    this.setState({ composeFocused: true })
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit()
    }
  }

  handleClick = (e) => {
    const { isModalOpen, shouldCondense } = this.props

    if (!this.form) return false
    if (e.target) {
      if (e.target.classList.contains('react-datepicker__time-list-item')) return false
    }
    if (!this.form.contains(e.target)) {
      this.handleClickOutside()
    }
  }

  handleClickOutside = () => {
    const { shouldCondense, scheduledAt, text, isModalOpen } = this.props
    const condensed = shouldCondense && !text

    if (condensed && scheduledAt && !isModalOpen) { //Reset scheduled date if condensing
      this.props.setScheduledAt(null)
    }

    this.setState({ composeFocused: false })
  }

  handleSubmit = () => {
    // if (this.props.text !== this.autosuggestTextarea.textbox.value) {
    // Something changed the text inside the textarea (e.g. browser extensions like Grammarly)
    // Update the state to match the current text
    // this.props.onChange(this.autosuggestTextarea.textbox.value)
    // }

    // Submit disabled:
    const { isSubmitting, formLocation, isChangingUpload, isUploading, anyMedia, groupId, autoJoinGroup } = this.props
    const fulltext = [this.props.spoilerText, countableText(this.props.text)].join('')
    const isStandalone = formLocation === 'standalone'

    if (isSubmitting || isUploading || isChangingUpload || length(fulltext) > MAX_POST_CHARACTER_COUNT || (fulltext.length !== 0 && fulltext.trim().length === 0 && !anyMedia)) {
      return
    }

    this.props.onSubmit({
      router: this.context.router,
      isStandalone,
      autoJoinGroup,
    })
  }

  onSuggestionsClearRequested = () => {
    this.props.onClearSuggestions()
  }

  onSuggestionsFetchRequested = (token) => {
    this.props.onFetchSuggestions(token)
  }

  onSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['text'])
  }

  onSpoilerSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['spoiler_text'])
  }

  handleChangeSpoilerText = (value) => {
    this.props.onChangeSpoilerText(value)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false)

    const { groupId } = this.props
    if (groupId) {
      this.props.onChangeComposeGroupId(groupId)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }

  componentDidUpdate(prevProps) {
    // This statement does several things:
    // - If we're beginning a reply, and,
    //     - Replying to zero or one users, places the cursor at the end of the textbox.
    //     - Replying to more than one user, selects any usernames past the first
    //       this provides a convenient shortcut to drop everyone else from the conversation.
    if (this.props.focusDate !== prevProps.focusDate) {
      let selectionEnd, selectionStart

      if (this.props.preselectDate !== prevProps.preselectDate) {
        selectionEnd = this.props.text.length
        selectionStart = this.props.text.search(/\s/) + 1
      } else if (typeof this.props.caretPosition === 'number') {
        selectionStart = this.props.caretPosition
        selectionEnd = this.props.caretPosition
      } else {
        selectionEnd = this.props.text.length
        selectionStart = selectionEnd
      }

      // this.autosuggestTextarea.textbox.setSelectionRange(selectionStart, selectionEnd)
      // this.autosuggestTextarea.textbox.focus()
    }
  }

  setAutosuggestTextarea = (c) => {
    this.autosuggestTextarea = c
  }

  setForm = (c) => {
    this.form = c
  }

  render() {
    const {
      intl,
      autoJoinGroup,
      account,
      onPaste,
      anyMedia,
      shouldCondense,
      autoFocus,
      isModalOpen,
      quoteOfId,
      edit,
      scheduledAt,
      spoiler,
      replyToId,
      reduxReplyToId,
      hasPoll,
      isUploading,
      isMatch,
      isChangingUpload,
      isSubmitting,
      isPro,
      hidePro,
      dontOpenModal,
      formLocation,
    } = this.props

    const disabled = isSubmitting
    const text = [this.props.spoilerText, countableText(this.props.text)].join('')
    const disabledButton =  isSubmitting || isUploading || isChangingUpload || length(text) > MAX_POST_CHARACTER_COUNT || (length(text.trim()) === 0 && !anyMedia)
    const shouldAutoFocus = autoFocus && !isMobile(window.innerWidth)

    const textbox = (
      <AutosuggestTextbox
        ref={(isModalOpen && shouldCondense) ? null : this.setAutosuggestTextarea}
        placeholder={intl.formatMessage((shouldCondense || !!reduxReplyToId) && isMatch ? messages.commentPlaceholder : messages.placeholder)}
        disabled={disabled}
        value={this.props.text}
        valueMarkdown={this.props.markdown}
        onChange={this.handleChange}
        suggestions={this.props.suggestions}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleComposeFocus}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        onPaste={onPaste}
        autoFocus={shouldAutoFocus}
        small={shouldCondense}
        isModalOpen={isModalOpen}
        isPro={isPro}
        isEdit={!!edit}
        id='main-composer'
      />
    )

    if (shouldCondense) {
      return (
        <div className={[_s.d, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.flexRow, _s.w100PC, _s.aiCenter].join(' ')}>
            <div className={[_s.d, _s.mr10].join(' ')}>
              <Avatar account={account} size={30} noHover />
            </div>
            <div
              className={[_s.d, _s.flexWrap, _s.overflowHidden, _s.flex1, _s.minH28PX, _s.py5, _s.aiEnd, _s.flexRow, _s.radiusSmall, _s.bgSubtle, _s.px5].join(' ')}
              ref={this.setForm}
              onClick={this.handleClick}
            >
              { textbox }
              { isMatch && <ComposeFormSubmitButton type='comment' /> }
            </div>
          </div>

          {
            (isUploading || anyMedia) && isMatch &&
            <div className={[_s.d, _s.w100PC, _s.pl35, _s.mt5].join(' ')}>
              <UploadForm isModalOpen={isModalOpen} />
            </div>
          }
        </div>
      )
    }

    const containerClasses = CX({
      d: 1,
      pb10: 1,
      calcMaxH410PX: 1,
      mb10: 1,
      minH200PX: isModalOpen && isMatch,
      overflowYScroll: 1,
      flex1: 1,
      boxShadowBlock: length(text) > 64,
      borderTop1PX: 1,
      borderColorSecondary: 1,
    })

    const innerClasses = CX({
      d: 1,
      calcMaxH410PX: 1,
      minH98PX: formLocation === 'timeline',
      minH200PX: ['standalone', 'modal'].indexOf(formLocation) > -1,
    })

    return (
      <div className={[_s.d, _s.w100PC, _s.flexGrow1, _s.bgPrimary].join(' ')}>
        <div className={innerClasses}>

          <ComposeDestinationHeader formLocation={formLocation} account={account} isModal={isModalOpen} />

          <div className={containerClasses} ref={this.setForm} onClick={this.handleClick}>

            {
              !!spoiler &&
              <div className={[_s.d, _s.px15, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
                <Input
                  placeholder={intl.formatMessage(messages.spoiler_placeholder)}
                  value={this.props.spoilerText}
                  onChange={this.handleChangeSpoilerText}
                  disabled={!this.props.spoiler}
                  prependIcon='warning'
                  maxLength={256}
                  id='cw-spoiler-input'
                />
              </div>
            }

            { textbox }

            {
              (isUploading || anyMedia) &&
              <div className={[_s.d, _s.px15, _s.mt5].join(' ')}>
                <div className={[_s.d, _s.borderTop1PX, _s.borderColorSecondary].join(' ')} />
                <UploadForm />
              </div>
            }

            {
              !edit && hasPoll &&
              <div className={[_s.d, _s.px15, _s.mt5].join(' ')}>
                <PollForm />
              </div>
            }

            {
              !!reduxReplyToId && isModalOpen && isMatch &&
              <div className={[_s.d, _s.px15, _s.py10, _s.mt5].join(' ')}>
                <StatusContainer contextType='compose' id={reduxReplyToId} isChild />
              </div>
            }
            
            {
              !!quoteOfId && isModalOpen && isMatch &&
              <div className={[_s.d, _s.px15, _s.py10, _s.mt5].join(' ')}>
                <StatusContainer contextType='compose' id={quoteOfId} isChild />
              </div>
            }
          </div>
        </div>
        
        <div className={[_s.d, _s.px10].join(' ')}>
          <ComposeExtraButtonList formLocation={formLocation} isMatch={isMatch} hidePro={hidePro} edit={edit} isModal={isModalOpen} />
        </div>

        {
          (!disabledButton || isModalOpen) && isMatch &&
          <div className={[_s.d, _s.mb10, _s.px10].join(' ')}>
            <ComposeFormSubmitButton
              type='block'
              formLocation={formLocation}
              autoJoinGroup={autoJoinGroup}
              router={this.context.router}
            />
          </div>
        }

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          {
            formLocation === 'timeline' &&
            <NavLink to='/compose' className={[_s.d, _s.z4, _s.posAbs, _s.top0, _s.left0, _s.right0, _s.bottom0].join(' ')} />
          }
        </Responsive>
      </div>
    )
  }

}

ComposeForm.propTypes = {
  intl: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  isMatch: PropTypes.bool,
  text: PropTypes.string.isRequired,
  markdown: PropTypes.string,
  suggestions: ImmutablePropTypes.list,
  account: ImmutablePropTypes.map.isRequired,
  status: ImmutablePropTypes.map,
  spoiler: PropTypes.bool,
  privacy: PropTypes.string,
  spoilerText: PropTypes.string,
  focusDate: PropTypes.instanceOf(Date),
  caretPosition: PropTypes.number,
  preselectDate: PropTypes.instanceOf(Date),
  isSubmitting: PropTypes.bool,
  isChangingUpload: PropTypes.bool,
  isUploading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClearSuggestions: PropTypes.func.isRequired,
  onFetchSuggestions: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
  onChangeSpoilerText: PropTypes.func.isRequired,
  onPaste: PropTypes.func.isRequired,
  anyMedia: PropTypes.bool,
  shouldCondense: PropTypes.bool,
  autoFocus: PropTypes.bool,
  groupId: PropTypes.string,
  isModalOpen: PropTypes.bool,
  scheduledAt: PropTypes.instanceOf(Date),
  setScheduledAt: PropTypes.func.isRequired,
  replyToId: PropTypes.string,
  reduxReplyToId: PropTypes.string,
  hasPoll: PropTypes.bool,
  isPro: PropTypes.bool,
  hidePro: PropTypes.bool,
  autoJoinGroup: PropTypes.bool,
  formLocation: PropTypes.string,
}

export default injectIntl(ComposeForm)