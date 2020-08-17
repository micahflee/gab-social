import React from 'react'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Responsive from '../features/ui/util/responsive_component'
import PageTitle from '../features/ui/util/page_title'
import Search from '../components/search'
import Layout from '../layouts/layout'
import {
  LinkFooter,
  TrendsPanel,
  SearchFilterPanel,
  SignUpPanel,
} from '../features/ui/util/async_components'

class SearchPage extends React.PureComponent {

  componentWillMount() {
    const { intl } = this.props

    this.tabs = [
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
  }

  render() {
    const {
      children,
      intl,
      value,
    } = this.props

    const title = intl.formatMessage(messages.search)
    const qos = !!value ? value : ''

    return (
      <Layout
        noComposeButton
        title={title}
        showBackBtn
        tabs={this.tabs}
        page={`search.${qos}`}
        layout={[
          SignUpPanel,
          SearchFilterPanel,
          TrendsPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.px10].join(' ')}>
            <Search />
          </div>
        </Responsive>

        {children}
      </Layout>
    )
  }

}

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  top: { id: 'top', defaultMessage: 'Top' },
  people: { id: 'people', defaultMessage: 'People' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  hashtags: { id: 'hashtags', defaultMessage: 'Hashtags' },
})

const mapStateToProps = (state) => ({
  value: state.getIn(['search', 'value']),
})

SearchPage.propTypes = {
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
}

export default injectIntl(connect(mapStateToProps)(SearchPage))