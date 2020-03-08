import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames/bind'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Textarea from 'react-textarea-autosize'
import ContentEditable from 'react-contenteditable'
import { isRtl } from '../../utils/rtl'
import { textAtCursorMatchesToken } from '../../utils/cursor_token_match'
import AutosuggestAccount from '../autosuggest_account'
import AutosuggestEmoji from '../autosuggest_emoji'
import Input from '../input'

const cx = classNames.bind(_s)

export default class AutosuggestTextbox extends ImmutablePureComponent {

  static propTypes = {
    value: PropTypes.string,
    suggestions: ImmutablePropTypes.list,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    onSuggestionSelected: PropTypes.func.isRequired,
    onSuggestionsClearRequested: PropTypes.func.isRequired,
    onSuggestionsFetchRequested: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    searchTokens: PropTypes.arrayOf(PropTypes.string),
    maxLength: PropTypes.number,
    onPaste: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    textarea: PropTypes.bool,
    small: PropTypes.bool,
  };

  static defaultProps = {
    autoFocus: true,
    searchTokens: ['@', ':', '#'],
    textarea: false,
  };

  state = {
    suggestionsHidden: true,
    focused: false,
    selectedSuggestion: 0,
    lastToken: null,
    tokenStart: 0,
  };

  onChange = (e) => {
    const [ tokenStart, token ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart, this.props.searchTokens);

    if (token !== null && this.state.lastToken !== token) {
      this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
      this.props.onSuggestionsFetchRequested(token);
    } else if (token === null) {
      this.setState({ lastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    this.props.onChange(e);
  }

  onKeyDown = (e) => {
    const { suggestions, disabled } = this.props;
    const { selectedSuggestion, suggestionsHidden } = this.state;

    if (disabled) {
      e.preventDefault();
      return;
    }

    // Ignore key events during text composition
    // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
    if (e.which === 229 || e.isComposing) return;

    switch(e.key) {
    case 'Escape':
      if (suggestions.size === 0 || suggestionsHidden) {
        document.querySelector('.ui').parentElement.focus();
      } else {
        e.preventDefault();
        this.setState({ suggestionsHidden: true });
      }

      break;
    case 'ArrowDown':
      if (suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        this.setState({ selectedSuggestion: Math.min(selectedSuggestion + 1, suggestions.size - 1) });
      }

      break;
    case 'ArrowUp':
      if (suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        this.setState({ selectedSuggestion: Math.max(selectedSuggestion - 1, 0) });
      }

      break;
    case 'Enter':
    case 'Tab':
      // Select suggestion
      if (this.state.lastToken !== null && suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestions.get(selectedSuggestion));
      }

      break;
    }

    if (e.defaultPrevented || !this.props.onKeyDown) return;

    this.props.onKeyDown(e);
  }

  onBlur = () => {
    this.setState({ suggestionsHidden: true, focused: false });

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  onFocus = () => {
    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  onPaste = (e) => {
    if (this.props.onPaste && e.clipboardData && e.clipboardData.files.length === 1) {
      this.props.onPaste(e.clipboardData.files);
      e.preventDefault();
    }
  }

  onSuggestionClick = (e) => {
    const suggestion = this.props.suggestions.get(e.currentTarget.getAttribute('data-index'));
    e.preventDefault();
    this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
    this.textbox.focus();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.suggestions !== this.props.suggestions && nextProps.suggestions.size > 0 && this.state.suggestionsHidden && this.state.focused) {
      this.setState({ suggestionsHidden: false });
    }
  }

  setTextbox = (c) => {
    this.textbox = c;
  }

  renderSuggestion = (suggestion, i) => {
    const { selectedSuggestion } = this.state;
    let inner, key;

    if (typeof suggestion === 'object') {
      inner = <AutosuggestEmoji emoji={suggestion} />;
      key = suggestion.id;
    } else if (suggestion[0] === '#') {
      inner = suggestion;
      key = suggestion;
    } else {
      inner = <AutosuggestAccount id={suggestion} />;
      key = suggestion;
    }

    const classes = classNames('autosuggest-textarea__suggestions__item', {
      selected: i === selectedSuggestion,
    });

    return (
      <div
        role='button'
        tabIndex='0'
        key={key}
        data-index={i}
        className={classes}
        onMouseDown={this.onSuggestionClick}
      >
        {inner}
      </div>
    );
  }

  render () {
    const {
      value,
      small,
      suggestions,
      disabled,
      placeholder,
      onKeyUp,
      autoFocus,
      children,
      className,
      id,
      maxLength,
      textarea
    } = this.props

    const { suggestionsHidden } = this.state
    const style = {
      direction: isRtl(value) ? 'rtl' : 'ltr',
    }

    const textClasses = cx({
      default: 1,
      lineHeight125: 1,
      resizeNone: 1,
      text: 1,
      displayBlock: 1,
      outlineNone: 1,
      backgroundColorPrimary: !small,
      backgroundSubtle: small,
      paddingVertical15PX: !small,
      paddingVertical10PX: small,
      fontSize16PX: !small,
      fontSize14PX: small,
      marginRight5PX: small,
    })

    // <div aria-activedescendant="typeaheadFocus-0.35973815699338085"
    // aria-autocomplete="list"
    // aria-controls="typeaheadDropdownWrapped-0"
    // aria-describedby="placeholder-7g4r6"
    // aria-label="Tweet text"
    // aria-multiline="true"
    // class="notranslate public-DraftEditor-content"
    // contenteditable="true"
    // data-testid="tweetTextarea_0"
    // role="textbox"
    // spellcheck="true"
    // tabindex="0"
    // no-focuscontainer-refocus="true"
    // style="outline: none; user-select: text; white-space: pre-wrap; overflow-wrap: break-word;">
    
    if (textarea) {
      return (
      <Fragment>
          <div className={[_s.default, _s.flexGrow1].join(' ')}>
            <div className={[_s.default, _s.marginLeft5PX].join(' ')}>

              <ContentEditable
                noFocuscontainerRefocus
                ariaMultiline
                contentEditable
                spellcheck
                tabindex='0'
                ariaLabel='Gab text'
                role='textbox'
                ariaAutocomplete='list'
                style={{
                  userSelect: 'text',
                  'white-space': 'pre-wrap',
                  overflowWrap: 'break-word'
                }}
                inputRef={this.setTextbox}
                className={textClasses}
                disabled={disabled}
                placeholder={placeholder}
                autoFocus={autoFocus}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={onKeyUp}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onPaste={this.onPaste}
                style={style}
                html={value}
              />
            </div>
            {children}
          </div>
          <div className='autosuggest-textarea__suggestions-wrapper'>
            <div className={`autosuggest-textarea__suggestions ${suggestionsHidden || suggestions.isEmpty() ? '' : 'autosuggest-textarea__suggestions--visible'}`}>
              {suggestions.map(this.renderSuggestion)}
            </div>
          </div>
        </Fragment>
      )
    }

    return (
      <div className={[_s.default, _s.flexGrow1].join(' ')}>
        <label className={[_s.default].join(' ')}>
          <span style={{ display: 'none' }}>{placeholder}</span>

          <Input
            type='text'
            ref={this.setTextbox}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            value={value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={onKeyUp}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            style={style}
            aria-autocomplete='list'
            id={id}
            className={className}
            maxLength={maxLength}
          />
        </label>

        <div className={`autosuggest-textarea__suggestions ${suggestionsHidden || suggestions.isEmpty() ? '' : 'autosuggest-textarea__suggestions--visible'}`}>
          {suggestions.map(this.renderSuggestion)}
        </div>
      </div>
    );
  }

}
