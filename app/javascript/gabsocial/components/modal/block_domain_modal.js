import { injectIntl, defineMessages } from 'react-intl'
import { blockDomain } from '../../actions/domain_blocks'
import ConfirmationModal from './confirmation_modal'

const messages = defineMessages({
  blockDomain: { id: 'block_domain', defaultMessage: 'Block {domain}' },
  blockDomainConfirm: { id: 'confirmations.domain_block.confirm', defaultMessage: 'Hide entire domain' },
  blockDomainMessage: { id: 'confirmations.domain_block.message', defaultMessage: 'Are you really, really sure you want to block the entire {domain}? In most cases a few targeted blocks or mutes are sufficient and preferable. You will not see content from that domain in any public timelines or your notifications. Your followers from that domain will be removed.' },
  cancel: { id: 'confirmation_modal.cancel', defaultMessage: 'Cancel' },
})

const mapDispatchToProps = (dispatch) => ({
  onConfirm(domain) {
    dispatch(blockDomain(domain))
  },
})

export default
@connect(null, mapDispatchToProps)
@injectIntl
class BlockDomainModal extends PureComponent {

  static propTypes = {
    domain: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  handleClick = () => {
    this.props.onConfirm(this.props.domain)
  }

  render() {
    const { onClose, domain, intl } = this.props

    console.log("this.props: ", this.props)

    return (
      <ConfirmationModal
        title={intl.formatMessage(messages.blockDomain, { domain })}
        message={intl.formatMessage(messages.blockDomainMessage, { domain })}
        confirm={intl.formatMessage(messages.blockDomainConfirm)}
        onConfirm={this.handleClick}
        onClose={onClose}
      />
    )
  }

}
