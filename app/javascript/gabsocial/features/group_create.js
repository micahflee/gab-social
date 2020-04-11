import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import { changeValue, submit, setUp, reset } from '../actions/group_editor'
import ColumnIndicator from '../components/column_indicator';
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
	update: { id: 'groups.form.update', defaultMessage: 'Update group' },
})

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : null
	const group = state.getIn(['groups', groupId])

	return {
		group,
		error: groupId && !group,
		title: state.getIn(['group_editor', 'title']),
		description: state.getIn(['group_editor', 'description']),
		coverImage: state.getIn(['group_editor', 'coverImage']),
		disabled: state.getIn(['group_editor', 'isSubmitting']),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onTitleChange: value => dispatch(changeValue('title', value)),
	onDescriptionChange: value => dispatch(changeValue('description', value)),
	onCoverImageChange: value => dispatch(changeValue('coverImage', value)),
	onSubmit: routerHistory => dispatch(submit(routerHistory)),
	reset: () => dispatch(reset()),
	setUp: group => dispatch(setUp(group)),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Create extends ImmutablePureComponent {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		group: ImmutablePropTypes.map,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		coverImage: PropTypes.object,
		disabled: PropTypes.bool,
		intl: PropTypes.object.isRequired,
		onTitleChange: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
		onCloseModal: PropTypes.func,
	}

	componentWillMount() {
		if (!this.props.group) {
			this.props.reset()
		} else {
			this.props.setUp(this.props.group)
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.group !== nextProps.group && !!nextProps.group) {
			this.props.setUp(nextProps.group)
		}
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
			group,
			error,
			title,
			description,
			coverImage,
			disabled,
			intl
		} = this.props

		if (!group && error) {
			return <ColumnIndicator type='missing' />
		}

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
					className={_s.ml10}
				>
					<Text color='white'>
						{intl.formatMessage(!!group ? messages.update : messages.create)}
					</Text>
				</Button>

			</form>
		)
	}

}
