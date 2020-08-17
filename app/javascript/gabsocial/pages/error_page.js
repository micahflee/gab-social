import React from 'react'

export default class ErrorPage extends React.PureComponent {

	render() {
		const { children } = this.props

		return (
			<div>
				{children}
			</div>
		)
	}
}