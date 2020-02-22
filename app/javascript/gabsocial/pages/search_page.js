import { Fragment } from 'react'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'
import SearchLayout from '../components/layouts/search_layout'

export default class SearchPage extends PureComponent {
  render() {
    const { children } = this.props

    return (
      <SearchLayout>
        {children}
      </SearchLayout>
    )
  }
}