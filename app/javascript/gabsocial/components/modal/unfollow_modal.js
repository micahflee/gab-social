import { injectIntl, defineMessages } from 'react-intl'
import { muteAccount } from '../../actions/accounts'

const messages = defineMessages({
  muteMessage: { id: 'confirmations.mute.message', defaultMessage: 'Are you sure you want to mute {name}?' },
  cancel: { id: 'confirmation_modal.cancel', defaultMessage: 'Cancel' },
  confirm: { id: 'confirmations.mute.confirm', defaultMessage: 'Mute' },
})

const mapStateToProps = (state) => ({
  isSubmitting: state.getIn(['reports', 'new', 'isSubmitting']),
  account: state.getIn(['mutes', 'new', 'account']),
})

const mapDispatchToProps = (dispatch) => ({
  onConfirm(account, notifications) {
    dispatch(muteAccount(account.get('id'), notifications))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class UnfollowModal extends PureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
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

    // : TODO :
    // , {
    //   message: <FormattedMessage id='confirmations.unfollow.message' defaultMessage='Are you sure you want to unfollow {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
    //   confirm: intl.formatMessage(messages.unfollowConfirm),
    //   onConfirm: () => dispatch(unfollowAccount(account.get('id'))),
    // }));

    return (
      <ConfirmationModal
        title={`Mute @${account.get('acct')}`}
        message={<FormattedMessage id='confirmations.mute.message' defaultMessage='Are you sure you want to mute @{name}?' values={{ name: account.get('acct') }} />}
        confirm={<FormattedMessage id='mute' defaultMessage='Mute' />}
        onClose={onClose}
        onConfirm={() => {
          // dispatch(blockDomain(domain))
          // dispatch(blockDomain(domain))
        }}
      />
    )
  }

}
