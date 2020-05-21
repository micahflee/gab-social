import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { setFilter } from '../actions/notifications'
import { NOTIFICATION_FILTERS } from '../constants'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import NotificationFilterPanel from '../components/panel/notification_filter_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

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
})

const mapDispatchToProps = (dispatch) => ({
  setFilter(value) {
    dispatch(setFilter('active', value))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class NotificationsPage extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    intl: PropTypes.object.isRequired,
    notificationCount: PropTypes.number.isRequired,
    setFilter: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
  }

  onChangeActiveFilter(notificationType) {
    this.props.setFilter(notificationType)
    
    if (notificationType === 'all') {
      this.context.router.history.push('/notifications')
    } else {
      this.context.router.history.push(`/notifications?view=${notificationType}`)
    }
  }

  render() {
    const {
      children,
      intl,
      notificationCount,
      selectedFilter,
    } = this.props

    const tabs = NOTIFICATION_FILTERS.map((filter) => ({ 
      title: intl.formatMessage(messages[filter]),
      onClick: () => this.onChangeActiveFilter(filter),
      active: selectedFilter.toLowerCase() === filter.toLowerCase(),
    }))

    return (
      <DefaultLayout
        title={intl.formatMessage(messages.notifications)}
        layout={(
          <Fragment>
            <NotificationFilterPanel />
            <TrendsPanel />
            <WhoToFollowPanel />
            <LinkFooter />
          </Fragment>
        )}
        tabs={tabs}
      >
        <PageTitle
          badge={notificationCount}
          path={intl.formatMessage(messages.notifications)}
        />
        {children}
      </DefaultLayout>
    )
  }
}{}