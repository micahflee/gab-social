import { Fragment } from 'react'
import LinkFooter from '../components/link_footer'
import SearchFilterPanel from '../components/panel/search_filter_panel'
import SearchLayout from '../layouts/search_layout'

export default class SearchPage extends PureComponent {
  render() {
    const { children } = this.props

    return (
      <SearchLayout
        layout={(
          <Fragment>
            <SearchFilterPanel />
            <LinkFooter />
          </Fragment>
        )}
        showBackBtn
        >
        {children}
      </SearchLayout>
    )
  }
}