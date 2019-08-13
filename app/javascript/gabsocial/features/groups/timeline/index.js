import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import StatusListContainer from '../../../containers/status_list_container';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connectGroupStream } from '../../../actions/streaming';
import { expandGroupTimeline } from '../../../actions/timelines';
import ColumnIndicator from '../../../components/column_indicator';
import TimelineComposeBlock from '../../../components/timeline_compose_block';

const mapStateToProps = (state, props) => ({
  group: state.getIn(['groups', props.params.id]),
  relationships: state.getIn(['group_relationships', props.params.id]),
  hasUnread: state.getIn(['timelines', `group:${props.params.id}`, 'unread']) > 0,
});

export default @connect(mapStateToProps)
@injectIntl
class GroupTimeline extends ImmutablePureComponent {

	static contextTypes = {
	  router: PropTypes.object,
	};

	static propTypes = {
	  params: PropTypes.object.isRequired,
	  dispatch: PropTypes.func.isRequired,
	  columnId: PropTypes.string,
	  hasUnread: PropTypes.bool,
	  group: PropTypes.oneOfType([ImmutablePropTypes.map, PropTypes.bool]),
	  relationships: ImmutablePropTypes.map,
	  intl: PropTypes.object.isRequired,
	};

	componentDidMount () {
	  const { dispatch } = this.props;
	  const { id } = this.props.params;

	  dispatch(expandGroupTimeline(id));

	  this.disconnect = dispatch(connectGroupStream(id));
	}

	componentWillUnmount () {
	  if (this.disconnect) {
	    this.disconnect();
	    this.disconnect = null;
	  }
	}

	handleLoadMore = maxId => {
	  const { id } = this.props.params;
	  this.props.dispatch(expandGroupTimeline(id, { maxId }));
	}

	render () {
	  const { columnId, group, relationships } = this.props;
	  const { id } = this.props.params;

	  if (typeof group === 'undefined' || !relationships) {
	    return (<ColumnIndicator type='loading' />);
	  } else if (group === false) {
	    return (<ColumnIndicator type='missing' />);
	  }

	  return (
  		<div>
	      {
					relationships.get('member') &&
					<TimelineComposeBlock size={46} group={group} shouldCondense={true} autoFocus={false} />
	      }

  			<div className='group__feed'>
	        <StatusListContainer
	          scrollKey={`group_timeline-${columnId}`}
	          timelineId={`group:${id}`}
	          onLoadMore={this.handleLoadMore}
	          group={group}
	          withGroupAdmin={relationships && relationships.get('admin')}
	          emptyMessage={<FormattedMessage id='empty_column.group' defaultMessage='There is nothing in this group yet. When members of this group post new statuses, they will appear here.' />}
    			/>
	      </div>
	    </div>
	  );
	}

}
