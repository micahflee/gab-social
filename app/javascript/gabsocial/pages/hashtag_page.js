import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import TrendsPanel from '../components/panel/trends_panel'
import HashtagsPanel from '../components/panel/hashtags_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  hashtag: { id: 'hashtag', defaultMessage: 'Hashtag' },
  hashtagTimeline: { id: 'hashtag_timeline', defaultMessage: 'Hashtag timeline' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenHashtagPageSettingsModal(hashtag) {
    dispatch(openModal('HASHTAG_TIMELINE_SETTINGS', {
      hashtag,
    }))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class HashtagPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onOpenHashtagPageSettingsModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      intl,
      children,
      onOpenHashtagPageSettingsModal,
    } = this.props

    return (
      <DefaultLayout
        title={intl.formatMessage(messages.hashtagTimeline)}
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenHashtagPageSettingsModal,
          },
        ]}
        layout={(
          <Fragment>
            <ProgressPanel />
            <TrendsPanel />
            <HashtagsPanel />
            <WhoToFollowPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        <PageTitle path={intl.formatMessage(messages.hashtag)} />
        {children}
      </DefaultLayout>
    )
  }
}