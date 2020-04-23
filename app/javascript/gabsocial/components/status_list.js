import { Fragment } from 'react';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { createSelector } from 'reselect';
import sample from 'lodash.sample';
import debounce from 'lodash.debounce'
import { me, promotions } from '../initial_state';
import { dequeueTimeline } from '../actions/timelines';
import { scrollTopTimeline } from '../actions/timelines';
import { fetchStatus } from '../actions/statuses';
import StatusContainer from '../containers/status_container';
import ScrollableList from './scrollable_list';
import TimelineQueueButtonHeader from './timeline_queue_button_header';
import ColumnIndicator from './column_indicator';

const makeGetStatusIds = () => createSelector([
  (state, { type, id }) => state.getIn(['settings', type], ImmutableMap()),
  (state, { type, id }) => state.getIn(['timelines', id, 'items'], ImmutableList()),
  (state)           => state.get('statuses'),
], (columnSettings, statusIds, statuses) => {
  return statusIds.filter(id => {
    if (id === null) return true;

    const statusForId = statuses.get(id);
    let showStatus    = true;

    if (columnSettings.getIn(['shows', 'reblog']) === false) {
      showStatus = showStatus && statusForId.get('reblog') === null;
    }

    if (columnSettings.getIn(['shows', 'reply']) === false) {
      showStatus = showStatus && (statusForId.get('in_reply_to_id') === null || statusForId.get('in_reply_to_account_id') === me);
    }

    return showStatus;
  });
});

const mapStateToProps = (state, { timelineId }) => {
  if (!timelineId) return {}
  
  const getStatusIds = makeGetStatusIds();
  const promotion = promotions.length > 0 && sample(promotions.filter(p => p.timeline_id === timelineId));

  return {
    statusIds: getStatusIds(state, { type: timelineId.substring(0,5) === 'group' ? 'group' : timelineId, id: timelineId }),
    isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
    isPartial: state.getIn(['timelines', timelineId, 'isPartial'], false),
    hasMore: state.getIn(['timelines', timelineId, 'hasMore']),
    totalQueuedItemsCount: state.getIn(['timelines', timelineId, 'totalQueuedItemsCount']),
    promotion: promotion,
    promotedStatus: promotion && state.getIn(['statuses', promotion.status_id])
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDequeueTimeline(timelineId) {
    dispatch(dequeueTimeline(timelineId, ownProps.onLoadMore));
  },
  onScrollToTop: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, true));
  }, 100),
  onScroll: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, false));
  }, 100),
  fetchStatus(id) {
    dispatch(fetchStatus(id));
  }
});

export default
@connect(mapStateToProps, mapDispatchToProps)
class StatusList extends ImmutablePureComponent {

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    featuredStatusIds: ImmutablePropTypes.list,
    onLoadMore: PropTypes.func,
    isLoading: PropTypes.bool,
    isPartial: PropTypes.bool,
    hasMore: PropTypes.bool,
    emptyMessage: PropTypes.string,
    timelineId: PropTypes.string,
    queuedItemSize: PropTypes.number,
    onDequeueTimeline: PropTypes.func,
    group: ImmutablePropTypes.map,
    withGroupAdmin: PropTypes.bool,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    promotion: PropTypes.object, // : todo :
    promotedStatus: ImmutablePropTypes.map,
    fetchStatus: PropTypes.func,
  };

  componentDidMount() {
    this.handleDequeueTimeline();
    this.fetchPromotedStatus();
  };

  fetchPromotedStatus() {
    const { promotion, promotedStatus, fetchStatus } = this.props;

    if (promotion && !promotedStatus) {
      fetchStatus(promotion.status_id);
    }
  }

  getFeaturedStatusCount = () => {
    return this.props.featuredStatusIds ? this.props.featuredStatusIds.size : 0;
  }

  getCurrentStatusIndex = (id, featured) => {
    if (featured) {
      return this.props.featuredStatusIds.indexOf(id);
    }

    return this.props.statusIds.indexOf(id) + this.getFeaturedStatusCount();
  }

  handleMoveUp = (id, featured) => {
    const elementIndex = this.getCurrentStatusIndex(id, featured) - 1;
    this._selectChild(elementIndex, true);
  }

  handleMoveDown = (id, featured) => {
    const elementIndex = this.getCurrentStatusIndex(id, featured) + 1;
    this._selectChild(elementIndex, false);
  }

  handleLoadOlder = debounce(() => {
    this.props.onLoadMore(this.props.statusIds.size > 0 ? this.props.statusIds.last() : undefined);
  }, 300, { leading: true })

  _selectChild (index, align_top) {
    const container = this.node.node;
    const element = container.querySelector(`article:nth-of-type(${index + 1}) .focusable`);

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true);
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false);
      }
      element.focus();
    }
  }

  handleDequeueTimeline = () => {
    const { onDequeueTimeline, timelineId } = this.props;
    if (!onDequeueTimeline || !timelineId) return;

    onDequeueTimeline(timelineId);
  }

  setRef = c => {
    this.node = c;
  }

  render () {
    const { statusIds, featuredStatusIds, onLoadMore, timelineId, totalQueuedItemsCount, isLoading, isPartial, withGroupAdmin, group, promotion, promotedStatus, ...other }  = this.props;

    if (isPartial) {
      return <ColumnIndicator type='loading' />
    }

    let scrollableContent = (isLoading || statusIds.size > 0) ? (
      statusIds.map((statusId, index) => statusId === null ? (
        <div
          key={'gap:' + statusIds.get(index + 1)}
          disabled={isLoading}
          maxId={index > 0 ? statusIds.get(index - 1) : null}
          onClick={onLoadMore}
        />
      ) : (
        <StatusContainer
          key={statusId}
          id={statusId}
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
          contextType={timelineId}
          // : todo :
          // group={group}
          // withGroupAdmin={withGroupAdmin}
          commentsLimited
        />
      ))
    ) : null;

    if (scrollableContent && featuredStatusIds) {
      scrollableContent = featuredStatusIds.map(statusId => (
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

    return (
      <Fragment>
        <TimelineQueueButtonHeader
          onClick={this.handleDequeueTimeline}
          count={totalQueuedItemsCount}
          itemType='gab'
        />
        <ScrollableList
          ref={this.setRef}
          isLoading={isLoading}
          showLoading={isLoading && statusIds.size === 0}
          onLoadMore={onLoadMore && this.handleLoadOlder}
          {...other}
        >
          {scrollableContent}
        </ScrollableList>
      </Fragment>
    );
  }

}
