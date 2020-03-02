import { closeModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'
import Bundle from '../../features/ui/util/bundle'
import {
  MuteModal,
  ReportModal,
  EmbedModal,
  // ListEditor,
  // ListAdder,
  StatusRevisionModal,
} from '../../features/ui/util/async-components'
import ModalBase from './modal_base'
import BundleModalError from '../bundle_modal_error'
import ActionsModal from './actions_modal'
import MediaModal from './media_modal'
import VideoModal from './video_modal'
import BoostModal from './boost_modal'
import ConfirmationModal from './confirmation_modal'
import HotkeysModal from './hotkeys_modal'
import ComposeModal from './compose_modal'
import UnauthorizedModal from './unauthorized_modal'
import ProUpgradeModal from './pro_upgrade_modal'
import ModalLoading from './modal_loading'

const MODAL_COMPONENTS = {
  'ACTIONS': () => Promise.resolve({ default: ActionsModal }),
  'BOOST': () => Promise.resolve({ default: BoostModal }),
  'COMPOSE': () => Promise.resolve({ default: ComposeModal }),
  'CONFIRM': () => Promise.resolve({ default: ConfirmationModal }),
  'EMBED': EmbedModal,
  'HOTKEYS': () => Promise.resolve({ default: HotkeysModal }),
  'MEDIA': () => Promise.resolve({ default: MediaModal }),
  'MUTE': MuteModal,
  'PRO_UPGRADE': () => Promise.resolve({ default: ProUpgradeModal }),
  'REPORT': ReportModal,
  'STATUS_REVISION': StatusRevisionModal,
  'UNAUTHORIZED': () => Promise.resolve({ default: UnauthorizedModal }),
  'VIDEO': () => Promise.resolve({ default: VideoModal }),
  // 'LIST_EDITOR': ListEditor,
  // 'LIST_ADDER': ListAdder,
  // group create
  // group members
}

const mapStateToProps = state => ({
  type: state.get('modal').modalType,
  props: state.get('modal').modalProps,
})

const mapDispatchToProps = (dispatch) => ({
  onClose (optionalType) {
    if (optionalType === 'COMPOSE') {
        dispatch(cancelReplyCompose())
    }

    dispatch(closeModal())
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class ModalRoot extends PureComponent {

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
