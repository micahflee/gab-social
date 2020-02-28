import { defineMessages, injectIntl } from 'react-intl'
import { fetchSuggestions, dismissSuggestion } from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import AccountContainer from '../../containers/account_container'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  title: { id: 'media_gallery_panel.title', defaultMessage: 'Media' },
  show_all: { id: 'media_gallery_panel.all', defaultMessage: 'Show all' },
})

const mapStateToProps = state => ({
  suggestions: state.getIn(['suggestions', 'items']),
})

const mapDispatchToProps = dispatch => {
  return {
    fetchSuggestions: () => dispatch(fetchSuggestions()),
    dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class MediaGalleryPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    // this.props.fetchSuggestions()
  }

  render() {
    const { intl, account } = this.props

    console.log("account:", account)

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.show_all)}
        headerButtonTo='/explore'
      >

      </PanelLayout>
    )
  }
}