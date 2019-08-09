import FilterBar from '../components/notification_filter_bar/notification_filter_bar';
import { setFilter } from '../../../actions/notifications';

const makeMapStateToProps = state => ({
  selectedFilter: state.getIn(['settings', 'notifications', 'quickFilter', 'active']),
  advancedMode: state.getIn(['settings', 'notifications', 'quickFilter', 'advanced']),
});

const mapDispatchToProps = (dispatch) => ({
  selectFilter (newActiveFilter) {
    dispatch(setFilter(newActiveFilter));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(FilterBar);
