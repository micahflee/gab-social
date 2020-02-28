import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchGroup } from '../actions/groups'
import GroupInfoPanel from '../components/panel/group_info_panel'
import GroupLayout from '../layouts/group_layout'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import LinkFooter from '../components/link_footer'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'

const mapStateToProps = (state, { params: { id } }) => ({
	group: state.getIn(['groups', id]),
	relationships: state.getIn(['group_relationships', id]),
})

export default
@connect(mapStateToProps)
class GroupPage extends ImmutablePureComponent {

	static propTypes = {
		group: ImmutablePropTypes.map,
		relationships: ImmutablePropTypes.map,
		dispatch: PropTypes.func.isRequired,
	}

	componentWillMount() {
		const { params: { id }, dispatch } = this.props

		dispatch(fetchGroup(id))
	}

	render() {
		const { children, group, relationships } = this.props

		// <div className="column-header__wrapper">
		// 	<h1 className="column-header">
		// 		<Link to={`/groups/${id}`} className={classNames('btn grouped active')}>
		// 			{intl.formatMessage(messages.tabLatest)}
		// 		</Link>

		// 		<div className='column-header__buttons'>
		// 			<button
		// 				className={classNames('column-header__button', { 'active': !collapsed })}
		// 				title={intl.formatMessage(collapsed ? messages.show : messages.hide)}
		// 				aria-label={intl.formatMessage(collapsed ? messages.show : messages.hide)}
		// 				aria-pressed={collapsed ? 'false' : 'true'}
		// 				onClick={this.handleToggleClick}
		// 			><Icon id='sliders' /></button>
		// 		</div>
		// 	</h1>
		// 	{!collapsed && <div className='column-header__collapsible'>
		// 		<div className='column-header__collapsible-inner'>
		// 			<div className='column-header__collapsible__extra'>
		// 				<ColumnSettingsContainer />
		// 			</div>
		// 		</div>
		// 	</div>}
		// </div>

		return (
			<GroupLayout
				title={'group name'}
				actions={[
					{
						icon: 'ellipsis',
						onClick: null,
					},
				]}
				layout={(
					<Fragment>
						<GroupInfoPanel />
						<WhoToFollowPanel />
						<LinkFooter />
					</Fragment>
				)}
				showBackBtn
			>
				{
					!!relationships && relationships.get('member') &&
					<Fragment>
						<TimelineComposeBlock size={46} group={group} autoFocus />
						<Divider />
					</Fragment>
				}
				{children}
			</GroupLayout>
		)
	}
}