import React from 'react'
import PropTypes from 'prop-types'
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
  BREAKPOINT_EXTRA_EXTRA_SMALL,
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
import UploadButton from './media_upload_button'
import UploadForm from './upload_form'
import Input from '../../../components/input'
import Text from '../../../components/text'
import Icon from '../../../components/icon'
import ComposeExtraButtonList from './compose_extra_button_list'
import ComposeDestinationHeader from './compose_destination_header'

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: "What's on your mind?" },
  commentPlaceholder: { id: 'compose_form.comment_placeholder', defaultMessage: "Write a comment..." },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Write your warning here' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Publish' },
  publishEdit: { id: 'compose_form.publish_edit', defaultMessage: 'Publish Edit' },
  publishLoud: { id: 'compose_form.publish_loud', defaultMessage: '{publish}' },
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
    this.setState({
      composeFocused: true,
    });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
    }
  }

  handleClick = (e) => {
    if (!this.form) return false;
    if (e.target) {
      if (e.target.classList.contains('react-datepicker__time-list-item')) return false
    }
    if (!this.form.contains(e.target)) {
      this.handleClickOutside();
    }
  }

  handleClickOutside = () => {
    const { shouldCondense, scheduledAt, text, isModalOpen } = this.props;
    const condensed = shouldCondense && !text;
    if (condensed && scheduledAt && !isModalOpen) { //Reset scheduled date if condensing
      this.props.setScheduledAt(null);
    }

    this.setState({
      composeFocused: false,
    });
  }

  handleSubmit = () => {
    // if (this.props.text !== this.autosuggestTextarea.textbox.value) {
    // Something changed the text inside the textarea (e.g. browser extensions like Grammarly)
    // Update the state to match the current text
    // this.props.onChange(this.autosuggestTextarea.textbox.value);
    // }

    // Submit disabled:
    const { isSubmitting, isChangingUpload, isUploading, anyMedia, groupId, autoJoinGroup } = this.props
    const fulltext = [this.props.spoilerText, countableText(this.props.text)].join('');

    if (isSubmitting || isUploading || isChangingUpload || length(fulltext) > MAX_POST_CHARACTER_COUNT || (fulltext.length !== 0 && fulltext.trim().length === 0 && !anyMedia)) {
      return;
    }

    this.props.onSubmit(groupId, this.props.replyToId, this.context.router, autoJoinGroup)
  }

  onSuggestionsClearRequested = () => {
    this.props.onClearSuggestions();
  }

  onSuggestionsFetchRequested = (token) => {
    this.props.onFetchSuggestions(token);
  }

  onSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['text']);
  }

  onSpoilerSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['spoiler_text']);
  }

  handleChangeSpoilerText = (value) => {
    this.props.onChangeSpoilerText(value)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  componentDidUpdate(prevProps) {
    if (!this.autosuggestTextarea) return

    // This statement does several things:
    // - If we're beginning a reply, and,
    //     - Replying to zero or one users, places the cursor at the end of the textbox.
    //     - Replying to more than one user, selects any usernames past the first;
    //       this provides a convenient shortcut to drop everyone else from the conversation.
    if (this.props.focusDate !== prevProps.focusDate) {
      let selectionEnd, selectionStart;

      if (this.props.preselectDate !== prevProps.preselectDate) {
        selectionEnd = this.props.text.length;
        selectionStart = this.props.text.search(/\s/) + 1;
      } else if (typeof this.props.caretPosition === 'number') {
        selectionStart = this.props.caretPosition;
        selectionEnd = this.props.caretPosition;
      } else {
        selectionEnd = this.props.text.length;
        selectionStart = selectionEnd;
      }

      // this.autosuggestTextarea.textbox.setSelectionRange(selectionStart, selectionEnd);
      // this.autosuggestTextarea.textbox.focus();
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
      account,
      onPaste,
      showSearch,
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
      isStandalone,
    } = this.props

    const disabled = isSubmitting
    const text = [this.props.spoilerText, countableText(this.props.text)].join('');
    const disabledButton =  isSubmitting || isUploading || isChangingUpload || length(text) > MAX_POST_CHARACTER_COUNT || (length(text.trim()) === 0 && !anyMedia)
    const shouldAutoFocus = autoFocus && !showSearch && !isMobile(window.innerWidth)

    const parentContainerClasses = CX({
      d: 1,
      w100PC: 1,
      flexRow: !shouldCondense,
      pb10: !shouldCondense,
    })

    const childContainerClasses = CX({
      d: 1,
      flexWrap: 1,
      overflowHidden: 1,
      flex1: 1,
      minH28PX: 1,
      py2: shouldCondense,
      aiEnd: shouldCondense,
      flexRow: shouldCondense,
      radiusSmall: shouldCondense,
      bgSubtle: shouldCondense,
      px5: shouldCondense,
    })

    const actionsContainerClasses = CX({
      d: 1,
      flexRow: 1,
      aiCenter: !shouldCondense,
      aiStart: shouldCondense,
      mt10: !shouldCondense,
      px10: !shouldCondense,
      mlAuto: shouldCondense,
      flexWrap: !shouldCondense,
    })

    const commentPublishBtnClasses = CX({
      d: 1,
      jcCenter: 1,
      displayNone: length(this.props.text) === 0,
    })

    if (shouldCondense) {
      return (
        <div className={[_s.d, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.flexRow, _s.w100PC].join(' ')}>
            <div className={[_s.d, _s.mr10].join(' ')}>
              <Avatar account={account} size={28} noHover />
            </div>

            <div
              className={[_s.d, _s.flexWrap, _s.overflowHidden, _s.flex1, _s.minH28PX, _s.py2, _s.aiEnd, _s.flexRow, _s.radiusSmall, _s.bgSubtle, _s.px5].join(' ')}
              ref={this.setForm}
              onClick={this.handleClick}
            >

              <AutosuggestTextbox
                ref={(isModalOpen && shouldCondense) ? null : this.setAutosuggestTextarea}
                placeholder={intl.formatMessage(messages.commentPlaceholder)}
                disabled={disabled}
                value={this.props.text}
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
                isPro={isPro}
                isEdit={!!edit}
                id='comment-composer'
              />

              <div className={[_s.d, _s.flexRow, _s.aiStart, _s.mlAuto].join(' ')}>
                <div className={[_s.d, _s.flexRow, _s.mrAuto].join(' ')}>
                  <div className={commentPublishBtnClasses}>
                    <Button
                      isNarrow
                      onClick={this.handleSubmit}
                      isDisabled={disabledButton}
                      className={_s.px10}
                    >
                      {intl.formatMessage(scheduledAt ? messages.schedulePost : messages.publish)}
                    </Button>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {
            (isUploading || anyMedia) &&
            <div className={[_s.d, _s.w100PC, _s.pl35, _s.mt5].join(' ')}>
              <UploadForm replyToId={replyToId} isModalOpen={isModalOpen} />
            </div>
          }
        </div>
      )
    }

    if (isModalOpen) {
      //
    }

    if (isStandalone || isModalOpen) {
      return (
        <div className={[_s.d, _s.w100PC, _s.flexGrow1, _s.bgTertiary].join(' ')}>
          
          <div className={[_s.d, _s.calcMaxH370PX, _s.overflowYScroll, _s.boxShadowBlock, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            <ComposeDestinationHeader account={account} />

            <div
              className={[_s.d, _s.bgPrimary, _s.boxShadowBlock, _s.w100PC, _s.minH200PX, _s.pb10, _s.borderBottom1PX, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}
              ref={this.setForm}
              onClick={this.handleClick}
            >

              {
                !!reduxReplyToId && isModalOpen && isMatch &&
                <div className={[_s.d, _s.px15, _s.py10, _s.mt5].join(' ')}>
                  <StatusContainer
                    contextType='compose'
                    id={reduxReplyToId}
                    isChild
                  />
                </div>
              }

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
                isPro={isPro}
                isEdit={!!edit}
                id='main-composer'
              />

              {
                (isUploading || anyMedia) &&
                <div className={[_s.d, _s.px15, _s.mt5].join(' ')}>
                  <UploadForm
                    replyToId={replyToId}
                    isModalOpen={isModalOpen}
                  />
                </div>
              }

              {
                !edit && hasPoll &&
                <div className={[_s.d, _s.px15, _s.mt5].join(' ')}>
                  <PollForm replyToId={replyToId} />
                </div>
              }

              {
                !!quoteOfId && isModalOpen && isMatch &&
                <div className={[_s.d, _s.px15, _s.py10, _s.mt5].join(' ')}>
                  <StatusContainer
                    contextType='compose'
                    id={quoteOfId}
                    isChild
                  />
                </div>
              }

            </div>
          </div>

         <div className={[_s.d, _s.w100PC, _s.pt10, _s.px10].join(' ')}>
            <Button
              isBlock
              isDisabled={disabledButton}
              backgroundColor={disabledButton ? 'secondary' : 'brand'}
              color={disabledButton ? 'tertiary' : 'white'}
              className={[_s.fs15PX, _s.px15, _s.flexGrow1, _s.mlAuto].join(' ')}
              onClick={this.handleSubmit}
            >
              <Text color='inherit' weight='medium' align='center'>
                {intl.formatMessage(scheduledAt ? messages.schedulePost : edit ? messages.publishEdit : messages.publish)}
              </Text>
            </Button>
          </div>
            
          <ComposeExtraButtonList isMatch={isMatch} hidePro={hidePro} edit={edit} />
        </div>
      )
    }

    return (
      <div
        className={[_s.d, _s.w100PC, _s.pb10, _s.flexWrap, _s.overflowHidden, _s.flex1].join(' ')}
        ref={this.setForm}
        onClick={this.handleClick}
      >
        <Text className={[_s.d, _s.px15, _s.pt15, _s.pb10].join(' ')} size='medium' color='tertiary'>
          {intl.formatMessage((shouldCondense || !!reduxReplyToId) && isMatch ? messages.commentPlaceholder : messages.placeholder)}
        </Text>

        <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.mt5, _s.px10, _s.flexWrap].join(' ')}>
          <UploadButton />
          <EmojiPickerButton isMatch={isMatch} />
          <Responsive min={BREAKPOINT_EXTRA_EXTRA_SMALL}>
            <PollButton />
          </Responsive>
          <Button
            isOutline
            isDisabled={disabledButton}
            backgroundColor='none'
            color='brand'
            className={[_s.fs15PX, _s.px15, _s.flexGrow1, _s.maxW212PX, _s.mlAuto].join(' ')}
            onClick={this.handleSubmit}
          >
            <Text color='inherit' weight='medium' align='center'>
              {intl.formatMessage(scheduledAt ? messages.schedulePost : edit ? messages.publishEdit : messages.publish)}
            </Text>
          </Button>
        </div>
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
  showSearch: PropTypes.bool,
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
  isStandalone: PropTypes.bool,
}

ComposeForm.defaultProps = {
  showSearch: false,
}

export default injectIntl(ComposeForm)