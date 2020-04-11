import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'
import ModalLayout from './modal_layout'
import TimelineComposeBlock from '../timeline_compose_block'

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  title: { id: 'navigation_bar.compose', defaultMessage: 'Compose new gab' },
})

const mapStateToProps = (state) => ({
  composeText: state.getIn(['compose', 'text']),
})

export default
@connect(mapStateToProps)
@injectIntl
class ComposeModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    composeText: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  onClickClose = () => {
    const { composeText, dispatch, onClose, intl } = this.props;

    if (composeText) {
      dispatch(openModal('CONFIRM', {
        title: <FormattedMessage id='discard-gab-title' defaultMessage='Discard gab?' />,
        message: <FormattedMessage id='discard-gab-message' defaultMessage="This can't be undone and you'll lose your draft." />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => dispatch(cancelReplyCompose()),
        onCancel: () => dispatch(openModal('COMPOSE')),
      }));
    }
    else {
      onClose('COMPOSE');
    }
  };

  render() {
    const { intl } = this.props

    return (
      <ModalLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        onClose={this.onClickClose}
      >
        <TimelineComposeBlock modal />
      </ModalLayout>
    );
  }
}
