import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import LinkFooter from '../components/link_footer'
import GroupsPanel from '../components/panel/groups_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import DefaultLayout from '../layouts/default_layout'


const mapDispatchToProps = dispatch => ({
  onOpenGroupCreateModal() {
    dispatch(openModal('GROUP_CREATE'))
  },
})

export default
@connect(null, mapDispatchToProps)
class GroupsPage extends PureComponent {

  static propTypes = {
    onOpenGroupCreateModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.title = 'Groups - Gab'
  }
  
  handleClickNewList () {
    console.log("handleClickNewList")
  }

  handleClickEditLists () {
    console.log("handleClickEditLists")
  }

  render() {
    const { children, onOpenGroupCreateModal } = this.props

    const tabs = [
      {
        title: 'Featured',
        to: '/groups'
      },
      {
        title: 'New',
        to: '/groups/new'
      },
      {
        title: 'My Groups',
        to: '/groups/browse/member'
      },
      { // only if is_pro
        title: 'Admin',
        to: '/groups/browse/admin'
      },
    ]

    return (
      <DefaultLayout
        title='Groups'
        actions={[
          {
            icon: 'group-add',
            onClick: onOpenGroupCreateModal
          },
        ]}
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