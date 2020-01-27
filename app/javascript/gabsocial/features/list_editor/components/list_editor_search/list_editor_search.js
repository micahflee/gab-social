import { defineMessages, injectIntl } from 'react-intl';
import { fetchListSuggestions, clearListSuggestions, changeListSuggestions } from '../../../../actions/lists';
import Search from '../../../../components/search';

const messages = defineMessages({
  search: { id: 'lists.search', defaultMessage: 'Search among people you follow' },
  searchTitle: { id: 'tabs_bar.search', defaultMessage: 'Search' },
});

const mapStateToProps = state => ({
  value: state.getIn(['listEditor', 'suggestions', 'value']),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: value => dispatch(fetchListSuggestions(value)),
  onClear: () => dispatch(clearListSuggestions()),
  onChange: value => dispatch(changeListSuggestions(value)),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListEditorSearch extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  handleChange = e => {
    this.props.onChange(e.target.value);
  }

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      this.props.onSubmit(this.props.value);
    }
  }

  handleSubmit = () => {
    this.props.onSubmit(this.props.value);
  }

  handleClear = () => {
    this.props.onClear();
  }

  render () {
    const { value, intl } = this.props;

    return (
      <Search
        className='list-editor-search'
        placeholder={intl.formatMessage(messages.search)}
        value={value}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        handleSubmit={this.handleSubmit}
        handleClear={this.handleClear}
        searchTitle={intl.formatMessage(messages.searchTitle)}
      />
    )
  }

}
