import { Fragment } from 'react'
import { me } from '../initial_state'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import GroupsPanel from '../components/panel/groups_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  groups: { id: 'groups', defaultMessage: 'Groups' },
  featured: { id: 'featured', defaultMessage: 'Featured' },
  new: { id: 'new', defaultMessage: 'New' },
  myGroups: { id: 'my_groups', defaultMessage: 'My Groups' },
  admin: { id: 'admin', defaultMessage: 'Admin' },
})

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenGroupCreateModal() {
    dispatch(openModal('GROUP_CREATE'))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupsPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    isPro: PropTypes.bool,
    onOpenGroupCreateModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      intl,
      children,
      isPro,
      onOpenGroupCreateModal,
    } = this.props

    const actions = []
    const tabs = [
      {
        title: intl.formatMessage(messages.groups),
        to: '/groups',
      },
      {
        title: intl.formatMessage(messages.new),
        to: '/groups/new',
      },
      {
        title: intl.formatMessage(messages.myGroups),
        to: '/groups/browse/member',
      },
    ]

    if (isPro) {
      actions.push({
        icon: 'add',
        onClick: onOpenGroupCreateModal,
      })

      tabs.push({
        title: intl.formatMessage(messages.admin),
        to: '/groups/browse/admin',
      })
    }

    const title = intl.formatMessage(messages.groups)

    return (
      <DefaultLayout
        showBackBtn
        title={title}
        actions={actions}
        layout={(
          <Fragment>
            <WhoToFollowPanel />
            <GroupsPanel slim />
            <LinkFooter />
          </Fragment>
        )}
        tabs={tabs}
      >
        <PageTitle path={title} />
        { children }
      </DefaultLayout>
    )
  }

}