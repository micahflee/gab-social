import { injectIntl, defineMessages } from 'react-intl';
import { closeModal } from '../../actions/modal';
import { muteAccount } from '../../actions/accounts';
import { toggleHideNotifications } from '../../actions/mutes';
import ToggleSwitch from '../toggle_switch';
import Button from '../button';

const messages = defineMessages({
  muteMessage: { id: 'confirmations.mute.message', defaultMessage: 'Are you sure you want to mute {name}?' },
  hideNotifications: { id: 'mute_modal.hide_notifications', defaultMessage: 'Hide notifications from this user?' },
  cancel: { id: 'confirmation_modal.cancel', defaultMessage: 'Cancel' },
  confirm: { id: 'confirmations.mute.confirm', defaultMessage: 'Mute' },
});

const mapStateToProps = state => {
  return {
    isSubmitting: state.getIn(['reports', 'new', 'isSubmitting']),
    account: state.getIn(['mutes', 'new', 'account']),
    notifications: state.getIn(['mutes', 'new', 'notifications']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onConfirm(account, notifications) {
      dispatch(muteAccount(account.get('id'), notifications));
    },

    onClose() {
      dispatch(closeModal());
    },

    onToggleNotifications() {
      dispatch(toggleHideNotifications());
    },
  };
};

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class MuteModal extends PureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    notifications: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onToggleNotifications: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.button.focus();
  }

  handleClick = () => {
    this.props.onClose();
    this.props.onConfirm(this.props.account, this.props.notifications);
  }

  handleCancel = () => {
    this.props.onClose();
  }

  setRef = (c) => {
    this.button = c;
  }

  toggleNotifications = () => {
    this.props.onToggleNotifications();
  }

  render () {
    const { account, notifications } = this.props;

    return (
      <div className='modal-root__modal mute-modal'>
        <div className='mute-modal__container'>
          <p>
            {intl.formatMessage(messages.muteMessage, { name: <strong>@{account.get('acct')}</strong> })}
          </p>
          <div>
            <label htmlFor='mute-modal__hide-notifications-checkbox'>
              {intl.formatMessage(messages.hideNotifications)}
              {' '}
              <ToggleSwitch id='mute-modal__hide-notifications-checkbox' checked={notifications} onChange={this.toggleNotifications} />
            </label>
          </div>
        </div>

        <div className='mute-modal__action-bar'>
          <Button onClick={this.handleCancel} className='mute-modal__cancel-button'>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button onClick={this.handleClick} ref={this.setRef}>
            {intl.formatMessage(messages.confirm)}
          </Button>
        </div>
      </div>
    );
  }

}
