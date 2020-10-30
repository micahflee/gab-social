import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
import {
  TIMELINE_INJECTION_FEATURED_GROUPS,
  TIMELINE_INJECTION_GROUP_CATEGORIES,
  TIMELINE_INJECTION_USER_SUGGESTIONS,
} from '../constants'
import NotificationContainer from '../containers/notification_container'
import ScrollableList from '../components/scrollable_list'
import TimelineQueueButtonHeader from '../components/timeline_queue_button_header'
import Block from '../components/block'
import Account from '../components/account'
import NotificationPlaceholder from '../components/placeholder/notification_placeholder'
import TimelineInjectionRoot from '../components/timeline_injections/timeline_injection_root'

class Notifications extends ImmutablePureComponent {

  state = {
    changedTabs: false,
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

  componentDidUpdate (prevProps, prevState) {
    //Check if clicked on "notifications" button, if so, reload
    if (prevProps.location.key !== this.props.location.key &&
        prevProps.location.pathname === '/notifications' &&
        this.props.location.pathname === '/notifications') {
      this.handleReload()
    }

    if (prevProps.selectedFilter !== this.props.selectedFilter) {
      this.setState({ changedTabs: true })
    }

    if (prevProps.selectedFilter === this.props.selectedFilter && prevState.changedTabs) {
      this.setState({ changedTabs: false })
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
      notifications,
      sortedNotifications,
      isLoading,
      hasMore,
      totalQueuedNotificationsCount,
      selectedFilter,
    } = this.props
    const { changedTabs } = this.state

    let scrollableContent = null
    let emptyContent = []
    const canShowEmptyContent = !scrollableContent && !isLoading && notifications.size === 0 && selectedFilter === 'all'

    if (isLoading && this.scrollableContent && !changedTabs) {
      scrollableContent = this.scrollableContent
    } else if ((sortedNotifications.size > 0 || hasMore) && selectedFilter !== 'follow' && !changedTabs) {
      scrollableContent = sortedNotifications.map((item, index) => (
        <NotificationContainer
          key={`notification-${index}`}
          notification={item}
        />
      ))
    } else if ((sortedNotifications.size > 0 || hasMore) && selectedFilter === 'follow' && !changedTabs) {      
      const followNotifications = []
      sortedNotifications.forEach((block) => {
        if (block) {
          const followBlock = block.get('follow')
          if (followBlock && followBlock.size > 0) {
            followBlock.forEach((item) => {
              followNotifications.push(item)
            })
          }
        }
      })

      scrollableContent = followNotifications.map((item, index) => {
        return (
          <Account
            compact
            withBio
            key={`account-${index}`}
            id={item.get('account')}
          />
        )
      })
    }

    if (canShowEmptyContent) {
      emptyContent = [
        <TimelineInjectionRoot type={TIMELINE_INJECTION_USER_SUGGESTIONS} key='empty-injection-0' />,
        <TimelineInjectionRoot type={TIMELINE_INJECTION_FEATURED_GROUPS} key='empty-injection-1' />,
        <TimelineInjectionRoot type={TIMELINE_INJECTION_USER_SUGGESTIONS} props={{suggestionType:'verified'}} key='empty-injection-2' />,
        <TimelineInjectionRoot type={TIMELINE_INJECTION_GROUP_CATEGORIES} key='empty-injection-3' />,
      ]
    }


    this.scrollableContent = scrollableContent

    return (
      <React.Fragment>
        <TimelineQueueButtonHeader
          onClick={this.handleDequeueNotifications}
          count={totalQueuedNotificationsCount}
          itemType='notification'
        />
        <Block>
          <ScrollableList
            scrollKey='notifications'
            isLoading={isLoading}
            showLoading={isLoading && sortedNotifications.size === 0 || changedTabs}
            hasMore={hasMore}
            emptyMessage={<FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. Interact with others to start the conversation." />}
            onLoadMore={this.handleLoadOlder}
            onScrollToTop={this.handleScrollToTop}
            onScroll={this.handleScroll}
            placeholderComponent={NotificationPlaceholder}
            placeholderCount={3}
          >
            {scrollableContent}
          </ScrollableList>
        </Block>

        {
          canShowEmptyContent &&
          <div className={[_s.d, _s.mt15, _s.w100PC].join(' ')}>
            {emptyContent}
          </div>
        }
      </React.Fragment>
    )
  }

}

const mapStateToProps = (state) => ({
  notifications: state.getIn(['notifications', 'items']),
  sortedNotifications: state.getIn(['notifications', 'sortedItems']),
  isLoading: state.getIn(['notifications', 'isLoading'], true),
  hasMore: state.getIn(['notifications', 'hasMore']),
  totalQueuedNotificationsCount: state.getIn(['notifications', 'totalQueuedNotificationsCount'], 0),
  selectedFilter: state.getIn(['notifications', 'filter', 'active']),
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

Notifications.propTypes = {
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  notifications: ImmutablePropTypes.list.isRequired,
  onDequeueNotifications: PropTypes.func.isRequired,
  onExpandNotifications: PropTypes.func.isRequired,
  onScrollTopNotifications: PropTypes.func.isRequired,
  sortedNotifications: ImmutablePropTypes.list.isRequired,
  totalQueuedNotificationsCount: PropTypes.number,
  selectedFilter: PropTypes.string.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notifications))