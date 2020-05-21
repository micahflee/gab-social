import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage } from 'react-intl'
import debounce from 'lodash.debounce'
import {
  expandNotifications,
  scrollTopNotifications,
  dequeueNotifications,
} from '../actions/notifications'
import NotificationContainer from '../containers/notification_container'
import ScrollableList from '../components/scrollable_list'
import TimelineQueueButtonHeader from '../components/timeline_queue_button_header'
import Block from '../components/block'

const mapStateToProps = (state) => ({
  notifications: state.getIn(['notifications', 'items']),
  sortedNotifications: state.getIn(['notifications', 'sortedItems']),
  isLoading: state.getIn(['notifications', 'isLoading'], true),
  hasMore: state.getIn(['notifications', 'hasMore']),
  totalQueuedNotificationsCount: state.getIn(['notifications', 'totalQueuedNotificationsCount'], 0),
})

export default
@connect(mapStateToProps)
class Notifications extends ImmutablePureComponent {

  static propTypes = {
    sortedNotifications: ImmutablePropTypes.list.isRequired,
    notifications: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    dequeueNotifications: PropTypes.func,
    totalQueuedNotificationsCount: PropTypes.number,
  }

  componentWillUnmount() {
    this.handleLoadOlder.cancel()
    this.handleScrollToTop.cancel()
    this.handleScroll.cancel()
    this.props.dispatch(scrollTopNotifications(false))
  }

  componentDidMount() {
    this.handleDequeueNotifications()
    this.props.dispatch(scrollTopNotifications(true))
  }

  handleLoadOlder = debounce(() => {
    const last = this.props.notifications.last()
    this.props.dispatch(expandNotifications({ maxId: last && last.get('id') }))
  }, 300, { leading: true })

  handleScrollToTop = debounce(() => {
    this.props.dispatch(scrollTopNotifications(true))
  }, 100)

  handleScroll = debounce(() => {
    this.props.dispatch(scrollTopNotifications(false))
  }, 100)

  handleDequeueNotifications = () => {
    this.props.dispatch(dequeueNotifications())
  }

  render() {
    const {
      sortedNotifications,
      isLoading,
      hasMore,
      totalQueuedNotificationsCount,
    } = this.props

    let scrollableContent = null

    // : todo : include follow requests

    if (isLoading && this.scrollableContent) {
      scrollableContent = this.scrollableContent
    } else if (sortedNotifications.size > 0 || hasMore) {
      scrollableContent = sortedNotifications.map((item, index) => (
        <NotificationContainer
          key={`notification-${index}`}
          notification={item}
        />
      ))
    }

    this.scrollableContent = scrollableContent

    return (
      <Fragment>
        <TimelineQueueButtonHeader
          onClick={this.handleDequeueNotifications}
          count={totalQueuedNotificationsCount}
          itemType='notification'
        />
        <Block>
          <ScrollableList
            scrollKey='notifications'
            isLoading={isLoading}
            showLoading={isLoading && sortedNotifications.size === 0}
            hasMore={hasMore}
            emptyMessage={<FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. Interact with others to start the conversation." />}
            onLoadMore={this.handleLoadOlder}
            onScrollToTop={this.handleScrollToTop}
            onScroll={this.handleScroll}
          >
            {scrollableContent}
          </ScrollableList>
        </Block>
      </Fragment>
    )
  }

}
