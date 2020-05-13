import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { closePopover } from '../../actions/popover'
import { openModal } from '../../actions/modal'
import {
  MODAL_EMBED,
  POPOVER_STATUS_SHARE,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  email: { id: 'status.email', defaultMessage: 'Email this gab' },
  copy: { id: 'status.copy', defaultMessage: 'Copy link to status' },
});

const mapDispatchToProps = (dispatch) => ({
  onClosePopover: () => dispatch(closePopover(POPOVER_STATUS_SHARE)),
  onOpenEmbedModal(url) {
    dispatch(openModal(MODAL_EMBED, {
      url,
    }))
  },
});

export default
@injectIntl
@connect(null, mapDispatchToProps)
class StatusSharePopover extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    onClosePopover: PropTypes.func.isRequired,
    onOpenEmbedModal: PropTypes.func.isRequired,
    isXS: PropTypes.bool,
  }

  handleOnOpenEmbedModal = () => {
    this.props.onOpenEmbedModal(this.props.status.get('url'))
    this.props.onClosePopover()
  }

  handleCopy = () => {
    const url = this.props.status.get('url');
    const textarea = document.createElement('textarea');

    textarea.textContent = url;
    textarea.style.position = 'fixed';

    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand('copy');
    } catch (e) {
      //
    }

    document.body.removeChild(textarea);
    this.props.onClosePopover()
  }

  render() {
    const { intl, status, isXS } = this.props

    const mailToHref = !status ? undefined : `mailto:?subject=Gab&body=${status.get('url')}`

    return (
      <PopoverLayout width={220} isXS={isXS}>
        <List
          size='large'
          scrollKey='status_share_options'
          items={[
            {
              icon: 'copy',
              hideArrow: true,
              title: intl.formatMessage(messages.copy),
              onClick: this.handleCopy,
            },
            {
              icon: 'email',
              hideArrow: true,
              title: intl.formatMessage(messages.email),
              href: mailToHref,
            },
            {
              icon: 'code',
              hideArrow: true,
              title: intl.formatMessage(messages.embed),
              onClick: this.handleOnOpenEmbedModal,
            },
          ]}
          small
        />
      </PopoverLayout>
    )
  }
}