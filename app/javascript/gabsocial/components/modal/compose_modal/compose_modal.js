import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { openModal } from '../../../actions/modal';
import { cancelReplyCompose } from '../../../actions/compose';
import ModalLayout from '../modal_layout';

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  title: { id: 'navigation_bar.compose', defaultMessage: 'Compose new gab' },
});

const mapStateToProps = state => {
  return {
    composeText: state.getIn(['compose', 'text']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ComposeModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    composeText: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  onClickClose = () => {
    const {composeText, dispatch, onClose, intl} = this.props;

    if (composeText) {
      dispatch(openModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this status?' />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => dispatch(cancelReplyCompose()),
        onCancel: () => dispatch(openModal('COMPOSE')),
      }));
    }
    else {
      onClose('COMPOSE');
    }
  };

  render () {
    const { intl } = this.props;

    return (
      <ModalLayout title={intl.formatMessage(messages.title)} onClose={onClickClose}>
        <TimelineComposeBlock />
      </ModalLayout>
    );
  }
}