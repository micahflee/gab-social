import React from 'react'
import SettingsLayout from '../layouts/settings_layout'

class SettingsPage extends React.PureComponent {
	
	render() {
		const {
			children,
			tabs,
			title,
		} = this.props

		return (
			<SettingsLayout
				title={title}
				tabs={tabs}
			>
				{children}
			</SettingsLayout>
		)
	}

}

SettingsPage.propTypes = {
	children: PropTypes.node.isRequired,
	tabs: PropTypes.array,
	title: PropTypes.string,
}

export default SettingsPage