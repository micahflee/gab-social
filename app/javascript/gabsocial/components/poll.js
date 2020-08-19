import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import escapeTextContentForBrowser from 'escape-html'
import spring from 'react-motion/lib/spring'
import { me } from '../initial_state'
import Motion from '../features/ui/util/reduced_motion'
import { vote } from '../actions/polls'
import { CX } from '../constants'
import emojify from './emoji/emoji'
import RelativeTimestamp from './relative_timestamp'
import Button from './button'
import DotTextSeperator from './dot_text_seperator'
import Text from './text'

const makeEmojiMap = record => record.get('emojis').reduce((obj, emoji) => {
  obj[`:${emoji.get('shortcode')}:`] = emoji.toJS()
  return obj
}, {})

class Poll extends ImmutablePureComponent {

  state = {
    selected: {},
  }

  handleOptionChange = e => {
    const { target: { value } } = e

    if (this.props.poll.get('multiple')) {
      const tmp = { ...this.state.selected }
      if (tmp[value]) {
        delete tmp[value]
      } else {
        tmp[value] = true
      }
      this.setState({ selected: tmp })
    } else {
      const tmp = {}
      tmp[value] = true
      this.setState({ selected: tmp })
    }
  }

  handleVote = () => {
    if (this.props.disabled) return

    this.props.dispatch(vote(this.props.poll.get('id'), Object.keys(this.state.selected)))
  }

  renderOption(option, optionIndex) {
    const { poll, disabled } = this.props
    const { selected } = this.state
    const percent = poll.get('votes_count') === 0 ? 0 : (option.get('votes_count') / poll.get('votes_count')) * 100
    const leading = poll.get('options').filterNot(other => other.get('title') === option.get('title')).every(other => option.get('votes_count') > other.get('votes_count'))
    const optionHasNoVotes = option.get('votes_count') === 0
    const active = !!selected[`${optionIndex}`]
    const showResults = poll.get('voted') || poll.get('expired')
    const multiple = poll.get('multiple')
    const correctedWidthPercent = optionHasNoVotes ? 100 : percent

    let titleEmojified = option.get('title_emojified')
    if (!titleEmojified) {
      const emojiMap = makeEmojiMap(poll)
      titleEmojified = emojify(escapeTextContentForBrowser(option.get('title')), emojiMap)
    }

    const chartClasses = CX({
      d: 1,
      posAbs: 1,
      top0: 1,
      left0: 1,
      radiusSmall: 1,
      h100PC: 1,
      bgSecondary: !leading && !optionHasNoVotes,
      bgTertiary: !leading && optionHasNoVotes,
      bgBrandLight: leading,
    })

    // : todo :
    const inputClasses = CX('poll__input', {
      'poll__input--checkbox': multiple,
      'poll__input--active': active,
    })

    const listItemClasses = CX({
      d: 1,
      flexRow: 1,
      py10: showResults,
      mb10: 1,
      border1PX: !showResults,
      borderColorSecondary: !showResults,
      circle: !showResults,
      cursorPointer: !showResults,
      bgSubtle_onHover: !showResults,
      bgSubtle: !showResults && active,
    })

    const textContainerClasses = CX({
      d: 1,
      w100PC: 1,
      px15: 1,
      py10: !showResults,
      cursorPointer: !showResults,
      aiCenter: !showResults,
    })

    return (
      <li className={listItemClasses} key={option.get('title')}>
        {
          showResults && (
            <Motion defaultStyle={{ width: 0 }} style={{ width: spring(correctedWidthPercent, { stiffness: 180, damping: 24 }) }}>
              {({ width }) =>
                <span className={chartClasses} style={{ width: `${width}%` }} />
              }
            </Motion>
          )
        }

        <label className={textContainerClasses}>
          <Text
            size='medium'
            color='primary'
            weight={(leading && showResults) ? 'bold' : 'normal'}
            className={[_s.displayFlex, _s.flexRow, _s.w100PC, _s.aiCenter].join(' ')}
          >
            {
              !showResults &&
              <input
                name='vote-options'
                type={multiple ? 'checkbox' : 'radio'}
                value={optionIndex}
                checked={active}
                onChange={this.handleOptionChange}
                disabled={disabled}
                className={[_s.d, _s.mr10].join(' ')}
              />
            }

            {
              /* : todo : */
              !showResults && <span className={inputClasses} />
            }

            <span
              className={_s.text}
              dangerouslySetInnerHTML={{ __html: titleEmojified }}
            />

            {
              showResults &&
                <span className={_s.mlAuto}>
                  {Math.round(percent)}%
                </span>
            }
          </Text>
        </label>
      </li>
    )
  }

  render() {
    const { poll, intl } = this.props

    if (!poll) return null

    const timeRemaining = poll.get('expired') ?
      intl.formatMessage(messages.closed)
      : <RelativeTimestamp timestamp={poll.get('expires_at')} futureDate />
    const showResults = poll.get('voted') || poll.get('expired')
    const disabled = this.props.disabled || Object.entries(this.state.selected).every(item => !item)

    return (
      <div className={[_s.d, _s.px15, _s.py10].join(' ')}>
        <ul className={[_s.d, _s.listStyleNone].join(' ')}>
          {
            poll.get('options').map((option, i) => this.renderOption(option, i))
          }
        </ul>

        <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
          {
            !showResults && me &&
            <Button
              isNarrow
              className={_s.mr10}
              isDisabled={disabled}
              onClick={this.handleVote}
            >
              <Text color='inherit' size='small' className={_s.px10}>
                {intl.formatMessage(messages.vote)}
              </Text>
            </Button>
          }

          <Text color='secondary'>
            <FormattedMessage
              id='poll.total_votes'
              defaultMessage='{count, plural, one {# vote} other {# votes}}'
              values={{
                count: poll.get('votes_count'),
              }}
            />
            {
              poll.get('expires_at') &&
              <React.Fragment>
                <DotTextSeperator />
                <Text color='secondary' className={_s.ml5}>
                  {timeRemaining}
                </Text>
              </React.Fragment>
            }
          </Text>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state, { pollId }) => ({
  poll: state.getIn(['polls', pollId]),
})

const messages = defineMessages({
  closed: { id: 'poll.closed', defaultMessage: 'Closed' },
  vote: { id: 'poll.vote', defaultMessage: 'Vote' },
  refresh: { id: 'poll.refresh', defaultMessage: 'Refresh' },
})

Poll.propTypes = {
  poll: ImmutablePropTypes.map,
  intl: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  disabled: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps)(Poll))