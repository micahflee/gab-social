import { Fragment } from 'react'
import { me } from '../initial_state'
import { openModal } from '../actions/modal'
import LinkFooter from '../components/link_footer'
import GroupsPanel from '../components/panel/groups_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import DefaultLayout from '../layouts/default_layout'

const mapStateToProps = (state) => {
  const account = state.getIn(['accounts', me])

  return {
    isPro: account.get('is_pro'),
  }
}

const mapDispatchToProps = dispatch => ({
  onOpenGroupCreateModal() {
    dispatch(openModal('GROUP_CREATE'))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class GroupsPage extends PureComponent {

  static propTypes = {
    isPro: PropTypes.bool,
    onOpenGroupCreateModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.title = 'Groups - Gab'
  }

  render() {
    const { children, isPro, onOpenGroupCreateModal } = this.props

    const actions = []
    const tabs = [
      {
        title: 'Featured',
        to: '/groups',
      },
      {
        title: 'New',
        to: '/groups/new',
      },
      {
        title: 'My Groups',
        to: '/groups/browse/member',
      },
    ]

    if (isPro) {
      actions.push({
        icon: 'add',
        onClick: onOpenGroupCreateModal,
      })

      tabs.push({
        title: 'Admin',
        to: '/groups/browse/admin',
      })
    }

    return (
      <DefaultLayout
        title='Groups'
        actions={actions}
        layout={(
          <Fragment>
            <WhoToFollowPanel />
            <GroupsPanel slim />
            <LinkFooter />
          </Fragment>
        )}
        tabs={tabs}
        showBackBtn
      >
        { children }
      </DefaultLayout>
    )
  }

}