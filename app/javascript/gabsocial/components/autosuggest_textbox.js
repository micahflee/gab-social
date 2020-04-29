import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import isObject from 'lodash.isobject'
import classNames from 'classnames/bind'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { isRtl } from '../utils/rtl'
import { textAtCursorMatchesToken } from '../utils/cursor_token_match'
import AutosuggestAccount from './autosuggest_account'
import AutosuggestEmoji from './autosuggest_emoji'
import Input from './input'
import Composer from './composer'

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
    prependIcon: PropTypes.string,
  }

  static defaultProps = {
    autoFocus: true,
    searchTokens: ['@', ':', '#'],
    textarea: false,
  }

  state = {
    suggestionsHidden: true,
    focused: false,
    selectedSuggestion: 0,
    lastToken: null,
    tokenStart: 0,
  }

  onChange = (e, value, selectionStart, markdown) => {
    if (!isObject(e)) {
      e = {
        target: {
          value,
          selectionStart,
        },
      }
    }

    const [ tokenStart, token ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart, this.props.searchTokens);

    // console.log('onChange', e.target.value, e.target, this.textbox, tokenStart, token)

    if (token !== null && this.state.lastToken !== token) {
      this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
      this.props.onSuggestionsFetchRequested(token);
    } else if (token === null) {
      this.setState({ lastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    this.props.onChange(e, markdown);
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

    switch (e.key) {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions && nextProps.suggestions.size > 0 && this.state.suggestionsHidden && this.state.focused) {
      this.setState({ suggestionsHidden: false });
    }
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

  setTextbox = (c) => {
    this.textbox = c;
  }

  render() {
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
      textarea,
      prependIcon,
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
      backgroundColorSubtle: small,
      py15: !small,
      py10: small,
      fontSize16PX: !small,
      fontSize14PX: small,
      mr5: small,
    })

    if (textarea) {
      return (
        <Fragment>
          <div className={[_s.default, _s.flexGrow1, _s.maxWidth100PC].join(' ')}>
            <Composer
              inputRef={this.setTextbox}
              disabled={disabled}
              placeholder={placeholder}
              autoFocus={autoFocus}
              value={value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={onKeyUp}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onPaste={this.onPaste}
              small={small}
            />

            {children}
          </div>
          { /* : todo :  put in popover */ }
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
            prependIcon={prependIcon}
          />
        </label>

        <div className={`autosuggest-textarea__suggestions ${suggestionsHidden || suggestions.isEmpty() ? '' : 'autosuggest-textarea__suggestions--visible'}`}>
          {suggestions.map(this.renderSuggestion)}
        </div>
      </div>
    );
  }

}
