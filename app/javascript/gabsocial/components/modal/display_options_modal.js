import { injectIntl, defineMessages } from 'react-intl'
import { muteAccount } from '../../actions/accounts'

const messages = defineMessages({
  muteMessage: { id: 'confirmations.mute.message', defaultMessage: 'Are you sure you want to mute {name}?' },
  cancel: { id: 'confirmation_modal.cancel', defaultMessage: 'Cancel' },
  title: { id: 'display_options', defaultMessage: 'Display Options' },
})

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class DisplayOptionsModal extends PureComponent {

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

  // document.documentElement.style.setProperty("--color-surface", "black");
  
  render() {
    const { account, intl } = this.props

    return (
      <ModalLayout
        width={320}
        title={intl.formatMessage(messages.title)}
      >
      </ModalLayout> 
    )
  }

}
