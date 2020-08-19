import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import isObject from 'lodash.isobject'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import ColumnIndicator from '../components/column_indicator'
import Responsive from './ui/util/responsive_component'
import Bundle from '../features/ui/util/bundle'
import {
	GroupInfoPanel
} from '../features/ui/util/async_components'

class GroupAbout extends ImmutablePureComponent {

	render() {
		const { group } = this.props

		return (
			<div className={[_s.d, _s.w100PC].join(' ')}>
				<Responsive min={BREAKPOINT_EXTRA_SMALL}>
					<ColumnIndicator type='missing' />
				</Responsive>
				<Responsive max={BREAKPOINT_EXTRA_SMALL}>
					<Bundle
						fetchComponent={GroupInfoPanel}
						loading={this.renderLoading}
						error={this.renderError}
						renderDelay={150}
					>
						{
							(Component) => <Component group={group} />
						}
					</Bundle>
				</Responsive>
			</div>
		)
	}

}

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : null
	const group = state.getIn(['groups', groupId])

	return { group }
}

GroupAbout.propTypes = {
	group: ImmutablePropTypes.map,
}

export default connect(mapStateToProps)(GroupAbout)