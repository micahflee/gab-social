import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map as ImmutableMap, List as ImmutableList, is } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { createSelector } from 'reselect'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import { getPromotions } from '../selectors'
import {
  TIMELINE_INJECTION_FEATURED_GROUPS,
  TIMELINE_INJECTION_GROUP_CATEGORIES,
  TIMELINE_INJECTION_USER_SUGGESTIONS,
} from '../constants'
import {
  dequeueTimeline,
  scrollTopTimeline,
  forceDequeueTimeline,
} from '../actions/timelines'
import { showTimelineInjection } from '../actions/timeline_injections'
import { fetchStatus, fetchContext } from '../actions/statuses'
import StatusContainer from '../containers/status_container'
import StatusPlaceholder from './placeholder/status_placeholder'
import ScrollableList from './scrollable_list'
import TimelineQueueButtonHeader from './timeline_queue_button_header'
import TimelineInjectionBase from './timeline_injections/timeline_injection_base'
import TimelineInjectionRoot from './timeline_injections/timeline_injection_root'
import PullToRefresher from './pull_to_refresher'

class StatusList extends ImmutablePureComponent {

  state = {
    isRefreshing: false,
    fetchedContext: false,
  }

  componentDidMount() {
    this.handleDequeueTimeline()
    this.fetchPromotedStatus()
  }

  fetchPromotedStatus() {
    const {
      onFetchStatus,
      promotedStatuses,
      timelineId,
      statusIds,
      promotions,
    } = this.props
  
    if (!!promotions && promotions.count() > 0) {
      promotions.forEach((promotion) => {
        
        if (promotion.get('timeline_id') === timelineId &&
            statusIds.count() >= promotion.get('position') &&
            !promotedStatuses[promotion.get('status_id')]) {
          onFetchStatus(promotion.get('status_id'))
        }

      })
    }
  }
   
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isRefreshing) {
      this.setState({ isRefreshing: false })
      this.props.onForceDequeueTimeline(this.props.timelineId)
    }

    if (prevProps.statusIds.count() < this.props.statusIds.count()) {
      this.fetchPromotedStatus()
    }
  }

  fetchContextsForInitialStatuses = (statusIds) => {
    for (let i = 0; i < statusIds.length; i++) {
      const statusId = statusIds[i]
      this.props.onFetchContext(statusId)
    }
    this.setState({ fetchedContext: true })
  }

  getFeaturedStatusCount = () => {
    if (!!this.props.groupPinnedStatusIds) {
      return this.props.groupPinnedStatusIds.size
    }

    return this.props.featuredStatusIds ? this.props.featuredStatusIds.size : 0
  }

  getCurrentStatusIndex = (id, featured) => {
    if (featured) {
      if (!!this.props.groupPinnedStatusIds) {
        return this.props.groupPinnedStatusIds.indexOf(id)  
      }
      return this.props.featuredStatusIds.indexOf(id)
    }

    return this.props.statusIds.indexOf(id) + this.getFeaturedStatusCount()
  }

  handleMoveUp = (id, featured) => {
    const elementIndex = this.getCurrentStatusIndex(id, featured) - 1
    this._selectChild(elementIndex, true)
  }

  handleMoveDown = (id, featured) => {
    const elementIndex = this.getCurrentStatusIndex(id, featured) + 1
    this._selectChild(elementIndex, false)
  }

  handleLoadOlder = debounce(() => {
    this.props.onLoadMore(this.props.statusIds.size > 0 ? this.props.statusIds.last() : undefined)
  }, 300, { leading: true })

  handleOnReload = debounce(() => {
    this.props.onLoadMore()
    this.setState({ isRefreshing: true })
  }, 300, { trailing: true })

  _selectChild(index, align_top) {
    const container = this.node.node
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

  handleDequeueTimeline = () => {
    const { onDequeueTimeline, timelineId } = this.props
    if (!onDequeueTimeline || !timelineId) return

    onDequeueTimeline(timelineId)
  }

  setRef = c => {
    this.node = c
  }

  render() {
    const {
      statusIds,
      featuredStatusIds,
      groupPinnedStatusIds,
      onLoadMore,
      timelineId,
      totalQueuedItemsCount,
      isLoading,
      isPartial,
      promotedStatuses,
      scrollKey,
      hasMore,
      emptyMessage,
      onScrollToTop,
      onScroll,
      promotions,
    } = this.props
    const { fetchedContext, isRefreshing } = this.state

    if (isPartial || (isLoading && statusIds.size === 0)) {
      return (
        <React.Fragment>
          <StatusPlaceholder />
          <StatusPlaceholder />
          <StatusPlaceholder />
        </React.Fragment>
      )
    }

    // : hack :
    // if index is 0 or 1 and is comment, preload context
    if (statusIds && !fetchedContext) {
      const firstStatusId = statusIds.get(0)
      const secondStatusId = statusIds.get(1)
      let arr = []

      if (!!firstStatusId) arr.push(firstStatusId)
      if (!!secondStatusId) arr.push(secondStatusId)
      if (arr.length > 0) this.fetchContextsForInitialStatuses(arr)
    }

    let scrollableContent = []
    let emptyContent = []
    const canShowEmptyContent = scrollableContent.length === 0 && statusIds.size === 0 && scrollKey === 'home_timeline'
    
    if (isLoading || statusIds.size > 0) {
      for (let i = 0; i < statusIds.count(); i++) {
        const statusId = statusIds.get(i)
        if (!statusId) {
          scrollableContent.push(
            <div
              key={'gap:' + statusIds.get(i + 1)}
              disabled={isLoading}
              maxId={i > 0 ? statusIds.get(i - 1) : null}
              onClick={onLoadMore}
            />
          )
        } else {
          if (!!promotions && promotions.count() > 0) {
            const promotion = promotions.find((p) => (p.get('position') === i && p.get('timeline_id') === timelineId))
            if (promotion) {
              scrollableContent.push(
                <StatusContainer
                  key={`promotion-${i}-${promotion.get('status_id')}`}
                  id={promotion.get('status_id')}
                  onMoveUp={this.handleMoveUp}
                  onMoveDown={this.handleMoveDown}
                  contextType={timelineId}
                  commentsLimited
                  isPromoted
                />
              )
            }
          }
          
          if (i % 7 === 0 && i !== 0 && scrollKey === 'home_timeline') {
            scrollableContent.push(
              <TimelineInjectionBase index={i} key={`timeline-injection-${i}`} />
            )
          }

          scrollableContent.push(
            <StatusContainer
              key={`${statusId}-${i}`}
              id={statusId}
              onMoveUp={this.handleMoveUp}
              onMoveDown={this.handleMoveDown}
              contextType={timelineId}
              commentsLimited
            />
          )
        }
        
      }
    }

    if (scrollableContent && featuredStatusIds) {
      scrollableContent = featuredStatusIds.map((statusId) => (
        <StatusContainer
          key={`f-${statusId}`}
          id={statusId}
          isFeatured
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
          contextType={timelineId}
          commentsLimited
        />
      )).concat(scrollableContent)
    }

    if (scrollableContent && groupPinnedStatusIds) {
      scrollableContent = groupPinnedStatusIds.map((statusId) => (
        <StatusContainer
          key={`f-${statusId}`}
          id={statusId}
          isPinnedInGroup
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
          contextType={timelineId}
          commentsLimited
        />
      )).concat(scrollableContent)
    }

    if (canShowEmptyContent) {
      emptyContent = [
        <TimelineInjectionRoot type={TIMELINE_INJECTION_USER_SUGGESTIONS} key='empty-injection-0' />,
        <TimelineInjectionRoot type={TIMELINE_INJECTION_FEATURED_GROUPS} key='empty-injection-1' />,
        <TimelineInjectionRoot type={TIMELINE_INJECTION_USER_SUGGESTIONS} props={{suggestionType:'verified'}} key='empty-injection-2' />,
        <TimelineInjectionRoot type={TIMELINE_INJECTION_GROUP_CATEGORIES} key='empty-injection-3' />,
      ]
    }

    return (
      <React.Fragment>
        <TimelineQueueButtonHeader
          onClick={this.handleDequeueTimeline}
          count={totalQueuedItemsCount}
          itemType='gab'
        />
        <PullToRefresher
          onRefresh={this.handleOnReload}
          hasMore={hasMore}
        />
        <ScrollableList
          ref={this.setRef}
          isLoading={isLoading || isRefreshing}
          showLoading={isRefreshing || (isLoading && statusIds.size === 0)}
          onLoadMore={onLoadMore && this.handleLoadOlder}
          placeholderComponent={StatusPlaceholder}
          placeholderCount={1}
          scrollKey={scrollKey}
          hasMore={hasMore}
          emptyMessage={emptyMessage}
          onScrollToTop={onScrollToTop}
          onScroll={onScroll}
        >
          {scrollableContent}
        </ScrollableList>
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

const makeGetStatusIds = () => createSelector([
  (state, { type, id }) => state.getIn(['settings', type], ImmutableMap()),
  (state, { type, id }) => state.getIn(['timelines', id, 'items'], ImmutableList()),
  (state) => state.get('statuses'),
], (columnSettings, statusIds, statuses) => {
  return statusIds.filter(id => {
    if (id === null) return true

    const statusForId = statuses.get(id)
    let showStatus = true

    if (columnSettings.getIn(['shows', 'reblog']) === false) {
      showStatus = showStatus && statusForId.get('reblog') === null
    }

    if (columnSettings.getIn(['shows', 'reply']) === false) {
      showStatus = showStatus && (statusForId.get('in_reply_to_id') === null || statusForId.get('in_reply_to_account_id') === me)
    }

    return showStatus
  })
})

const mapStateToProps = (state, { timelineId }) => {
  if (!timelineId) return {}

  const getStatusIds = makeGetStatusIds()
  const promotions = getPromotions()(state)

  const statusIds = getStatusIds(state, {
    type: timelineId.substring(0, 5) === 'group' ? 'group' : timelineId,
    id: timelineId
  })

  const promotedStatuses = (!!promotions && promotions.count() > 0) ?
    promotions.map((promotion) => {
      const s = {}
      s[promotion.get('status_id')] = state.getIn(['statuses', promotion.get('status_id')])
      return s
    }) : []


  return {
    statusIds,
    promotions,
    promotedStatuses,
    isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
    isPartial: state.getIn(['timelines', timelineId, 'isPartial'], false),
    hasMore: state.getIn(['timelines', timelineId, 'hasMore']),
    totalQueuedItemsCount: state.getIn(['timelines', timelineId, 'totalQueuedItemsCount']),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onForceDequeueTimeline(timelineId) {
    dispatch(forceDequeueTimeline(timelineId))
  },
  onDequeueTimeline(timelineId) {
    dispatch(dequeueTimeline(timelineId, ownProps.onLoadMore))
  },
  onScrollToTop: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, true))
  }, 100),
  onScroll: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, false))
  }, 100),
  onFetchContext(statusId) {
    dispatch(fetchContext(statusId, true))
  },
  onFetchStatus(statusId) {
    dispatch(fetchStatus(statusId))
  },
})

StatusList.propTypes = {
  scrollKey: PropTypes.string.isRequired,
  statusIds: ImmutablePropTypes.list.isRequired,
  featuredStatusIds: ImmutablePropTypes.list,
  groupPinnedStatusIds: ImmutablePropTypes.list,
  onLoadMore: PropTypes.func,
  isLoading: PropTypes.bool,
  isPartial: PropTypes.bool,
  hasMore: PropTypes.bool,
  emptyMessage: PropTypes.string,
  timelineId: PropTypes.string,
  queuedItemSize: PropTypes.number,
  onDequeueTimeline: PropTypes.func.isRequired,
  onClearTimeline: PropTypes.func.isRequired,
  onScrollToTop: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  onFetchContext: PropTypes.func.isRequired,
  onFetchStatus: PropTypes.func.isRequired,
  promotedStatuses: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusList)