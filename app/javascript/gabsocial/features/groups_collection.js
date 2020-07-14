import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { fetchGroups } from '../actions/groups'
import Block from '../components/block'
import Button from '../components/button'
import ColumnIndicator from '../components/column_indicator'
import Heading from '../components/heading'
import GroupListItem from '../components/group_list_item'
import Input from '../components/input'

const messages = defineMessages({
	empty: { id: 'groups.empty', defaultMessage: 'There are no groups to display' },
	featured: { id: 'featured', defaultMessage: 'Featured' },
	new: { id: 'new', defaultMessage: 'Just Added' },
	member: { id: 'my_groups', defaultMessage: 'My Groups' },
	admin: { id: 'admin', defaultMessage: 'Admin' },
})

const mapStateToProps = (state, { activeTab }) => ({
	groupIds: state.getIn(['group_lists', activeTab, 'items']),
	isFetched: state.getIn(['group_lists', activeTab, 'isFetched']),
	isLoading: state.getIn(['group_lists', activeTab, 'isLoading']),
})

export default
@injectIntl
@connect(mapStateToProps)
class GroupsCollection extends ImmutablePureComponent {

	static propTypes = {
		activeTab: PropTypes.string.isRequired,
		dispatch: PropTypes.func.isRequired,
		groupIds: ImmutablePropTypes.list,
		intl: PropTypes.object.isRequired,
		isFetched: PropTypes.bool.isRequired,
		isLoading: PropTypes.bool.isRequired,
	}

	state = {
		isSearchVisible: false,
		searchText: '',
	}

	componentWillMount() {
		this.props.dispatch(fetchGroups(this.props.activeTab))
	}

	componentDidUpdate(oldProps) {
		if (this.props.activeTab && this.props.activeTab !== oldProps.activeTab) {
			this.setState({
				isSearchVisible: false,
				searchText: '',
			})
			this.props.dispatch(fetchGroups(this.props.activeTab))
		}
	}

	handleToggleSearch = () => {
		this.setState({ isSearchVisible: !this.state.isSearchVisible })
	}

	handleOnChangeSearch = (value) => {
		this.setState({ searchText: value })
	}

	render() {
		const {
			activeTab,
			groupIds,
			intl,
			isLoading,
			isFetched,
		} = this.props
		const {
			isSearchVisible,
			searchText,
		} = this.state

		if (isLoading && groupIds.size === 0) {
			return <ColumnIndicator type='loading' />
		} else if (isFetched && groupIds.size === 0) {
			return <ColumnIndicator type='error' message={intl.formatMessage(messages.empty)} />
		}

		const isAddable = ['featured', 'new'].indexOf(activeTab) > -1

		return (
			<Block>
				<div className={[_s.default, _s.flexRow, _s.px15, _s.pt10, _s.justifyContentCenter].join(' ')}>
					<div className={[_s.default, _s.flexGrow1, _s.maxWidth80PC, _s.justifyContentCenter, _s.overflowHidden].join(' ')}>
						<Heading size='h2'>
							{intl.formatMessage(messages[activeTab])}
						</Heading>
					</div>
					<div className={[_s.default, _s.flexRow, _s.mlAuto].join(' ')}>
						{
							/*
							<Button
								icon='search'
								className={_s.px10}
								color={isSearchVisible ? 'white' : 'primary'}
								backgroundColor={isSearchVisible ? 'brand' : 'none'}
								iconSize='14px'
								onClick={this.handleToggleSearch}
							/>
							<Button
								icon='sort'
								className={_s.px10}
								color='primary'
								backgroundColor='none'
								iconSize='14px'
							/>
							*/
						}
					</div>
				</div>
				{
					isSearchVisible &&
					<div className={[_s.default, _s.px10, _s.my10].join(' ')}>
						<Input
							onChange={this.handleOnChangeSearch}
							value={searchText}
							prependIcon='search'
						/>
					</div>
				}
				<div className={[_s.default, _s.py10, _s.width100PC].join(' ')}>
					{
						groupIds.map((groupId, i) => (
							<GroupListItem
								isAddable={isAddable}
								key={`group-collection-item-${i}`}
								id={groupId}
								isLast={groupIds.count() - 1 === i}
							/>
						))
					}
				</div>
			</Block>
		)
	}

}