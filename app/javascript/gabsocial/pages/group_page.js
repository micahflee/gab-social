import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchGroup } from '../actions/groups'
import PageTitle from '../features/ui/util/page_title'
import GroupInfoPanel from '../components/panel/group_info_panel'
import GroupLayout from '../layouts/group_layout'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import GroupSidebarPanel from '../components/panel/groups_panel'
import LinkFooter from '../components/link_footer'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'

const messages = defineMessages({
	group: { id: 'group', defaultMessage: 'Group' },
})

const mapStateToProps = (state, { params: { id } }) => ({
	group: state.getIn(['groups', id]),
	relationships: state.getIn(['group_relationships', id]),
})

const mapDispatchToProps = () => ({
	fetchGroup,
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupPage extends ImmutablePureComponent {

	static propTypes = {
		intl: PropTypes.object.isRequired,
		group: ImmutablePropTypes.map,
		children: PropTypes.node.isRequired,
		relationships: ImmutablePropTypes.map,
		fetchGroup: PropTypes.func.isRequired,
	}
	
	componentDidMount() {
		this.props.fetchGroup(this.props.params.id)
	}

	render() {
		const {
			intl,
			children,
			group,
			relationships,
		} = this.props

		const groupTitle = !!group ? group.get('title') : ''

		return (
			<GroupLayout
				showBackBtn
				title={intl.formatMessage(messages.group)}
				group={group}
				relationships={relationships}
				actions={[
					// : todo :
					// {
					// 	icon: 'ellipsis',
					// 	onClick: null,
					// },
				]}
				layout={(
					<Fragment>
						<GroupInfoPanel group={group} />
						<WhoToFollowPanel />
						<GroupSidebarPanel isSlim />
						<LinkFooter />
					</Fragment>
				)}
			>
				<PageTitle path={[groupTitle, intl.formatMessage(messages.group)]} />

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