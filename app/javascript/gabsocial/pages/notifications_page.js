import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl';
import { setFilter } from '../actions/notifications'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import NotificationFilterPanel from '../components/panel/notification_filter_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  mentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
  favorites: { id: 'notifications.filter.favorites', defaultMessage: 'Favorites' },
  boosts: { id: 'notifications.filter.boosts', defaultMessage: 'Reposts' },
  polls: { id: 'notifications.filter.polls', defaultMessage: 'Poll results' },
  follows: { id: 'notifications.filter.follows', defaultMessage: 'Follows' },
  filterAll: { id: 'notifications.filter.all', defaultMessage: 'All' },
  filterMentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
});

const makeMapStateToProps = state => ({
  selectedFilter: state.getIn(['notifications', 'filter', 'active']),
});

const mapDispatchToProps = (dispatch) => ({
  selectFilter(value) {
    dispatch(setFilter('active', value))
  },
});

export default
@injectIntl
@connect(makeMapStateToProps, mapDispatchToProps)
class NotificationsPage extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    selectFilter: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    document.title = 'Notifications - Gab'
  }

  // : todo : on pop change filter active type

  onClick(notificationType) {
    this.props.selectFilter(notificationType)
    
    if (notificationType === 'all') {
      this.context.router.history.push('/notifications')
    } else {
      this.context.router.history.push(`/notifications?only=${notificationType}`)
    }
  }

  render() {
    const { children, selectedFilter } = this.props

    console.log("selectedFilter:", selectedFilter)

    const tabs = [
      {
        title: 'All',
        onClick: () => this.onClick('all'),
        active: selectedFilter === 'all',
      },
      {
        title: 'Mentions',
        onClick: () => this.onClick('mention'),
        active: selectedFilter === 'mention',
      },
      {
        title: 'Likes',
        onClick: () => this.onClick('favourite'),
        active: selectedFilter === 'favourite',
      },
      {
        title: 'Reposts',
        onClick: () => this.onClick('reblog'),
        active: selectedFilter === 'reblog',
      },
      {
        title: 'Polls',
        onClick: () => this.onClick('poll'),
        active: selectedFilter === 'poll',
      },
      {
        title: 'Follows',
        onClick: () => this.onClick('follow'),
        active: selectedFilter === 'follow',
      },
    ]

    return (
      <DefaultLayout
        title='Notifications'
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
        {children}
      </DefaultLayout>
    )
  }
}