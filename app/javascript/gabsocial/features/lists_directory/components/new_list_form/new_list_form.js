import { defineMessages, injectIntl } from 'react-intl';
import { changeListEditorTitle, submitListEditor } from '../../../../actions/lists';
import ColumnInlineForm from '../../../../components/column_inline_form';

const messages = defineMessages({
  label: { id: 'lists.new.title_placeholder', defaultMessage: 'New list title' },
  create: { id: 'lists.new.create_title', defaultMessage: 'Create' },
});

const mapStateToProps = state => ({
  value: state.getIn(['listEditor', 'title']),
  disabled: state.getIn(['listEditor', 'isSubmitting']),
});

const mapDispatchToProps = dispatch => ({
  onChange: value => dispatch(changeListEditorTitle(value)),
  onSubmit: () => dispatch(submitListEditor(true)),
});

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class NewListForm extends PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  render () {
    const { value, disabled, intl, onSubmit, onChange } = this.props;

    return (
      <ColumnInlineForm
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        label={intl.formatMessage(messages.label)}
        btnTitle={intl.formatMessage(messages.create)}
        disabled={disabled}
      />
    );
  }

}
