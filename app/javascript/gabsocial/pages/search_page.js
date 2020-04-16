import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import SearchFilterPanel from '../components/panel/search_filter_panel'
import SearchLayout from '../layouts/search_layout'

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
})

export default
@injectIntl
class SearchPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const {
      intl,
      children,
    } = this.props

    return (
      <SearchLayout
        showBackBtn
        layout={(
          <Fragment>
            <SearchFilterPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        <PageTitle path={intl.formatMessage(messages.search)} />
        {children}
      </SearchLayout>
    )
  }

}