import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchGroup } from '../actions/groups'
import PageTitle from '../features/ui/util/page_title'
import GroupLayout from '../layouts/group_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'

const messages = defineMessages({
	group: { id: 'group', defaultMessage: 'Group' },
})

const mapStateToProps = (state, { params: { id } }) => ({
	group: state.getIn(['groups', id]),
	relationships: state.getIn(['group_relationships', id]),
})

const mapDispatchToProps = (dispatch) => ({
	onFetchGroup(groupId) {
		dispatch(fetchGroup(groupId))
	}
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
		onFetchGroup: PropTypes.func.isRequired,
	}
	
	componentDidMount() {
		console.log("group page mounted:", this.props.params.id)
		this.props.onFetchGroup(this.props.params.id)
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