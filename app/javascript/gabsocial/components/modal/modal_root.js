import ModalBase from './modal_base'
import Bundle from '../../features/ui/util/bundle'
import BundleModalError from '../bundle_modal_error'
import ActionsModal from './actions_modal'
import MediaModal from './media_modal'
// import VideoModal from './video_modal'
import BoostModal from './boost_modal'
import ConfirmationModal from './confirmation_modal'
import FocalPointModal from './focal_point_modal'
import HotkeysModal from './hotkeys_modal'
import ComposeModal from './compose_modal'
import UnauthorizedModal from './unauthorized_modal'
import ProUpgradeModal from './pro_upgrade_modal'
import ModalLoading from './modal_loading'
import {
  MuteModal,
  ReportModal,
  EmbedModal,
  ListEditor,
  ListAdder,
  StatusRevisionModal,
} from '../../features/ui/util/async-components'

const MODAL_COMPONENTS = {
  'MEDIA': () => Promise.resolve({ default: MediaModal }),
  // 'VIDEO': () => Promise.resolve({ default: VideoModal }),
  'BOOST': () => Promise.resolve({ default: BoostModal }),
  'CONFIRM': () => Promise.resolve({ default: ConfirmationModal }),
  'MUTE': MuteModal,
  'REPORT': ReportModal,
  'ACTIONS': () => Promise.resolve({ default: ActionsModal }),
  'EMBED': EmbedModal,
  'LIST_EDITOR': ListEditor,
  'FOCAL_POINT': () => Promise.resolve({ default: FocalPointModal }),
  'LIST_ADDER': ListAdder,
  'HOTKEYS': () => Promise.resolve({ default: HotkeysModal }),
  'STATUS_REVISION': StatusRevisionModal,
  'COMPOSE': () => Promise.resolve({ default: ComposeModal }),
  'UNAUTHORIZED': () => Promise.resolve({ default: UnauthorizedModal }),
  'PRO_UPGRADE': () => Promise.resolve({ default: ProUpgradeModal }),
}

export default class ModalRoot extends PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  }

  getSnapshotBeforeUpdate () {
    return { visible: !!this.props.type }
  }

  componentDidUpdate (prevProps, prevState, { visible }) {
    if (visible) {
      document.body.classList.add('with-modals--active')
    } else {
      document.body.classList.remove('with-modals--active')
    }
  }

  renderLoading = modalId => () => {
    return ['MEDIA', 'VIDEO', 'BOOST', 'CONFIRM', 'ACTIONS'].indexOf(modalId) === -1 ? <ModalLoading /> : null
  }

  renderError = (props) => {
    return <BundleModalError {...props} onClose={this.onClickClose} />
  }

  onClickClose = () => {
    const { onClose, type } = this.props
    onClose(type)
  }

  render () {
    const { type, props } = this.props
    const visible = !!type

    return (
      <ModalBase onClose={this.onClickClose} type={type}>
        {
          visible &&
          <Bundle
            fetchComponent={MODAL_COMPONENTS[type]}
            loading={this.renderLoading(type)}
            error={this.renderError}
            renderDelay={200}
          >
            {
              (SpecificComponent) => <SpecificComponent {...props} onClose={this.onClickClose} />
            }
          </Bundle>
        }
      </ModalBase>
    )
  }

}
