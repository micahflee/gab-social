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
} from '../../../constants'
import AutosuggestTextbox from '../../../components/autosuggest_textbox'
import Responsive from '../../ui/util/responsive_component'
import ResponsiveClassesComponent from '../../ui/util/responsive_classes_component'
import Avatar from '../../../components/avatar'
import Button from '../../../components/button'
import CharacterCounter from '../../../components/character_counter'
import EmojiPickerButton from './emoji_picker_button'
import PollButton from './poll_button'
import PollForm from './poll_form'
import SchedulePostButton from './schedule_post_button'
import SpoilerButton from './spoiler_button'
import StatusContainer from '../../../containers/status_container'
import StatusVisibilityButton from './status_visibility_button'
import UploadButton from './media_upload_button'
import UploadForm from './upload_form'
import Input from '../../../components/input'

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: "What's on your mind?" },
  commentPlaceholder: { id: 'compose_form.comment_placeholder', defaultMessage: "Write a comment..." },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Write your warning here' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Publish' },
  publishEdit: { id: 'compose_form.publish_edit', defaultMessage: 'Publish Edit' },
  publishLoud: { id: 'compose_form.publish_loud', defaultMessage: '{publish}' },
  schedulePost: { id: 'compose_form.schedule_post', defaultMessage: 'Schedule Post' },
})

export default
@injectIntl
class ComposeForm extends ImmutablePureComponent {

  state = {
    composeFocused: false,
  }

  static propTypes = {
    intl: PropTypes.object.isRequired,
    edit: PropTypes.bool,
    isMatch: PropTypes.bool,
    text: PropTypes.string.isRequired,
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
    onPickEmoji: PropTypes.func.isRequired,
    showSearch: PropTypes.bool,
    anyMedia: PropTypes.bool,
    shouldCondense: PropTypes.bool,
    autoFocus: PropTypes.bool,
    group: ImmutablePropTypes.map,
    isModalOpen: PropTypes.bool,
    scheduledAt: PropTypes.instanceOf(Date),
    setScheduledAt: PropTypes.func.isRequired,
    replyToId: PropTypes.string,
    reduxReplyToId: PropTypes.string,
    hasPoll: PropTypes.bool,
    selectedGifSrc: PropTypes.string,
  };

  static defaultProps = {
    showSearch: false,
  };

  handleChange = (e, markdown) => {
    this.props.onChange(e.target.value, markdown, this.props.replyToId)
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
    //   // Something changed the text inside the textarea (e.g. browser extensions like Grammarly)
    //   // Update the state to match the current text
    //   this.props.onChange(this.autosuggestTextarea.textbox.value);
    // }

    // Submit disabled:
    const { isSubmitting, isChangingUpload, isUploading, anyMedia } = this.props;
    const fulltext = [this.props.spoilerText, countableText(this.props.text)].join('');

    if (isSubmitting || isUploading || isChangingUpload || length(fulltext) > MAX_POST_CHARACTER_COUNT || (fulltext.length !== 0 && fulltext.trim().length === 0 && !anyMedia)) {
      return;
    }

    this.props.onSubmit(this.props.group, this.props.replyToId);
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

  handleEmojiPick = (data) => {
    const { text } = this.props
    const position = this.autosuggestTextarea.textbox.selectionStart
    const needsSpace = data.custom && position > 0 && !ALLOWED_AROUND_SHORT_CODE.includes(text[position - 1])

    this.props.onPickEmoji(position, data, needsSpace)
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
      selectedGifSrc,
    } = this.props
    const disabled = isSubmitting
    const text = [this.props.spoilerText, countableText(this.props.text)].join('');
    const disabledButton = disabled || isUploading || isChangingUpload || length(text) > MAX_POST_CHARACTER_COUNT || (length(text) !== 0 && length(text.trim()) === 0 && !anyMedia);
    const shouldAutoFocus = autoFocus && !showSearch && !isMobile(window.innerWidth)

    const parentContainerClasses = CX({
      default: 1,
      width100PC: 1,
      flexRow: !shouldCondense,
      pb10: !shouldCondense,
    })

    const childContainerClasses = CX({
      default: 1,
      flexWrap: 1,
      overflowHidden: 1,
      flex1: 1,
      heightMin28PX: 1,
      py2: shouldCondense,
      alignItemsEnd: shouldCondense,
      flexRow: shouldCondense,
      radiusSmall: shouldCondense,
      bgSubtle: shouldCondense,
      px5: shouldCondense,
    })

    const actionsContainerClasses = CX({
      default: 1,
      flexRow: 1,
      alignItemsCenter: !shouldCondense,
      alignItemsStart: shouldCondense,
      mt10: !shouldCondense,
      px10: !shouldCondense,
      mlAuto: shouldCondense,
      flexWrap: !shouldCondense,
    })

    const commentPublishBtnClasses = CX({
      default: 1,
      justifyContentCenter: 1,
      displayNone: length(this.props.text) === 0 || anyMedia,
    })

    return (
      <div className={[_s.default, _s.width100PC].join(' ')}>
        {
          shouldCondense &&
          <div className={parentContainerClasses}>
            <div className={[_s.default, _s.width100PC].join(' ')}>

              <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
                <div className={[_s.default, _s.mr10].join(' ')}>
                  <Avatar account={account} size={28} noHover />
                </div>

                <div
                  className={childContainerClasses}
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
                    textarea
                  />

                  <div className={actionsContainerClasses}>
                    <div className={[_s.default, _s.flexRow, _s.mrAuto].join(' ')}>

                      { /* <EmojiPickerButton small={shouldCondense} isMatch={isMatch} /> */ }

                      { /* <UploadButton small={shouldCondense} /> */ }

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
                <div className={[_s.default, _s.width100PC, _s.pl35, _s.mt5].join(' ')}>
                  <UploadForm
                    replyToId={replyToId}
                    isModalOpen={isModalOpen}
                  />
                </div>
              }
            </div>
          </div>
        }

        {
          !shouldCondense &&
          <div className={parentContainerClasses}>
            <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
              <div
                className={childContainerClasses}
                ref={this.setForm}
                onClick={this.handleClick}
              >

                {
                  !!reduxReplyToId && isModalOpen &&
                  <div className={[_s.default, _s.px15, _s.py10, _s.mt5].join(' ')}>
                    <StatusContainer
                      contextType='compose'
                      id={reduxReplyToId}
                      isChild
                    />
                  </div>
                }

                {
                  !!spoiler &&
                  <div className={[_s.default, _s.px15, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
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
                  textarea
                />

                {
                  (isUploading || anyMedia) &&
                  <div className={[_s.default, _s.px15, _s.mt5].join(' ')}>
                    <UploadForm
                      replyToId={replyToId}
                      isModalOpen={isModalOpen}
                    />
                  </div>
                }

                {
                  /* : todo :
                  !!selectedGifSrc && !anyMedia &&
                  <div className={[_s.default, _s.px15].join(' ')}>
                    <GifForm
                      replyToId={replyToId}
                      small={shouldCondense}
                      selectedGifSrc={selectedGifSrc}
                    />
                  </div>
                  */
                }

                {
                  !edit && hasPoll &&
                  <div className={[_s.default, _s.px15, _s.mt5].join(' ')}>
                    <PollForm replyToId={replyToId} />
                  </div>
                }

                {
                  !!quoteOfId && isModalOpen &&
                  <div className={[_s.default, _s.px15, _s.py10, _s.mt5].join(' ')}>
                    <StatusContainer
                      contextType='compose'
                      id={quoteOfId}
                      isChild
                    />
                  </div>
                }

                <div className={actionsContainerClasses}>
                  <div className={[_s.default, _s.flexRow, _s.mrAuto].join(' ')}>

                    { /* <EmojiPickerButton small={shouldCondense} isMatch={isMatch} /> */ }

                    <UploadButton small={shouldCondense} />
                    { /* <GifSelectorButton small={shouldCondense} /> */}

                    {
                      !edit &&
                      <PollButton />
                    }

                    <StatusVisibilityButton />
                    <SpoilerButton />
                    <SchedulePostButton />
                    { /* !shouldCondense && <RichTextEditorButton /> */}
                  </div>

                  <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                    <CharacterCounter max={MAX_POST_CHARACTER_COUNT} text={text} />
                  </Responsive>

                  <Button
                    isOutline
                    isDisabled={disabledButton}
                    backgroundColor='none'
                    color='brand'
                    className={[_s.fs15PX, _s.px15].join(' ')}
                    onClick={this.handleSubmit}
                  >
                    {intl.formatMessage(scheduledAt ? messages.schedulePost : edit ? messages.publishEdit : messages.publish)}
                  </Button>
                </div>

              </div>
            </div>
          </div>
        }
      </div>
    )
  }

}