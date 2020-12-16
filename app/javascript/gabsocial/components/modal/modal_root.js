import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closeModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'
import Bundle from '../../features/ui/util/bundle'
import ModalBase from './modal_base'
import BundleErrorModal from './bundle_error_modal'
import LoadingModal from './loading_modal'
import {
  MODAL_BLOCK_ACCOUNT,
  MODAL_BOOST,
  MODAL_CHAT_CONVERSATION_CREATE,
  MODAL_CHAT_CONVERSATION_DELETE,
  MODAL_COMMUNITY_TIMELINE_SETTINGS,
  MODAL_COMPOSE,
  MODAL_CONFIRM,
  MODAL_DECK_COLUMN_ADD,
  MODAL_DECK_COLUMN_ADD_OPTIONS,
  MODAL_DISPLAY_OPTIONS,
  MODAL_EDIT_PROFILE,
  MODAL_EDIT_SHORTCUTS,
  MODAL_EMAIL_CONFIRMATION_REMINDER,
  MODAL_GROUP_CREATE,
  MODAL_GROUP_DELETE,
  MODAL_GROUP_PASSWORD,
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
  ChatConversationCreateModal,
  ChatConversationDeleteModal,
  CommunityTimelineSettingsModal,
  ComposeModal,
  ConfirmationModal,
  DeckColumnAddModal,
  DeckColumnAddOptionsModal,
  DisplayOptionsModal,
  EditProfileModal,
  EditShortcutsModal,
  EmailConfirmationReminderModal,
  GroupCreateModal,
  GroupDeleteModal,
  GroupMembersModal,
  GroupPasswordModal,
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

const MODAL_COMPONENTS = {
  [MODAL_BLOCK_ACCOUNT]: BlockAccountModal,
  [MODAL_BOOST]: BoostModal,
  [MODAL_CHAT_CONVERSATION_CREATE]: ChatConversationCreateModal,
  [MODAL_CHAT_CONVERSATION_DELETE]: ChatConversationDeleteModal,
  [MODAL_COMMUNITY_TIMELINE_SETTINGS]: CommunityTimelineSettingsModal,
  [MODAL_COMPOSE]: ComposeModal,
  [MODAL_CONFIRM]: ConfirmationModal,
  [MODAL_DECK_COLUMN_ADD]: DeckColumnAddModal,
  [MODAL_DECK_COLUMN_ADD_OPTIONS]: DeckColumnAddOptionsModal,
  [MODAL_DISPLAY_OPTIONS]: DisplayOptionsModal,
  [MODAL_EDIT_SHORTCUTS]: EditShortcutsModal,
  [MODAL_EDIT_PROFILE]: EditProfileModal,
  [MODAL_EMAIL_CONFIRMATION_REMINDER]: EmailConfirmationReminderModal,
  [MODAL_GROUP_CREATE]: GroupCreateModal,
  [MODAL_GROUP_DELETE]: GroupDeleteModal,
  [MODAL_GROUP_PASSWORD]: GroupPasswordModal,
  [MODAL_HASHTAG_TIMELINE_SETTINGS]: HashtagTimelineSettingsModal,
  [MODAL_HOME_TIMELINE_SETTINGS]: HomeTimelineSettingsModal,
  [MODAL_HOTKEYS]: HotkeysModal,
  [MODAL_LIST_ADD_USER]: ListAddUserModal,
  [MODAL_LIST_CREATE]: ListCreateModal,
  [MODAL_LIST_DELETE]: ListDeleteModal,
  [MODAL_LIST_EDITOR]: ListEditorModal,
  [MODAL_LIST_TIMELINE_SETTINGS]: ListTimelineSettingsModal,
  [MODAL_MEDIA]: MediaModal,
  [MODAL_MUTE]: MuteModal,
  [MODAL_PRO_UPGRADE]: ProUpgradeModal,
  [MODAL_REPORT]: ReportModal,
  [MODAL_STATUS_LIKES]: StatusLikesModal,
  [MODAL_STATUS_REPOSTS]: StatusRepostsModal,
  [MODAL_STATUS_REVISIONS]: StatusRevisionsModal,
  [MODAL_UNAUTHORIZED]: UnauthorizedModal,
  [MODAL_UNFOLLOW]: UnfollowModal,
  [MODAL_VIDEO]: VideoModal,
}

const CENTERED_XS_MODALS = [
  MODAL_BLOCK_ACCOUNT,
  MODAL_CONFIRM,
  MODAL_GROUP_DELETE,
  MODAL_LIST_DELETE,
  MODAL_MUTE,
  MODAL_UNAUTHORIZED,
  MODAL_UNFOLLOW,
]

class ModalRoot extends React.PureComponent {

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

ModalRoot.propTypes = {
  type: PropTypes.string,
  props: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot)