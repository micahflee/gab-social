import { defineMessages, injectIntl } from 'react-intl';
import IconButton from '../icon_button';

const messages = defineMessages({
  title: { id: 'bundle_column_error.title', defaultMessage: 'Network error' },
  body: { id: 'bundle_column_error.body', defaultMessage: 'Something went wrong while loading this component.' },
  retry: { id: 'bundle_column_error.retry', defaultMessage: 'Try again' },
});

export default
@injectIntl
class BundleColumnError extends PureComponent {

  static propTypes = {
    onRetry: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  handleRetry = () => {
    this.props.onRetry();
  }

  render () {
    const { intl: { formatMessage } } = this.props;

    return (
      <div className='error-column'>
        <IconButton title={formatMessage(messages.retry)} icon='refresh' onClick={this.handleRetry} size={64} />
        {formatMessage(messages.body)}
      </div>
    );
  }

}
