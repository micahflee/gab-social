import { defineMessages, injectIntl } from 'react-intl';
import IconButton from '../icon_button';

const messages = defineMessages({
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
});

export default @injectIntl
class Domain extends PureComponent {

  static propTypes = {
    domain: PropTypes.string,
    onUnblockDomain: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleDomainUnblock = () => {
    this.props.onUnblockDomain(this.props.domain);
  }

  render () {
    const { domain, intl } = this.props;

    return (
      <div className='domain'>
        <div className='domain__wrapper'>
          <span className='domain__name'>
            <strong>{domain}</strong>
          </span>

          <div className='domain__buttons'>
            <IconButton
              active
              icon='unlock'
              title={intl.formatMessage(messages.unblockDomain, {
                domain,
              })}
              onClick={this.handleDomainUnblock}
            />
          </div>
        </div>
      </div>
    );
  }

}
