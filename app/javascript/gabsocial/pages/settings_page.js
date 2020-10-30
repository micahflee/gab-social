import React from 'react'
import PropTypes from 'prop-types'
import SettingsLayout from '../layouts/settings_layout'

class SettingsPage extends React.PureComponent {
	
	render() {
		const { children, title } = this.props

		return (
			<SettingsLayout title={title}>
				{children}
			</SettingsLayout>
		)
	}

}

SettingsPage.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string,
}

export default SettingsPage