import { Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { fetchGroup } from '../actions/groups';
import HeaderContainer from '../features/groups/timeline/containers/header_container';
import GroupPanel from '../features/groups/timeline/components/panel';
import GroupSidebarPanel from '../features/groups/sidebar_panel';
import PageLayout from '../components/page_layout';
import { WhoToFollowPanel } from '../components/panel';
import LinkFooter from '../components/link_footer';

const mapStateToProps = (state, { params: { id } }) => ({
	group: state.getIn(['groups', id]),
	relationships: state.getIn(['group_relationships', id]),
});

export default @connect(mapStateToProps)
class GroupPage extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
		relationships: ImmutablePropTypes.map,
		dispatch: PropTypes.func.isRequired,
	};

	componentWillMount() {
		const { params: { id }, dispatch } = this.props;

		dispatch(fetchGroup(id));
	}

	render () {
		const { children, group, relationships } = this.props;
		const top = group ? <HeaderContainer groupId={group.get('id')} /> : null;

		return (
			<PageLayout
				layout={{
					TOP: top,
					RIGHT: (
						<Fragment>
							<GroupSidebarPanel />
							<WhoToFollowPanel />
						</Fragment>
					),
					LEFT: (
						<Fragment>
							{group && relationships &&
								<GroupPanel
									group={group}
									relationships={relationships}
								/>}
							<LinkFooter />
						</Fragment>
					)
				}}
			>
				{children}
			</PageLayout>
		)
	}
}