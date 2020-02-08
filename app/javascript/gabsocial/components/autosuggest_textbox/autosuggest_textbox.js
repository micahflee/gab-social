import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Textarea from 'react-textarea-autosize';
import { isRtl } from '../../utils/rtl';
import { textAtCursorMatchesToken } from '../../utils/cursor_token_match';
import AutosuggestAccount from '../autosuggest_account';
import AutosuggestEmoji from '../autosuggest_emoji';

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
    const { value, suggestions, disabled, placeholder, onKeyUp, autoFocus, children, className, id, maxLength, textarea } = this.props;
    const { suggestionsHidden } = this.state;
    const style = { direction: 'ltr' };

    if (isRtl(value)) {
      style.direction = 'rtl';
    }

    if (textarea) {
      return (
        <Fragment>
          <div className={[styles.default].join(' ')}>
            <div className={[styles.default, styles.marginLeft5PX].join(' ')}>
              <Textarea
                inputRef={this.setTextbox}
                className={[styles.default, styles.backgroundWhite, styles.lineHeight125, styles.resizeNone, styles.paddingVertical15PX, styles.outlineFocusBrand, styles.fontSize16PX, styles.text, styles.displayBlock].join(' ')}
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
                style={style}
                aria-autocomplete='list'
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
      <div className='autosuggest-input'>
        <label>
          <span style={{ display: 'none' }}>{placeholder}</span>

          <input
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
