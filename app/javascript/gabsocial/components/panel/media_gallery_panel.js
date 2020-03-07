import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { expandAccountMediaTimeline } from '../../actions/timelines'
import { getAccountGallery } from '../../selectors'
import PanelLayout from './panel_layout'
import MediaItem from '../media_item'

const messages = defineMessages({
  title: { id: 'media_gallery_panel.title', defaultMessage: 'Media' },
  show_all: { id: 'media_gallery_panel.all', defaultMessage: 'Show all' },
})

const mapStateToProps = (state, { account }) => {
  const accountId = !!account ? account.get('id') : -1

  return {
    accountId,
    attachments: getAccountGallery(state, accountId),
  }
}

export default
@connect(mapStateToProps)
@injectIntl
class MediaGalleryPanel extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountId: PropTypes.string,
    account: ImmutablePropTypes.map.isRequired,
    attachments: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { accountId } = this.props

    if (accountId) {
      this.props.dispatch(expandAccountMediaTimeline(accountId, {limit: 8}))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(expandAccountMediaTimeline(nextProps.accountId, {limit: 8}))
    }
  }

  render() {
    const {
      intl,
      account,
      attachments
    } = this.props

    console.log("account, attachments:", account, attachments)

    if (!account || !attachments) return null
    if (attachments.size === 0) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.show_all)}
        headerButtonTo={`/${account.get('acct')}/media`}
      >
        <div className={[_s.default, _s.flexRow, _s.flexWrap, _s.paddingHorizontal10PX, _s.paddingVertical10PX].join(' ')}>
          {
            attachments.slice(0, 16).map((attachment) => (
              <MediaItem
                small
                key={attachment.get('id')}
                attachment={attachment}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}