import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchRelatedSuggestions,
  fetchPopularSuggestions,
} from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Account from '../account'
import AccountPlaceholder from '../placeholder/account_placeholder'
import PanelLayout from './panel_layout'

class UserSuggestionsPanel extends ImmutablePureComponent {

  state = {
    fetched: !this.props.isLazy,
  }

  updateOnProps = [
    'suggestions',
    'isLazy',
    'shouldLoad',
  ]

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fetched && this.state.fetched) {
      // this.handleFetch()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      // this.handleFetch()
    }
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
      suggestions,
      suggestionType,
    } = this.props

    return null
    if (suggestions.isEmpty()) return null

    const Child = isLoading ? AccountPlaceholder : Account
    const arr = isLoading ? Array.apply(null, { length: 6 }) : suggestions

    const title = suggestionType === 'verified' ? intl.formatMessage(messages.verifiedTitle) : intl.formatMessage(messages.relatedTitle)

    return (
      <PanelLayout
        noPadding
        title={title}
        footerButtonTitle={intl.formatMessage(messages.show_more)}
        footerButtonTo='/suggestions'
      >
        <div className={_s.d}>
          {
            arr.map((accountId) => (
              <Child
                compact
                key={accountId}
                id={accountId}
                isSmall={isLoading ? true : undefined}
              />
            ))
          }
        </div>
      </PanelLayout>
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

UserSuggestionsPanel.propTypes = {
  suggestionType: PropTypes.oneOf([
    'related',
    'verified'
  ]),
  fetchRelatedSuggestions: PropTypes.func.isRequired,
  fetchPopularSuggestions: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  suggestions: ImmutablePropTypes.list.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLazy: PropTypes.bool,
}

UserSuggestionsPanel.defaultProps = {
  suggestionType: 'related',
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserSuggestionsPanel))