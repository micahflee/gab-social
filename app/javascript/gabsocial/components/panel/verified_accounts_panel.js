import React from 'react'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { fetchPopularSuggestions } from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Account from '../account'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  title: { id: 'who_to_follow.title', defaultMessage: 'Verified Accounts to Follow' },
  show_more: { id: 'who_to_follow.more', defaultMessage: 'Show more' },
})

const mapStateToProps = (state) => ({
  suggestions: state.getIn(['suggestions', 'verified', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPopularSuggestions: () => dispatch(fetchPopularSuggestions()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class VerifiedAccountsPanel extends ImmutablePureComponent {

  static propTypes = {
    fetchPopularSuggestions: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    suggestions: ImmutablePropTypes.list.isRequired,
    isLazy: PropTypes.bool,
  }

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
      this.props.fetchPopularSuggestions()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.fetchPopularSuggestions()
    }
  }

  render() {
    const { intl, suggestions } = this.props

    if (suggestions.isEmpty()) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        // footerButtonTitle={intl.formatMessage(messages.show_more)}
        // footerButtonTo='/explore'
      >
        <div className={_s.default}>
          {
            suggestions.map(accountId => (
              <Account
                compact
                key={accountId}
                id={accountId}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}