export default class ErrorPage extends PureComponent {

	render() {
		const { children } = this.props

		return (
			<div>
				{children}
			</div>
		)
	}
}