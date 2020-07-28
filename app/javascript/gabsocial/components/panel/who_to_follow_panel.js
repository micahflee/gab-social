import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchRelatedSuggestions,
  dismissRelatedSuggestion,
} from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Account from '../account'
import AccountPlaceholder from '../placeholder/account_placeholder'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  title: { id: 'who_to_follow.title', defaultMessage: 'Who to Follow' },
  show_more: { id: 'who_to_follow.more', defaultMessage: 'Show more' },
})

const mapStateToProps = (state) => ({
  suggestions: state.getIn(['suggestions', 'related', 'items']),
  isLoading: state.getIn(['suggestions', 'related', 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  fetchRelatedSuggestions: () => dispatch(fetchRelatedSuggestions()),
  dismissRelatedSuggestion: (account) => dispatch(dismissRelatedSuggestion(account.get('id'))),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class WhoToFollowPanel extends ImmutablePureComponent {

  static propTypes = {
    dismissRelatedSuggestion: PropTypes.func.isRequired,
    fetchRelatedSuggestions: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    suggestions: ImmutablePropTypes.list.isRequired,
    isLoading: PropTypes.bool.isRequired,
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
      this.props.fetchRelatedSuggestions()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.fetchRelatedSuggestions()
    }
  }

  render() {
    const {
      intl,
      isLoading,
      suggestions,
      dismissRelatedSuggestion,
    } = this.props

    if (suggestions.isEmpty()) return null

    const Child = isLoading ? AccountPlaceholder : Account
    const arr = isLoading ? Array.apply(null, { length: 6 }) : suggestions

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        footerButtonTitle={intl.formatMessage(messages.show_more)}
        footerButtonTo='/explore'
      >
        <div className={_s.default}>
          {
            arr.map((accountId) => (
              <Child
                compact
                showDismiss
                key={accountId}
                id={accountId}
                dismissAction={dismissRelatedSuggestion}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}