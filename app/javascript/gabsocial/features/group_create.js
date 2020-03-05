import { defineMessages, injectIntl } from 'react-intl'
import { changeValue, submit, reset } from '../actions/group_editor'
import Button from '../components/button'
import Divider from '../components/divider'
import Input from '../components/input'
import Text from '../components/text'
import Textarea from '../components/textarea'
import FileInput from '../components/file_input'

const messages = defineMessages({
	title: { id: 'groups.form.title', defaultMessage: 'Enter a new group title' },
	description: { id: 'groups.form.description', defaultMessage: 'Enter the group description' },
	coverImage: { id: 'groups.form.coverImage', defaultMessage: 'Upload a banner image' },
	coverImageChange: { id: 'groups.form.coverImageChange', defaultMessage: 'Banner image selected' },
	create: { id: 'groups.form.create', defaultMessage: 'Create group' },
})

const mapStateToProps = state => ({
	title: state.getIn(['group_editor', 'title']),
	description: state.getIn(['group_editor', 'description']),
	coverImage: state.getIn(['group_editor', 'coverImage']),
	disabled: state.getIn(['group_editor', 'isSubmitting']),
})

const mapDispatchToProps = dispatch => ({
	onTitleChange: value => dispatch(changeValue('title', value)),
	onDescriptionChange: value => dispatch(changeValue('description', value)),
	onCoverImageChange: value => dispatch(changeValue('coverImage', value)),
	onSubmit: routerHistory => dispatch(submit(routerHistory)),
	reset: () => dispatch(reset()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Create extends PureComponent {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		coverImage: PropTypes.object,
		disabled: PropTypes.bool,
		intl: PropTypes.object.isRequired,
		onTitleChange: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
	}

	componentWillMount() {
		this.props.reset()
	}

	handleTitleChange = e => {
		this.props.onTitleChange(e.target.value)
	}

	handleDescriptionChange = e => {
		this.props.onDescriptionChange(e.target.value)
	}

	handleCoverImageChange = e => {
		this.props.onCoverImageChange(e.target.files[0])
	}

	handleSubmit = e => {
		e.preventDefault()
		this.props.onSubmit(this.context.router.history)
	}

	render() {
		const {
			title,
			description,
			coverImage,
			disabled,
			intl
		} = this.props

		return (
			<form onSubmit={this.handleSubmit}>
				<Input
					title={intl.formatMessage(messages.title)}
					value={title}
					disabled={disabled}
					onChange={this.handleTitleChange}
					placeholder={'New group title...'}
				/>

				<Divider invisible />

				<Textarea
					title={intl.formatMessage(messages.description)}
					value={description}
					disabled={disabled}
					onChange={this.handleDescriptionChange}
					placeholder={'Some group description...'}
				/>

				<Divider invisible />

				<FileInput
					title={intl.formatMessage(coverImage === null ? messages.coverImage : messages.coverImageChange)}
					disabled={disabled}
					onChange={this.handleCoverImageChange}
					width='340px'
					height='145px'
				/>

				<Divider invisible />

				<Button
					className={_s.marginLeft10PX}
				>
					<Text color='white'>
						{intl.formatMessage(messages.create)}
					</Text>
				</Button>

			</form>
		)
	}

}
