import { Fragment } from 'react'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

export default class ListsPage extends PureComponent {

  handleClickNewList () {
    console.log("handleClickNewList")
  }

  handleClickEditLists () {
    console.log("handleClickEditLists")
  }

  render() {
    const { children } = this.props

    return (
      <DefaultLayout
        title='Lists'
        actions={[
          {
            icon: 'list-delete',
            onClick: this.handleClickEditLists
          },
          {
            icon: 'list-add',
            onClick: this.handleClickNewList
          },
        ]}
        layout={(
          <Fragment>
            <TrendsPanel />
            <WhoToFollowPanel />
            <LinkFooter />
          </Fragment>
        )}
        showBackBtn
      >
        {children}
      </DefaultLayout>
    )
  }
}