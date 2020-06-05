import { defineMessages, injectIntl } from 'react-intl'
import { fetchSuggestions, dismissSuggestion } from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Account from '../../components/account'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  title: { id: 'who_to_follow.title', defaultMessage: 'Who to Follow' },
  show_more: { id: 'who_to_follow.more', defaultMessage: 'Show more' },
})

const mapStateToProps = (state) => ({
  suggestions: state.getIn(['suggestions', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  fetchSuggestions: () => dispatch(fetchSuggestions()),
  dismissSuggestion: (account) => dispatch(dismissSuggestion(account.get('id'))),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class WhoToFollowPanel extends ImmutablePureComponent {

  static propTypes = {
    dismissSuggestion: PropTypes.func.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
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
      this.props.fetchSuggestions()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.fetchSuggestions()
    }
  }

  render() {
    const { intl, suggestions, dismissSuggestion } = this.props

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
                showDismiss
                key={accountId}
                id={accountId}
                dismissAction={dismissSuggestion}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}