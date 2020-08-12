import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  GroupsPanel,
  ProgressPanel,
  TrendsPanel,
  WhoToFollowPanel,
} from '../features/ui/util/async_components'

const messages = defineMessages({
  community: { 'id': 'column.community', 'defaultMessage': 'Community feed' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenCommunityPageSettingsModal() {
    dispatch(openModal('COMMUNITY_TIMELINE_SETTINGS'))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class CommunityPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onOpenCommunityPageSettingsModal: PropTypes.func.isRequired,
  }

  render() {
    const { intl, children, onOpenCommunityPageSettingsModal } = this.props

    const title = intl.formatMessage(messages.community)

    return (
      <DefaultLayout
        title={title}
        page='community'
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenCommunityPageSettingsModal,
          },
        ]}
        layout={[
          ProgressPanel,
          TrendsPanel,
          WhoToFollowPanel,
          GroupsPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }
}