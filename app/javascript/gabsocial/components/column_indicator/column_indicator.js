import { defineMessages, injectIntl } from 'react-intl';
import Column from '../column';

const messages = defineMessages({
  loading: { id: 'loading_indicator.label', defaultMessage: 'Loading...' },
  missing: { id: 'missing_indicator.sublabel', defaultMessage: 'This resource could not be found.' },
});

export default @injectIntl
class ColumnIndicator extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    type: PropTypes.oneOf([
      'loading',
      'missing',
      'error',
    ]),
    message: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  };

  render() {
    const { type, message, intl } = this.props;

    const title = type !== 'error' ? intl.formatMessage(messages[type]) : message;

    return (
      <Column>
        <div className={`column-indicator column-indicator--${type}`}>
          <div className='column-indicator__figure' />
          <span className='column-indicator__title'>{title}</span>
        </div>
      </Column>
    );
  }

};
