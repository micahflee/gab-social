import { closeModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'
import Bundle from '../../features/ui/util/bundle'
import {
  MuteModal,
  ReportModal,
  EmbedModal,
  // ListEditor,
  // ListAdder,
  StatusRevisionsModal,
} from '../../features/ui/util/async_components'

import ModalBase from './modal_base'
import BundleModalError from '../bundle_modal_error'

import ActionsModal from './actions_modal'
import BlockAccountModal from './block_account_modal'
import BlockDomainModal from './block_domain_modal'
import BoostModal from './boost_modal'
import CommunityTimelineSettingsModal from './community_timeline_settings_modal'
import ComposeModal from './compose_modal'
import ConfirmationModal from './confirmation_modal'
import GifPickerModal from './gif_picker_modal'
import GroupCreateModal from './group_create_modal'
import GroupDeleteModal from './group_delete_modal'
import GroupEditorModal from './group_editor_modal'
import HashtagTimelineSettingsModal from './hashtag_timeline_settings_modal'
import HomeTimelineSettingsModal from './home_timeline_settings_modal'
import HotkeysModal from './hotkeys_modal'
import ListCreateModal from './list_create_modal'
import ListDeleteModal from './list_delete_modal'
import ListEditorModal from './list_editor_modal'
import ListTimelineSettingsModal from './list_timeline_settings_modal'
import MediaModal from './media_modal'
import ModalLoading from './modal_loading'
import ProUpgradeModal from './pro_upgrade_modal'
import VideoModal from './video_modal'
import UnauthorizedModal from './unauthorized_modal'
import UnfollowModal from './unfollow_modal'

const MODAL_COMPONENTS = {
  ACTIONS: () => Promise.resolve({ default: ActionsModal }),
  BLOCK_ACCOUNT: () => Promise.resolve({ default: BlockAccountModal }),
  BLOCK_DOMAIN: () => Promise.resolve({ default: BlockDomainModal }),
  BOOST: () => Promise.resolve({ default: BoostModal }),
  COMMUNITY_TIMELINE_SETTINGS: () => Promise.resolve({ default: CommunityTimelineSettingsModal }),
  COMPOSE: () => Promise.resolve({ default: ComposeModal }),
  CONFIRM: () => Promise.resolve({ default: ConfirmationModal }),
  EMBED: () => Promise.resolve({ default: EmbedModal }),
  GIF_PICKER: () => Promise.resolve({ default: GifPickerModal }),
  GROUP_CREATE: () => Promise.resolve({ default: GroupCreateModal }),
  GROUP_DELETE: () => Promise.resolve({ default: GroupDeleteModal }),
  GROUP_EDITOR: () => Promise.resolve({ default: GroupEditorModal }),
  HASHTAG_TIMELINE_SETTINGS: () => Promise.resolve({ default: HashtagTimelineSettingsModal }),
  HOME_TIMELINE_SETTINGS: () => Promise.resolve({ default: HomeTimelineSettingsModal }),
  HOTKEYS: () => Promise.resolve({ default: HotkeysModal }),
  LIST_CREATE: () => Promise.resolve({ default: ListCreateModal }),
  LIST_DELETE: () => Promise.resolve({ default: ListDeleteModal }),
  LIST_EDITOR: () => Promise.resolve({ default: ListEditorModal }),
  LIST_TIMELINE_SETTINGS: () => Promise.resolve({ default: ListTimelineSettingsModal }),
  MEDIA: () => Promise.resolve({ default: MediaModal }),
  MUTE: MuteModal,
  PRO_UPGRADE: () => Promise.resolve({ default: ProUpgradeModal }),
  REPORT: ReportModal,
  STATUS_REVISIONS: StatusRevisionsModal,
  UNAUTHORIZED: () => Promise.resolve({ default: UnauthorizedModal }),
  UNFOLLOW: () => Promise.resolve({ default: UnfollowModal }),
  VIDEO: () => Promise.resolve({ default: VideoModal }),
}

const mapStateToProps = (state) => ({
  type: state.getIn(['modal', 'modalType']),
  props: state.getIn(['modal', 'modalProps'], {}),
})

const mapDispatchToProps = (dispatch) => ({
  onClose(optionalType) {
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

  getSnapshotBeforeUpdate() {
    return { visible: !!this.props.type }
  }

  componentDidUpdate(prevProps, prevState, { visible }) {
    if (visible) {
      document.body.classList.add(_s.overflowYHidden)
    } else {
      document.body.classList.remove(_s.overflowYHidden)
    }
  }

  renderLoading = modalId => () => {
    return ['MEDIA', 'VIDEO', 'BOOST', 'CONFIRM', 'ACTIONS'].indexOf(modalId) === -1 ? <ModalLoading /> : null
  }

  renderError = (props) => {
    return <BundleModalError {...props} onClose={this.onClickClose} />
  }

  onClickClose = () => {
    this.props.onClose(this.props.type)
  }

  render() {
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
