
import { defineMessages, injectIntl } from 'react-intl'
import { setFilter } from '../actions/notifications'
import { me } from '../initial_state'
import { NOTIFICATION_FILTERS } from '../constants'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  NotificationFilterPanel,
  TrendsPanel,
  WhoToFollowPanel,
} from '../features/ui/util/async_components'

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
    locked: PropTypes.bool,
  }

  onChangeActiveFilter(notificationType) {
    this.props.setFilter(notificationType)
    
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
      notificationCount,
      selectedFilter,
      locked
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

    return (
      <DefaultLayout
        title={intl.formatMessage(messages.notifications)}
        page='notifications'
        layout={[
          NotificationFilterPanel,
          TrendsPanel,
          WhoToFollowPanel,
          LinkFooter,
        ]}
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