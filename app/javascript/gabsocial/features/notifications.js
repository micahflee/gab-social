import { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage } from 'react-intl'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import {
  expandNotifications,
  scrollTopNotifications,
  dequeueNotifications,
  forceDequeueNotifications,
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

const mapDispatchToProps = (dispatch) => ({
  onDequeueNotifications() {
    dispatch(dequeueNotifications())
  },
  onExpandNotifications(options) {
    if (!options) dispatch(forceDequeueNotifications())
    dispatch(expandNotifications(options))
  },
  onScrollTopNotifications(top) {
    dispatch(scrollTopNotifications(top))
  },
})

export default
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class Notifications extends ImmutablePureComponent {

  static propTypes = {
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    notifications: ImmutablePropTypes.list.isRequired,
    onDequeueNotifications: PropTypes.func.isRequired,
    onExpandNotifications: PropTypes.func.isRequired,
    onScrollTopNotifications: PropTypes.func.isRequired,
    sortedNotifications: ImmutablePropTypes.list.isRequired,
    totalQueuedNotificationsCount: PropTypes.number,
  }

  componentWillUnmount() {
    this.handleLoadOlder.cancel()
    this.handleScrollToTop.cancel()
    this.handleScroll.cancel()
    this.props.onScrollTopNotifications(false)
  }

  componentDidMount() {
    this.handleDequeueNotifications()
    this.props.onScrollTopNotifications(true)
  }

  componentDidUpdate (prevProps) {
    //Check if clicked on "notifications" button, if so, reload
    if (prevProps.location.key !== this.props.location.key &&
        prevProps.location.pathname === '/notifications' &&
        this.props.location.pathname === '/notifications') {
      this.handleReload()
    }
  }

  handleReload = throttle(() => {
    this.props.onExpandNotifications()
  }, 5000)

  handleLoadOlder = debounce(() => {
    const last = this.props.notifications.last()
    this.props.onExpandNotifications({ maxId: last && last.get('id') })
  }, 300, { leading: true })

  handleScrollToTop = debounce(() => {
    this.props.onScrollTopNotifications(true)
  }, 100)

  handleScroll = debounce(() => {
    this.props.onScrollTopNotifications(false)
  }, 100)

  handleDequeueNotifications = () => {
    this.props.onDequeueNotifications()
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
