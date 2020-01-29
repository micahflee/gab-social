import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { connectGroupStream } from '../../../actions/streaming';
import { expandGroupTimeline } from '../../../actions/timelines';
import StatusListContainer from '../../../containers/status_list_container';
import ColumnSettingsContainer from './containers/column_settings_container';
import Icon from '../../../components/icon';

const messages = defineMessages({
  tabLatest: { id: 'group.timeline.tab_latest', defaultMessage: 'Latest' },
  show: { id: 'group.timeline.show_settings', defaultMessage: 'Show settings' },
  hide: { id: 'group.timeline.hide_settings', defaultMessage: 'Hide settings' },
});

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

	state = {
		collapsed: true,
	}

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

	handleToggleClick = (e) => {
		e.stopPropagation();
		this.setState({ collapsed: !this.state.collapsed });
	  }

	render () {
		const { columnId, group, relationships, account, intl } = this.props;
		const { collapsed } = this.state;
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
					<div className="column-header__wrapper">
						<h1 className="column-header">
							<Link to={`/groups/${id}`} className={classNames('btn grouped active')}>
								{intl.formatMessage(messages.tabLatest)}
							</Link>

							<div className='column-header__buttons'>
								<button
									className={classNames('column-header__button', { 'active': !collapsed })} 
									title={intl.formatMessage(collapsed ? messages.show : messages.hide)}
									aria-label={intl.formatMessage(collapsed ? messages.show : messages.hide)}
									aria-pressed={collapsed ? 'false' : 'true'}
									onClick={this.handleToggleClick}
								><Icon id='sliders' /></button>
							</div>
						</h1>
						{!collapsed && <div className='column-header__collapsible'>
							<div className='column-header__collapsible-inner'>
								<div className='column-header__collapsible__extra'>
									<ColumnSettingsContainer />
								</div>
							</div>
						</div>}
					</div>

					<StatusListContainer
						alwaysPrepend
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
