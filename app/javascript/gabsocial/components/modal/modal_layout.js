import { defineMessages, injectIntl } from 'react-intl';
import IconButton from '../icon_button';

import './modal_layout';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

export default @injectIntl
class ModalLayout extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { title, children } = this.props;

    return (
      <div className='modal modal--layout modal--root'>
        <div className='modal-header'>
          <h3 className='modal-header__title'>{title}</h3>
          <IconButton
            className='modal-header__close-btn'
            title={intl.formatMessage(messages.close)}
            icon='times'
            onClick={onClose}
            size={20}
          />
        </div>
        <div className='modal__content'>
          {children}
        </div>
      </div>
    )
  };

}