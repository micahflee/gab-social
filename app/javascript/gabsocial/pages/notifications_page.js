import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { setFilter } from '../actions/notifications'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import NotificationFilterPanel from '../components/panel/notification_filter_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  mentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
  likes: { id: 'likes', defaultMessage: 'Likes' },
  reposts: { id: 'reposts', defaultMessage: 'Reposts' },
  polls: { id: 'polls', defaultMessage: 'Poll' },
  follows: { id: 'notifications.filter.follows', defaultMessage: 'Follows' },
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
    setFilter: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    notificationCount: PropTypes.number.isRequired,
  }

  // : todo : on pop change filter active type

  onClick(notificationType) {
    this.props.setFilter('active', notificationType)
    
    if (notificationType === 'all') {
      this.context.router.history.push('/notifications')
    } else {
      this.context.router.history.push(`/notifications?view=${notificationType}`)
    }
  }

  render() {
    const {
      intl,
      children,
      selectedFilter,
      notificationCount
    } = this.props

    const tabs = [
      {
        title: intl.formatMessage(messages.all),
        onClick: () => this.onClick('all'),
        active: selectedFilter === 'all',
      },
      {
        title: intl.formatMessage(messages.mentions),
        onClick: () => this.onClick('mention'),
        active: selectedFilter === 'mention',
      },
      {
        title: intl.formatMessage(messages.likes),
        onClick: () => this.onClick('favourite'),
        active: selectedFilter === 'favourite',
      },
      {
        title: intl.formatMessage(messages.reposts),
        onClick: () => this.onClick('reblog'),
        active: selectedFilter === 'reblog',
      },
      {
        title: intl.formatMessage(messages.polls),
        onClick: () => this.onClick('poll'),
        active: selectedFilter === 'poll',
      },
      {
        title: intl.formatMessage(messages.follows),
        onClick: () => this.onClick('follow'),
        active: selectedFilter === 'follow',
      },
    ]

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
}