import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { me } from '../initial_state'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import Text from '../components/text'
import DefaultLayout from '../layouts/default_layout'
import GroupsCollection from '../features/groups_collection'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import { openModal } from '../actions/modal'
import { MODAL_PRO_UPGRADE } from '../constants'
import {
  GroupsPanel,
  LinkFooter,
} from '../features/ui/util/async_components'

class GroupsPage extends React.PureComponent {

  handleOpenProUpgradeModal = () => {
    this.props.dispatch(openModal(MODAL_PRO_UPGRADE))
  }

  render() {
    const {
      activeTab,
      intl,
      children,
      isPro,
    } = this.props

    const dontShowChildren = (activeTab === 'timeline' && !me)

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
      {
        title: intl.formatMessage(messages.categories),
        to: '/groups/browse/categories',
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
        noSearch
        title={title}
        actions={[
          {
            title: 'Create',
            icon: 'add',
            to: isPro ? '/groups/create' : undefined,
            onClick: isPro ? undefined : this.handleOpenProUpgradeModal,
          },
        ]}
        tabs={tabs}
        page='groups'
        layout={layout}
      >
        <PageTitle path={title} />

        {
          !dontShowChildren && children
        }

        {
          dontShowChildren &&
          <GroupsCollection activeTab='featured' />
        }
      </DefaultLayout>
    )
  }

}

const messages = defineMessages({
  groups: { id: 'groups', defaultMessage: 'Groups' },
  new: { id: 'new', defaultMessage: 'Recently Added Groups' },
  featured: { id: 'featured', defaultMessage: 'Featured Groups' },
  myGroupsTimeline: { id: 'my_groups_timeline', defaultMessage: 'Timeline' },
  myGroups: { id: 'my_groups', defaultMessage: 'My Groups' },
  categories: { id: 'categories', defaultMessage: 'Categories' },
  admin: { id: 'admin', defaultMessage: 'Admin' },
})

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

GroupsPage.propTypes = {
  activeTab: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isPro: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps)(GroupsPage))