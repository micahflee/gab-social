import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import isObject from 'lodash.isobject'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import ColumnIndicator from '../components/column_indicator'
import Responsive from './ui/util/responsive_component'
import GroupInfoPanel from '../components/panel/group_info_panel'

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : null
	const group = state.getIn(['groups', groupId])

	return { group }
}

export default
@connect(mapStateToProps)
class GroupAbout extends ImmutablePureComponent {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		group: ImmutablePropTypes.map,
	}

	render() {
		const { group } = this.props

		return (
			<div className={[_s.default, _s.width100PC].join(' ')}>
				<Responsive min={BREAKPOINT_EXTRA_SMALL}>
					<ColumnIndicator type='missing' />
				</Responsive>
				<Responsive max={BREAKPOINT_EXTRA_SMALL}>
					<GroupInfoPanel group={group} />
				</Responsive>
			</div>
		)
	}

}
