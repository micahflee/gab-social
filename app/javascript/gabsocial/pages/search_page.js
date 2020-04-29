import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import SearchFilterPanel from '../components/panel/search_filter_panel'
import Layout from '../layouts/layout'

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

    const title = intl.formatMessage(messages.search)
    const tabs = [
      {
        title: 'Top',
        to: '/search'
      },
      {
        title: 'People',
        to: '/search/people'
      },
      {
        title: 'Groups',
        to: '/search/groups'
      },
      {
        title: 'Gabs',
        to: '/search/gabs'
      },
      {
        title: 'Trends',
        to: '/search/trends'
      },
      {
        title: 'Hashtags',
        to: '/search/hashtags'
      },
    ]

    return (
      <Layout
        title={title}
        showBackBtn
        tabs={tabs}
        layout={(
          <Fragment>
            <SearchFilterPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        <PageTitle path={title} />
        {children}
      </Layout>
    )
  }

}