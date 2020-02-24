import { Fragment } from 'react'
import LinkFooter from '../components/link_footer'
import GroupsPanel from '../components/panel/groups_panel'
import DefaultLayout from '../layouts/default_layout'

export default class GroupsPage extends PureComponent {

  handleClickNewList () {
    console.log("handleClickNewList")
  }

  handleClickEditLists () {
    console.log("handleClickEditLists")
  }

  render() {
    const { children } = this.props

    const tabs = [
      {
        title: 'Featured',
        to: '/groups'
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
            icon: 'list-delete',
            onClick: this.handleClickEditLists
          },
        ]}
        layout={(
          <Fragment>
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