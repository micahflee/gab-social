import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import { createSelector } from 'reselect'
import { List as ImmutableList } from 'immutable'
import debounce from 'lodash.debounce'
import {
  expandNotifications,
  scrollTopNotifications,
  dequeueNotifications,
} from '../actions/notifications'
import NotificationContainer from '../containers/notification_container'
// import ColumnSettingsContainer from './containers/column_settings_container'
import ScrollableList from '../components/scrollable_list'
import LoadMore from '../components/load_more'
import TimelineQueueButtonHeader from  '../components/timeline_queue_button_header'
import Block from  '../components/block'

const mapStateToProps = (state) => ({
  notifications: state.getIn(['notifications', 'items']),
  isLoading: state.getIn(['notifications', 'isLoading'], true),
  isUnread: state.getIn(['notifications', 'unread']) > 0,
  hasMore: state.getIn(['notifications', 'hasMore']),
  totalQueuedNotificationsCount: state.getIn(['notifications', 'totalQueuedNotificationsCount'], 0),
})

export default
@connect(mapStateToProps)
@injectIntl
class Notifications extends ImmutablePureComponent {

  static propTypes = {
    notifications: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    isUnread: PropTypes.bool,
    hasMore: PropTypes.bool,
    dequeueNotifications: PropTypes.func,
    totalQueuedNotificationsCount: PropTypes.number,
  }

  componentWillUnmount () {
    this.handleLoadOlder.cancel()
    this.handleScrollToTop.cancel()
    this.handleScroll.cancel()
    this.props.dispatch(scrollTopNotifications(false))
  }

  componentDidMount() {
    this.handleDequeueNotifications()
    this.props.dispatch(scrollTopNotifications(true))
  }

  handleLoadGap = (maxId) => {
    // maxId={index > 0 ? notifications.getIn([index - 1, 'id']) : null}
    // this.props.dispatch(expandNotifications({ maxId }))
  }

  handleLoadOlder = debounce(() => {
    const last = this.props.notifications.last()
    // this.props.dispatch(expandNotifications({ maxId: last && last.get('id') }))
  }, 300, { leading: true })

  handleScrollToTop = debounce(() => {
    this.props.dispatch(scrollTopNotifications(true))
  }, 100)

  handleScroll = debounce(() => {
    this.props.dispatch(scrollTopNotifications(false))
  }, 100)

  setColumnRef = c => {
    this.column = c
  }

  handleMoveUp = id => {
    const elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) - 1
    this._selectChild(elementIndex, true)
  }

  handleMoveDown = id => {
    const elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) + 1
    this._selectChild(elementIndex, false)
  }

  _selectChild (index, align_top) {
    const container = this.column.node
    const element = container.querySelector(`article:nth-of-type(${index + 1}) .focusable`)

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true)
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false)
      }
      element.focus()
    }
  }

  handleDequeueNotifications = () => {
    this.props.dispatch(dequeueNotifications())
  }

  render () {
    const {
      intl,
      notifications,
      isLoading,
      isUnread,
      hasMore,
      totalQueuedNotificationsCount
    } = this.props

    let scrollableContent = null

    // : todo : include follow requests

    // console.log('--0--notifications:', hasMore)

    if (isLoading && this.scrollableContent) {
      scrollableContent = this.scrollableContent
    } else if (notifications.size > 0 || hasMore) {
      scrollableContent = notifications.map((item, index) => item === null ? (
        <LoadMore disabled={isLoading} onClick={this.handleLoadGap} />
      ) : (
        <NotificationContainer
          key={`notification-${index}`}
          notification={item}
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
        />
      ))
    } else {
      scrollableContent = null
    }

    this.scrollableContent = scrollableContent

    return (
      <div ref={this.setColumnRef}>

        <TimelineQueueButtonHeader
          onClick={this.handleDequeueNotifications}
          count={totalQueuedNotificationsCount}
          itemType='notification'
        />

        <Block>
          <ScrollableList
            scrollKey='notifications'
            isLoading={isLoading}
            showLoading={isLoading && notifications.size === 0}
            hasMore={hasMore}
            emptyMessage={<FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. Interact with others to start the conversation." />}
            onLoadMore={this.handleLoadOlder}
            onScrollToTop={this.handleScrollToTop}
            onScroll={this.handleScroll}
          >
            { scrollableContent }
          </ScrollableList>
        </Block>
      </div>
    )
  }

}
