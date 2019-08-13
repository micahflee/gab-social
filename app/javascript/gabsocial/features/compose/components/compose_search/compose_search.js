import { defineMessages, injectIntl } from 'react-intl';
import Search from '../../../../components/search';

const messages = defineMessages({
  placeholder: { id: 'search.placeholder', defaultMessage: 'Search' },
});

export default @injectIntl
class ComposeSearch extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    value: PropTypes.string.isRequired,
    submitted: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    openInRoute: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  handleClear = (e) => {
    e.preventDefault();

    if (this.props.value.length > 0 || this.props.submitted) {
      this.props.onClear();
    }
  }

  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      this.props.onSubmit();

      if (this.props.openInRoute) {
        this.context.router.history.push('/search');
      }
    } else if (e.key === 'Escape') {
      document.querySelector('.ui').parentElement.focus();
    }
  }

  render () {
    const { intl, value, onShow, ...rest } = this.props;

    return (
      <Search
        value={value}
        placeholder={intl.formatMessage(messages.placeholder)}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        handleClear={this.handleClear}
        onShow={onShow}
        withOverlay
        {...rest}
      />
    )
  }

}
