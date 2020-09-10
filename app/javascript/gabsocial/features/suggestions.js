import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import { fetchRelatedSuggestions } from '../actions/suggestions'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import AccountPlaceholder from '../components/placeholder/account_placeholder'

class Suggestions extends ImmutablePureComponent {

  componentDidMount() {
    this.props.fetchRelatedSuggestions()
  }

  render() {
    const {
      intl,
      isLoading,
      suggestions,
    } = this.props

    return (
      <Block>
        <BlockHeading title={intl.formatMessage(messages.title)} />
        <ScrollableList
          scrollKey='related_user_suggestions'
          isLoading={isLoading}
          showLoading={isLoading}
          placeholderComponent={AccountPlaceholder}
          placeholderCount={4}
          emptyMessage={intl.formatMessage(messages.empty)}
        >
          {
            suggestions && suggestions.map((id) => (
              <Account key={`user_related_suggestion_${id}`} id={id} compact withBio />
            ))
          }
        </ScrollableList>
      </Block>
    )
  }

}

const mapStateToProps = (state) => ({
  suggestions: state.getIn(['suggestions', 'related', 'items']),
  isLoading: state.getIn(['suggestions', 'related', 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  fetchRelatedSuggestions: () => dispatch(fetchRelatedSuggestions(true)),
})

const messages = defineMessages({
  title: { id: 'who_to_follow.title', defaultMessage: 'Who to Follow' },
  empty: { id: 'account.suggestions.empty', defaultMessage: 'No suggestions found.' },
})

Suggestions.propTypes = {
  intl: PropTypes.object.isRequired,
  fetchRelatedSuggestions: PropTypes.func.isRequired,
  suggestions: ImmutablePropTypes.list.isRequired,
  isLoading: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Suggestions))