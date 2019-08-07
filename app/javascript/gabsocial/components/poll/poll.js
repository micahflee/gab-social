import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import escapeTextContentForBrowser from 'escape-html';
import spring from 'react-motion/lib/spring';
import Motion from '../../features/ui/util/optional_motion';
import { vote, fetchPoll } from '../../actions/polls';
import emojify from '../emoji/emoji';
import RelativeTimestamp from '../relative_timestamp/relative_timestamp';
import Button from '../button';

import './poll.scss';

const mapStateToProps = (state, { pollId }) => ({
  poll: state.getIn(['polls', pollId]),
});

const messages = defineMessages({
  closed: { id: 'poll.closed', defaultMessage: 'Closed' },
});

const makeEmojiMap = record => record.get('emojis').reduce((obj, emoji) => {
  obj[`:${emoji.get('shortcode')}:`] = emoji.toJS();
  return obj;
}, {});

export default @connect(mapStateToProps)
@injectIntl
class Poll extends ImmutablePureComponent {

  static propTypes = {
    poll: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    disabled: PropTypes.bool,
  };

  state = {
    selected: {},
  };

  handleOptionChange = e => {
    const { target: { value } } = e;

    if (this.props.poll.get('multiple')) {
      const tmp = { ...this.state.selected };
      if (tmp[value]) {
        delete tmp[value];
      } else {
        tmp[value] = true;
      }
      this.setState({ selected: tmp });
    } else {
      const tmp = {};
      tmp[value] = true;
      this.setState({ selected: tmp });
    }
  };

  handleVote = () => {
    if (this.props.disabled) return;

    this.props.dispatch(vote(this.props.poll.get('id'), Object.keys(this.state.selected)));
  };

  handleRefresh = () => {
    if (this.props.disabled) return;

    this.props.dispatch(fetchPoll(this.props.poll.get('id')));
  };

  renderOption (option, optionIndex) {
    const { poll, disabled } = this.props;
    const percent = poll.get('votes_count') === 0 ? 0 : (option.get('votes_count') / poll.get('votes_count')) * 100;
    const leading = poll.get('options').filterNot(other => other.get('title') === option.get('title')).every(other => option.get('votes_count') > other.get('votes_count'));
    const active = !!this.state.selected[`${optionIndex}`];
    const showResults = poll.get('voted') || poll.get('expired');
    const multiple = poll.get('multiple');

    let titleEmojified = option.get('title_emojified');
    if (!titleEmojified) {
      const emojiMap = makeEmojiMap(poll);
      titleEmojified = emojify(escapeTextContentForBrowser(option.get('title')), emojiMap);
    }

    const chartClasses = classNames('poll__chart', {
      'poll__chart--leading': leading,
    });

    const textClasses = classNames('poll__text', {
      selectable: !showResults,
    });

    const inputClasses = classNames('poll__input', {
      'poll__input--checkbox': multiple,
      'poll__input--active': active,
    });

    return (
      <li className='poll-item' key={option.get('title')}>
        {
          showResults && (
            <Motion defaultStyle={{ width: 0 }} style={{ width: spring(percent, { stiffness: 180, damping: 12 }) }}>
              {({ width }) =>
                <span className={chartClasses} style={{ width: `${width}%` }} />
              }
            </Motion>
          )
        }

        <label className={textClasses}>
          <input
            name='vote-options'
            type={multiple ? 'checkbox' : 'radio'}
            value={optionIndex}
            checked={active}
            onChange={this.handleOptionChange}
            disabled={disabled}
          />

          {!showResults && <span className={inputClasses} />}
          {showResults && <span className='poll-item__number'>{Math.round(percent)}%</span>}

          <span className='poll-item__text' dangerouslySetInnerHTML={{ __html: titleEmojified }} />
        </label>
      </li>
    );
  }

  render () {
    const { poll, intl } = this.props;

    if (!poll) return null;

    const timeRemaining = poll.get('expired') ?
      intl.formatMessage(messages.closed)
      : <RelativeTimestamp timestamp={poll.get('expires_at')} futureDate />;
    const showResults = poll.get('voted') || poll.get('expired');
    const disabled = this.props.disabled || Object.entries(this.state.selected).every(item => !item);

    return (
      <div className='poll'>
        <ul className='poll__list'>
          {poll.get('options').map((option, i) => this.renderOption(option, i))}
        </ul>

        <div className='poll__footer'>
          {
            !showResults &&
            <Button className='poll__button' disabled={disabled} onClick={this.handleVote} secondary>
              <FormattedMessage id='poll.vote' defaultMessage='Vote' />
            </Button>
          }
          {
            showResults && !this.props.disabled &&
            <span>
              <button className='poll__link' onClick={this.handleRefresh}>
                <FormattedMessage id='poll.refresh' defaultMessage='Refresh' />
              </button>
              &nbsp;·&nbsp;
            </span>
          }
          <FormattedMessage
            id='poll.total_votes'
            defaultMessage='{count, plural, one {# vote} other {# votes}}'
            values={{
              count: poll.get('votes_count'),
            }}
          />
          {
            poll.get('expires_at') &&
            <span> · {timeRemaining}</span>
          }
        </div>
      </div>
    );
  }

}
