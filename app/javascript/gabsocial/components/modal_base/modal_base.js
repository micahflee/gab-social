import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import classNames from 'classnames';
import { openModal } from '../../actions/modal';
import { cancelReplyCompose } from '../../actions/compose';

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
});

const mapStateToProps = state => ({
  composeId: state.getIn(['compose', 'id']),
  composeText: state.getIn(['compose', 'text']),
});

const mapDispatchToProps = (dispatch) => ({
  onOpenModal(type, opts) {
    dispatch(openModal(type, opts));
  },
  onCancelReplyCompose() {
    dispatch(cancelReplyCompose());
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ModalBase extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    onOpenModal: PropTypes.func.isRequired,
    onCancelReplyCompose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    composeId: PropTypes.string,
    composeText: PropTypes.string,
    type: PropTypes.string,
  };

  state = {
    revealed: !!this.props.children,
  };

  activeElement = this.state.revealed ? document.activeElement : null;

  handleKeyUp = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)
         && !!this.props.children) {
      this.handleOnClose();
    }
  }

  handleOnClose = () => {
    const { onOpenModal, composeText, composeId, onClose, intl, type, onCancelReplyCompose } = this.props;

    if (!composeId && composeText && type == 'COMPOSE') {
      onOpenModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this status?' />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => onCancelReplyCompose(),
        onCancel: () => onOpenModal('COMPOSE'),
      });
    } else {
      onClose();
    }
  };

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp, false);
  }

  componentWillReceiveProps (nextProps) {
    if (!!nextProps.children && !this.props.children) {
      this.activeElement = document.activeElement;

      this.getSiblings().forEach(sibling => sibling.setAttribute('inert', true));
    } else if (!nextProps.children) {
      this.setState({ revealed: false });
    }

    if (!nextProps.children && !!this.props.children) {
      this.activeElement.focus();
      this.activeElement = null;
    }
  }

  componentDidUpdate (prevProps) {
    if (!this.props.children && !!prevProps.children) {
      this.getSiblings().forEach(sibling => sibling.removeAttribute('inert'));
    }

    if (this.props.children) {
      requestAnimationFrame(() => {
        this.setState({ revealed: true });
      });
    }
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  getSiblings = () => {
    return Array(...this.node.parentElement.childNodes).filter(node => node !== this.node);
  }

  setRef = ref => {
    this.node = ref;
  }

  render () {
    const { children } = this.props;
    const { revealed } = this.state;
    const visible = !!children;

    if (!visible) {
      return (
        <div className='modal-base modal-base--hidden' ref={this.setRef} />
      );
    }

    const classes = classNames('modal-base', {
      'modal-base--hidden': !revealed,
    });

    return (
      <div className={classes} ref={this.setRef}>
        <div style={{ pointerEvents: visible ? 'auto' : 'none' }}>
          <div role='presentation' className='modal-base__overlay' onClick={() => this.handleOnClose()} />
          <div role='dialog' className='modal-base__container'>
            {children}
          </div>
        </div>
      </div>
    );
  }

}