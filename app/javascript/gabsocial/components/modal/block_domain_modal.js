import { injectIntl, defineMessages } from 'react-intl'
import { muteAccount } from '../../actions/accounts'

const messages = defineMessages({
  muteMessage: { id: 'confirmations.mute.message', defaultMessage: 'Are you sure you want to mute {name}?' },
  cancel: { id: 'confirmation_modal.cancel', defaultMessage: 'Cancel' },
  confirm: { id: 'confirmations.mute.confirm', defaultMessage: 'Mute' },
})

const mapStateToProps = state => {
  return {
    isSubmitting: state.getIn(['reports', 'new', 'isSubmitting']),
    account: state.getIn(['mutes', 'new', 'account']),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onConfirm(account, notifications) {
      dispatch(muteAccount(account.get('id'), notifications))
    },
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class BlockDomainModal extends PureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.button.focus()
  }

  handleClick = () => {
    this.props.onClose()
    this.props.onConfirm(this.props.account, this.props.notifications)
  }

  handleCancel = () => {
    this.props.onClose()
  }

  render() {
    const { account, intl } = this.props

    // dispatch(openModal('CONFIRM', {
    //   message: <FormattedMessage id='confirmations.domain_block.message' defaultMessage='Are you really, really sure you want to block the entire {domain}? In most cases a few targeted blocks or mutes are sufficient and preferable. You will not see content from that domain in any public timelines or your notifications. Your followers from that domain will be removed.' values={{ domain: <strong>{domain}</strong> }} />,
    //   confirm: intl.formatMessage(messages.blockDomainConfirm),
    //   onConfirm: () => dispatch(blockDomain(domain)),
    // }));

    return (
      <ConfirmationModal
        title={`Mute @${account.get('acct')}`}
        message={<FormattedMessage id='confirmations.mute.message' defaultMessage='Are you sure you want to mute @{name}?' values={{ name: account.get('acct') }} />}
        confirm={<FormattedMessage id='mute' defaultMessage='Mute' />}
        onConfirm={() => {
          // dispatch(blockDomain(domain))
          // dispatch(blockDomain(domain))
        }}
      />
    )
  }

}
