import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import SearchFilterPanel from '../components/panel/search_filter_panel'
import Layout from '../layouts/layout'

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  top: { id: 'top', defaultMessage: 'Top' },
  people: { id: 'people', defaultMessage: 'People' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  hashtags: { id: 'hashtags', defaultMessage: 'Hashtags' },
})

export default
@injectIntl
class SearchPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { intl, children } = this.props

    const title = intl.formatMessage(messages.search)
    const tabs = [
      {
        title: intl.formatMessage(messages.top),
        to: '/search'
      },
      {
        title: intl.formatMessage(messages.people),
        to: '/search/people'
      },
      {
        title: intl.formatMessage(messages.groups),
        to: '/search/groups'
      },
      {
        title: intl.formatMessage(messages.hashtags),
        to: '/search/hashtags'
      },
    ]

    return (
      <Layout
        noComposeButton
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