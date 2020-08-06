import { closeModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'
import Bundle from '../../features/ui/util/bundle'
import ModalBase from './modal_base'
import BundleErrorModal from './bundle_error_modal'
import LoadingModal from './loading_modal'
import {
  MODAL_BLOCK_ACCOUNT,
  MODAL_BOOST,
  MODAL_COMMUNITY_TIMELINE_SETTINGS,
  MODAL_COMPOSE,
  MODAL_CONFIRM,
  MODAL_DISPLAY_OPTIONS,
  MODAL_EDIT_PROFILE,
  MODAL_EDIT_SHORTCUTS,
  MODAL_EMBED,
  MODAL_GIF_PICKER,
  MODAL_GROUP_CREATE,
  MODAL_GROUP_DELETE,
  MODAL_HASHTAG_TIMELINE_SETTINGS,
  MODAL_HOME_TIMELINE_SETTINGS,
  MODAL_HOTKEYS,
  MODAL_LIST_ADD_USER,
  MODAL_LIST_CREATE,
  MODAL_LIST_DELETE,
  MODAL_LIST_EDITOR,
  MODAL_LIST_TIMELINE_SETTINGS,
  MODAL_MEDIA,
  MODAL_MUTE,
  MODAL_PRO_UPGRADE,
  MODAL_REPORT,
  MODAL_STATUS_LIKES,
  MODAL_STATUS_REPOSTS,
  MODAL_STATUS_REVISIONS,
  MODAL_UNAUTHORIZED,
  MODAL_UNFOLLOW,
  MODAL_VIDEO,
} from '../../constants'
import {
  BlockAccountModal,
  BoostModal,
  CommunityTimelineSettingsModal,
  ComposeModal,
  ConfirmationModal,
  DisplayOptionsModal,
  EditProfileModal,
  EditShortcutsModal,
  EmbedModal,
  GifPickerModal,
  GroupCreateModal,
  GroupDeleteModal,
  GroupMembersModal,
  GroupRemovedAccountsModal,
  HashtagTimelineSettingsModal,
  HomeTimelineSettingsModal,
  HotkeysModal,
  ListAddUserModal,
  ListCreateModal,
  ListDeleteModal,
  ListEditorModal,
  ListTimelineSettingsModal,
  MediaModal,
  MuteModal,
  ProUpgradeModal,
  ReportModal,
  StatusLikesModal,
  StatusRepostsModal,
  StatusRevisionsModal,
  UnauthorizedModal,
  UnfollowModal,
  VideoModal,
} from '../../features/ui/util/async_components'

const MODAL_COMPONENTS = {}
MODAL_COMPONENTS[MODAL_BLOCK_ACCOUNT] = BlockAccountModal
MODAL_COMPONENTS[MODAL_BOOST] = BoostModal
MODAL_COMPONENTS[MODAL_COMMUNITY_TIMELINE_SETTINGS] = CommunityTimelineSettingsModal
MODAL_COMPONENTS[MODAL_COMPOSE] = ComposeModal
MODAL_COMPONENTS[MODAL_CONFIRM] = ConfirmationModal
MODAL_COMPONENTS[MODAL_DISPLAY_OPTIONS] = DisplayOptionsModal
MODAL_COMPONENTS[MODAL_EDIT_SHORTCUTS] = EditShortcutsModal
MODAL_COMPONENTS[MODAL_EDIT_PROFILE] = EditProfileModal
MODAL_COMPONENTS[MODAL_EMBED] = EmbedModal
MODAL_COMPONENTS[MODAL_GIF_PICKER] = GifPickerModal
MODAL_COMPONENTS[MODAL_GROUP_CREATE] = GroupCreateModal
MODAL_COMPONENTS[MODAL_GROUP_DELETE] = GroupDeleteModal
MODAL_COMPONENTS[MODAL_HASHTAG_TIMELINE_SETTINGS] = HashtagTimelineSettingsModal
MODAL_COMPONENTS[MODAL_HOME_TIMELINE_SETTINGS] = HomeTimelineSettingsModal
MODAL_COMPONENTS[MODAL_HOTKEYS] = HotkeysModal
MODAL_COMPONENTS[MODAL_LIST_ADD_USER] = ListAddUserModal
MODAL_COMPONENTS[MODAL_LIST_CREATE] = ListCreateModal
MODAL_COMPONENTS[MODAL_LIST_DELETE] = ListDeleteModal
MODAL_COMPONENTS[MODAL_LIST_EDITOR] = ListEditorModal
MODAL_COMPONENTS[MODAL_LIST_TIMELINE_SETTINGS] = ListTimelineSettingsModal
MODAL_COMPONENTS[MODAL_MEDIA] = MediaModal
MODAL_COMPONENTS[MODAL_MUTE] = MuteModal
MODAL_COMPONENTS[MODAL_PRO_UPGRADE] = ProUpgradeModal
MODAL_COMPONENTS[MODAL_REPORT] = ReportModal
MODAL_COMPONENTS[MODAL_STATUS_LIKES] = StatusLikesModal
MODAL_COMPONENTS[MODAL_STATUS_REPOSTS] = StatusRepostsModal
MODAL_COMPONENTS[MODAL_STATUS_REVISIONS] = StatusRevisionsModal
MODAL_COMPONENTS[MODAL_UNAUTHORIZED] = UnauthorizedModal
MODAL_COMPONENTS[MODAL_UNFOLLOW] = UnfollowModal
MODAL_COMPONENTS[MODAL_VIDEO] = VideoModal

const CENTERED_XS_MODALS = [
  MODAL_BLOCK_ACCOUNT,
  MODAL_CONFIRM,
  MODAL_GROUP_DELETE,
  MODAL_LIST_DELETE,
  MODAL_MUTE,
  MODAL_UNAUTHORIZED,
  MODAL_UNFOLLOW,
]

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

  renderLoading = () => {
    return <LoadingModal />
  }

  renderError = () => {
    return <BundleErrorModal {...this.props} onClose={this.onClickClose} />
  }

  onClickClose = () => {
    this.props.onClose(this.props.type)
  }

  render() {
    const { type, props } = this.props
    const visible = !!type

    return (
      <ModalBase 
        onClose={this.onClickClose}
        isCenteredXS={CENTERED_XS_MODALS.indexOf(type) > -1}
        type={type}
      >
        {
          visible &&
          <Bundle
            fetchComponent={MODAL_COMPONENTS[type]}
            loading={this.renderLoading}
            error={this.renderError}
            renderDelay={150}
          >
            {
              (Component) => <Component {...props} onClose={this.onClickClose} />
            }
          </Bundle>
        }
      </ModalBase>
    )
  }

}
