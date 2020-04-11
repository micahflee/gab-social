import { defineMessages, injectIntl } from 'react-intl';
import { changeListEditorTitle, submitListEditor } from '../../../../actions/lists';

const messages = defineMessages({
  title: { id: 'lists.edit.submit', defaultMessage: 'Change title' },
  save: { id: 'lists.new.save_title', defaultMessage: 'Save Title' },
});

const mapStateToProps = (state) => ({
  value: state.getIn(['listEditor', 'title']),
  disabled: !state.getIn(['listEditor', 'isChanged']),
});

const mapDispatchToProps = (dispatch) => ({
  onChange: value => dispatch(changeListEditorTitle(value)),
  onSubmit: () => dispatch(submitListEditor(false)),
});

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListForm extends PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  render () {
    const { value, disabled, intl, onSubmit, onChange } = this.props;

    return null;

    // return (
    //   <ColumnInlineForm
    //     value={value}
    //     onChange={onChange}
    //     onSubmit={onSubmit}
    //     label={intl.formatMessage(messages.title)}
    //     btnTitle={intl.formatMessage(messages.save)}
    //     disabled={disabled}
    //   />
    // );
  }

}
