import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchRelatedSuggestions,
  fetchPopularSuggestions,
} from '../../actions/suggestions'
import Account from '../account'
import TimelineInjectionLayout from './timeline_injection_layout'

class UserSuggestionsInjection extends ImmutablePureComponent {

  componentDidMount() {
    this.handleFetch()
  }

  handleFetch = () => {
    if (this.props.suggestionType === 'verified') {
      this.props.fetchPopularSuggestions()
    } else {
      this.props.fetchRelatedSuggestions()
    }
  }
  
  render() {
    const {
      intl,
      isLoading,
      isXS,
      suggestions,
      suggestionType,
      injectionId,
    } = this.props

    if (suggestions.isEmpty()) return <div />

    const title = suggestionType === 'verified' ? intl.formatMessage(messages.verifiedTitle) : intl.formatMessage(messages.relatedTitle)

    return (
      <TimelineInjectionLayout
        id={injectionId}
        title={title}
        buttonLink='/suggestions'
        buttonTitle='See more recommendations'
        isXS={isXS}
      >
          {
            suggestions.map((accountId) => (
              <Account
                isCard
                key={`user_suggestion_injection_${accountId}`}
                id={accountId}
              />
            ))
          }
      </TimelineInjectionLayout>
    )
  }

}

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  relatedTitle: { id: 'who_to_follow.title', defaultMessage: 'Who to Follow' },
  verifiedTitle: { id: 'who_to_follow.verified_title', defaultMessage: 'Verified Accounts to Follow' },
  show_more: { id: 'who_to_follow.more', defaultMessage: 'Show more' },
})

const mapStateToProps = (state, { suggestionType = 'related' }) => ({
  suggestions: state.getIn(['suggestions', suggestionType, 'items']),
  isLoading: state.getIn(['suggestions', suggestionType, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  fetchRelatedSuggestions: () => dispatch(fetchRelatedSuggestions()),
  fetchPopularSuggestions: () => dispatch(fetchPopularSuggestions()),
})

UserSuggestionsInjection.propTypes = {
  suggestionType: PropTypes.oneOf([
    'related',
    'verified'
  ]),
  fetchRelatedSuggestions: PropTypes.func.isRequired,
  fetchPopularSuggestions: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  suggestions: ImmutablePropTypes.list.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isXS: PropTypes.bool,
  injectionId: PropTypes.string,
}

UserSuggestionsInjection.defaultProps = {
  suggestionType: 'related',
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserSuggestionsInjection))