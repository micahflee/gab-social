import { Fragment } from 'react'
import { me } from '../initial_state'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import Text from '../components/text'
import DefaultLayout from '../layouts/default_layout'
import GroupsCollection from '../features/groups_collection'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  GroupsPanel,
  LinkFooter,
} from '../features/ui/util/async_components'

const messages = defineMessages({
  groups: { id: 'groups', defaultMessage: 'Groups' },
  new: { id: 'new', defaultMessage: 'Recently Added Groups' },
  featured: { id: 'featured', defaultMessage: 'Featured Groups' },
  myGroupsTimeline: { id: 'my_groups_timeline', defaultMessage: 'Timeline' },
  myGroups: { id: 'my_groups', defaultMessage: 'My Groups' },
  admin: { id: 'admin', defaultMessage: 'Admin' },
})

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

export default
@injectIntl
@connect(mapStateToProps)
class GroupsPage extends PureComponent {

  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    isPro: PropTypes.bool,
  }

  render() {
    const {
      activeTab,
      intl,
      children,
      isPro,
    } = this.props

    const dontShowChildren = (activeTab === 'timeline' && !me)

    const actions = isPro ? [
      {
        icon: 'add',
        to: '/groups/create',
      },
    ] : []

    const tabs = !!me ? [
      {
        title: intl.formatMessage(messages.myGroupsTimeline),
        to: '/groups',
      },
      {
        title: intl.formatMessage(messages.myGroups),
        to: '/groups/browse/member',
      },
      {
        title: intl.formatMessage(messages.featured),
        to: '/groups/browse/featured',
      },
      {
        title: intl.formatMessage(messages.new),
        to: '/groups/browse/new',
      },
    ] : []

    if (isPro) {
      tabs.push({
        title: intl.formatMessage(messages.admin),
        to: '/groups/browse/admin',
      })
    }

    const title = intl.formatMessage(messages.groups)
    
    const layout = []
    if (!!me) {
      layout.push(<WrappedBundle component={GroupsPanel} componentParams={{ groupType: 'member' }} />)
    }
    layout.push(LinkFooter)

    return (
      <DefaultLayout
        title={title}
        actions={actions}
        tabs={tabs}
        page='groups'
        layout={layout}
      >
        <PageTitle path={title} />

        { !dontShowChildren && children }

        {
          dontShowChildren &&
          <GroupsCollection activeTab='featured' />
        }
      </DefaultLayout>
    )
  }

}
