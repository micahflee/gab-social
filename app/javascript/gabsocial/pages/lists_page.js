import { Fragment } from 'react'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../components/layouts/default_layout'

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
            icon: 'subtract',
            onClick: this.handleClickEditLists
          },
          {
            icon: 'add',
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