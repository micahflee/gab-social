import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { setFilter } from '../actions/notifications'
import { me } from '../initial_state'
import { NOTIFICATION_FILTERS } from '../constants'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  NotificationFilterPanel,
  TrendsBreakingPanel,
  UserSuggestionsPanel,
} from '../features/ui/util/async_components'

class NotificationsPage extends React.PureComponent {

  onChangeActiveFilter(notificationType) {
    this.props.dispatch(setFilter('active', notificationType))
    
    if (notificationType === 'all') {
      this.context.router.history.push('/notifications')
    } else if (notificationType === 'follow_requests') {
      this.context.router.history.push(`/notifications/follow_requests`)
    } else {
      this.context.router.history.push(`/notifications?view=${notificationType}`)
    }
  }

  render() {
    const {
      children,
      intl,
      locked,
      notificationCount,
      selectedFilter,
    } = this.props

    let filters = NOTIFICATION_FILTERS
    if (!locked && filters.indexOf('follow_requests') > -1) {
      filters.splice(filters.indexOf('follow_requests'))
    }

    const tabs = filters.map((filter) => ({ 
      title: intl.formatMessage(messages[filter]),
      onClick: () => this.onChangeActiveFilter(filter),
      active: selectedFilter.toLowerCase() === filter.toLowerCase(),
    }))

    const title = intl.formatMessage(messages.notifications)

    return (
      <DefaultLayout
        title={title}
        page='notifications'
        layout={[
          NotificationFilterPanel,
          TrendsBreakingPanel,
          UserSuggestionsPanel,
          LinkFooter,
        ]}
        tabs={tabs}
        actions={[
          {
            icon: 'search',
            to: '/search',
          },
        ]}
      >
        <PageTitle badge={notificationCount} path={title} />
        {children}
      </DefaultLayout>
    )
  }
}

const messages = defineMessages({
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  mention: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
  favourite: { id: 'likes', defaultMessage: 'Likes' },
  reblog: { id: 'reposts', defaultMessage: 'Reposts' },
  poll: { id: 'polls', defaultMessage: 'Poll' },
  follow: { id: 'notifications.filter.follows', defaultMessage: 'Follows' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  all: { id: 'notifications.filter.all', defaultMessage: 'All' },
})

const mapStateToProps = (state) => ({
  selectedFilter: state.getIn(['notifications', 'filter', 'active']),
  notificationCount: state.getIn(['notifications', 'unread']),
  locked: !!state.getIn(['accounts', me, 'locked']),
})

NotificationsPage.contextTypes = {
  router: PropTypes.object.isRequired,
}

NotificationsPage.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  locked: PropTypes.bool,
  notificationCount: PropTypes.number.isRequired,
  selectedFilter: PropTypes.string.isRequired,
}

export default injectIntl(connect(mapStateToProps)(NotificationsPage))