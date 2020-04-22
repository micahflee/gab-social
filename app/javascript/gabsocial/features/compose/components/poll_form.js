import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import classNames from 'classnames/bind'
import { defineMessages, injectIntl } from 'react-intl'
import Button from '../../../components/button'
import Text from '../../../components/text'
import Select from '../../../components/select'
import AutosuggestTextbox from '../../../components/autosuggest_textbox'

const cx = classNames.bind(_s)

const messages = defineMessages({
  option_placeholder: { id: 'compose_form.poll.option_placeholder', defaultMessage: 'Choice {number}' },
  add_option: { id: 'compose_form.poll.add_option', defaultMessage: 'Add a choice' },
  remove_option: { id: 'compose_form.poll.remove_option', defaultMessage: 'Remove this choice' },
  poll_duration: { id: 'compose_form.poll.duration', defaultMessage: 'Poll duration' },
  minutes: { id: 'intervals.full.minutes', defaultMessage: '{number, plural, one {# minute} other {# minutes}}' },
  hours: { id: 'intervals.full.hours', defaultMessage: '{number, plural, one {# hour} other {# hours}}' },
  days: { id: 'intervals.full.days', defaultMessage: '{number, plural, one {# day} other {# days}}' },
})

@injectIntl
class PollFormOption extends ImmutablePureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    isPollMultiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onToggleMultiple: PropTypes.func.isRequired,
    suggestions: ImmutablePropTypes.list,
    onClearSuggestions: PropTypes.func.isRequired,
    onFetchSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleOptionTitleChange = e => {
    this.props.onChange(this.props.index, e.target.value);
  };

  handleOptionRemove = () => {
    this.props.onRemove(this.props.index);
  };


  handleToggleMultiple = e => {
    this.props.onToggleMultiple();
    e.preventDefault();
    e.stopPropagation();
  };

  onSuggestionsClearRequested = () => {
    this.props.onClearSuggestions();
  }

  onSuggestionsFetchRequested = (token) => {
    this.props.onFetchSuggestions(token);
  }

  onSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['poll', 'options', this.props.index]);
  }

  render() {
    const { isPollMultiple, title, index, intl } = this.props;

    const toggleClasses = cx({
      default: 1,
      px10: 1,
      py10: 1,
      borderColorSecondary: 1,
      border1PX: 1,
      outlineNone: 1,
      mr10: 1,
      circle: !isPollMultiple,
    })

    return (
      <li className={[_s.default, _s.flexRow, _s.mb10].join(' ')}>
        <label className={[_s.default, _s.flexRow, _s.flexGrow1, _s.alignItemsCenter].join(' ')}>
          <span
            className={toggleClasses}
            onClick={this.handleToggleMultiple}
            role='button'
            tabIndex='0'
          />

          <AutosuggestTextbox
            placeholder={intl.formatMessage(messages.option_placeholder, { number: index + 1 })}
            maxLength={25}
            value={title}
            onChange={this.handleOptionTitleChange}
            suggestions={this.props.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            searchTokens={[':']}
          />
        </label>

        {
          index > 1 &&
          <Button
            narrow
            circle
            backgroundColor='none'
            className={[_s.ml5, _s.justifyContentCenter].join(' ')}
            icon='close'
            iconWidth='8px'
            iconHeight='8px'
            iconClassName={_s.fillColorSecondary}
            disabled={index <= 1}
            title={intl.formatMessage(messages.remove_option)}
            onClick={this.handleOptionRemove}
          />
        }
      </li>
    );
  }

}

export default
@injectIntl
class PollForm extends ImmutablePureComponent {

  static propTypes = {
    options: ImmutablePropTypes.list,
    expiresIn: PropTypes.number,
    isMultiple: PropTypes.bool,
    onChangeOption: PropTypes.func.isRequired,
    onAddOption: PropTypes.func.isRequired,
    onRemoveOption: PropTypes.func.isRequired,
    onChangeSettings: PropTypes.func.isRequired,
    suggestions: ImmutablePropTypes.list,
    onClearSuggestions: PropTypes.func.isRequired,
    onFetchSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleAddOption = () => {
    this.props.onAddOption('');
  };

  handleSelectDuration = e => {
    this.props.onChangeSettings(e.target.value, this.props.isMultiple);
  };

  handleToggleMultiple = () => {
    this.props.onChangeSettings(this.props.expiresIn, !this.props.isMultiple);
  };

  render() {
    const {
      options,
      expiresIn,
      isMultiple,
      onChangeOption,
      onRemoveOption,
      intl,
      ...otherProps
    } = this.props;

    if (!options) return null

    return (
      <div className={[_s.default, _s.px10, _s.py10, _s.borderColorSecondary, _s.border1PX, _s.radiusSmall].join(' ')}>
        <ul className={[_s.default, _s.listStyleNone].join(' ')}>
          {
            options.map((title, i) => (
              <PollFormOption
                title={title}
                key={`poll-form-option-${i}`}
                index={i}
                onChange={onChangeOption}
                onRemove={onRemoveOption}
                isPollMultiple={isMultiple}
                onToggleMultiple={this.handleToggleMultiple}
                {...otherProps}
              />
            ))
          }
        </ul>

        <div className={[_s.default, _s.flexRow].join(' ')}>
          {
            options.size < 4 && (
              <Button
                outline
                backgroundColor='none'
                color='brand'
                className={[_s.alignItemsCenter, _s.mr10].join(' ')}
                onClick={this.handleAddOption}
                icon='add'
                iconWidth='14px'
                iconHeight='14px'
                iconClassName={_s.mr5}
              >
                <Text color='inherit'>
                  {intl.formatMessage(messages.add_option)}
                </Text>
              </Button>
            )
          }

          <div className={[_s.default, _s.flexGrow1].join(' ')}>
            <Select
              value={expiresIn}
              onChange={this.handleSelectDuration}
              options={[
                {
                  value: 300,
                  title: intl.formatMessage(messages.minutes, { number: 5 }),
                },
                {
                  value: 1800,
                  title: intl.formatMessage(messages.minutes, { number: 30 }),
                },
                {
                  value: 3600,
                  title: intl.formatMessage(messages.hours, { number: 1 }),
                },
                {
                  value: 21600,
                  title: intl.formatMessage(messages.hours, { number: 6 }),
                },
                {
                  value: 86400,
                  title: intl.formatMessage(messages.days, { number: 1 }),
                },
                {
                  value: 259200,
                  title: intl.formatMessage(messages.days, { number: 3 }),
                },
                {
                  value: 604800,
                  title: intl.formatMessage(messages.days, { number: 7 }),
                },
              ]}
            />
          </div>
        </div>
      </div>
    )
  }

}
