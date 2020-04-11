import { defineMessages, injectIntl } from 'react-intl'
import { changeListEditorTitle, submitListEditor } from '../actions/lists'
import Button from '../components/button'
import Input from '../components/input'
import Text from '../components/text'

const messages = defineMessages({
  label: { id: 'lists.new.title_placeholder', defaultMessage: 'New list title' },
  create: { id: 'lists.new.create_title', defaultMessage: 'Create' },
})

const mapStateToProps = (state) => ({
  value: state.getIn(['listEditor', 'title']),
  disabled: state.getIn(['listEditor', 'isSubmitting']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange: value => dispatch(changeListEditorTitle(value)),
  onSubmit: () => dispatch(submitListEditor(true)),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListCreate extends PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  render() {
    const {
      value,
      disabled,
      intl,
      onSubmit,
      onChange
    } = this.props

    return (
      <form onSubmit={onSubmit}>
        <Input
          title={intl.formatMessage(messages.label)}
          placeholder='My new list...'
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          disabled={disabled}
        />

        <div className={[_s.default, _s.my10, _s.py5, _s.ml10].join(' ')}>
          <Text color='secondary' size='small'>
            Lists are private and only you can see who is on a list.<br/>
            No one else can view your lists. No one knows that they are on your list.
          </Text>
        </div>

        <Button
          className={_s.ml10}
          type='submit'
        >
          <Text color='white'>
            {intl.formatMessage(messages.create)}
          </Text>
        </Button>
      </form>
    )
  }

}
