import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { me } from '../initial_state'
import {
  BREAKPOINT_EXTRA_SMALL,
  CX,
} from '../constants'
import Layout from '../layouts/layout'
import PageTitle from '../features/ui/util/page_title'
import DefaultNavigationBar from '../components/navigation_bar/default_navigation_bar'
import FooterBar from '../components/footer_bar'
import ProfileHeader from '../components/profile_header'
import FloatingActionButton from '../components/floating_action_button'
import SearchNavigationBar from '../components/navigation_bar/search_navigation_bar_xs'
import LoggedOutNavigationBar from '../components/navigation_bar/logged_out_navigation_bar'
import Responsive from '../features/ui/util/responsive_component'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import Search from '../components/search'
import Pills from '../components/pills'
import {
  LinkFooter,
  TrendsPanel,
  SearchFilterPanel,
  SignUpPanel,
} from '../features/ui/util/async_components'

class SearchLayout extends React.PureComponent {

  componentWillMount() {
    const { intl } = this.props

    this.searchTabs = [
      {
        title: intl.formatMessage(messages.top),
        to: '/search',
        active: 1,
      },
      {
        title: intl.formatMessage(messages.people),
        to: '/search/people',
      },
      {
        title: intl.formatMessage(messages.groups),
        to: '/search/groups',
      },
      {
        title: intl.formatMessage(messages.statuses),
        to: '/search/statuses',
      },
      {
        title: intl.formatMessage(messages.links),
        to: '/search/links',
      },
      {
        title: intl.formatMessage(messages.hashtags),
        to: '/search/hashtags',
      },
    ]
  }

  render() {
    const {
      intl,
      children,
      value,
    } = this.props

    const mainContentClasses = CX({
      d: 1,
      w100PC: 1,
      z1: 1,
    })

    const title = intl.formatMessage(messages.search)
    const qos = !!value ? value : ''

    return (
      <React.Fragment>
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          {
            !!me &&
            <SearchNavigationBar tabs={this.searchTabs} value={value} />
          }
          {
            !me &&
            <LoggedOutNavigationBar />
          }

          <main role='main' className={mainContentClasses}>

            {
              !me &&
              <div className={[_s.d, _s.py15].join(' ')}>
                <Pills pills={this.searchTabs} />
              </div>
            }

            {children} 
          </main>

          <FooterBar />

        </Responsive>

        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <Layout
            noComposeButton
            title={title}
            showBackBtn
            tabs={this.searchTabs}
            page={`search.${qos}`}
            layout={[
              SignUpPanel,
              SearchFilterPanel,
              TrendsPanel,
              LinkFooter,
            ]}
          >
            <PageTitle path={title} />
            {children}
          </Layout>
        </Responsive>

      </React.Fragment>
    )
  }

}

SearchLayout.propTypes = {
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
}

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  top: { id: 'top', defaultMessage: 'Top' },
  people: { id: 'people', defaultMessage: 'People' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  statuses: { id: 'statuses', defaultMessage: 'Statuses' },
  hashtags: { id: 'hashtags', defaultMessage: 'Hashtags' },
  links: { id: 'links', defaultMessage: 'Links' },
})

const mapStateToProps = (state) => ({
  value: state.getIn(['search', 'value']),
})

export default injectIntl(connect(mapStateToProps)(SearchLayout))