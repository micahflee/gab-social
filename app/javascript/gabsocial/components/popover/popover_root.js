import {
  BREAKPOINT_EXTRA_SMALL,
  POPOVER_CHAT_CONVERSATION_EXPIRATION_OPTIONS,
  POPOVER_CHAT_CONVERSATION_OPTIONS,
  POPOVER_CHAT_MESSAGE_OPTIONS,
  POPOVER_CHAT_SETTINGS,
  POPOVER_COMMENT_SORTING_OPTIONS,
  POPOVER_COMPOSE_POST_DESTINATION,
  POPOVER_DATE_PICKER,
  POPOVER_EMOJI_PICKER,
  POPOVER_GROUP_LIST_SORT_OPTIONS,
  POPOVER_GROUP_MEMBER_OPTIONS,
  POPOVER_GROUP_OPTIONS,
  POPOVER_GROUP_TIMELINE_SORT_OPTIONS,
  POPOVER_GROUP_TIMELINE_SORT_TOP_OPTIONS,
  POPOVER_NAV_SETTINGS,
  POPOVER_PROFILE_OPTIONS,
  POPOVER_SIDEBAR_MORE,
  POPOVER_STATUS_OPTIONS,
  POPOVER_STATUS_EXPIRATION_OPTIONS,
  POPOVER_SHARE,
  POPOVER_STATUS_VISIBILITY,
  POPOVER_TIMELINE_INJECTION_OPTIONS,
  POPOVER_USER_INFO,
  POPOVER_VIDEO_STATS,
} from '../../constants'
import {
  ChatConversationExpirationOptionsPopover,
  ChatConversationOptionsPopover,
  ChatMessageOptionsPopover,
  ChatSettingsPopover,
  CommentSortingOptionsPopover,
  ComposePostDesinationPopover,
  DatePickerPopover,
  EmojiPickerPopover,
  GroupListSortOptionsPopover,
  GroupMemberOptionsPopover,
  GroupOptionsPopover,
  GroupTimelineSortOptionsPopover,
  GroupTimelineSortTopOptionsPopover,
  NavSettingsPopover,
  ProfileOptionsPopover,
  SidebarMorePopover,
  StatusExpirationOptionsPopover,
  StatusOptionsPopover,
  SharePopover,
  StatusVisibilityPopover,
  TimelineInjectionOptionsPopover,
  UserInfoPopover,
  VideoStatsPopover,
} from '../../features/ui/util/async_components'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import Bundle from '../../features/ui/util/bundle'
import ModalBase from '../modal/modal_base'
import PopoverBase from './popover_base'
import ErrorPopover from './error_popover'
import LoadingPopover from './loading_popover'

const POPOVER_COMPONENTS = {
  [POPOVER_CHAT_CONVERSATION_EXPIRATION_OPTIONS]: ChatConversationExpirationOptionsPopover,
  [POPOVER_CHAT_CONVERSATION_OPTIONS]: ChatConversationOptionsPopover,
  [POPOVER_CHAT_MESSAGE_OPTIONS]: ChatMessageOptionsPopover,
  [POPOVER_CHAT_SETTINGS]: ChatSettingsPopover,
  [POPOVER_COMMENT_SORTING_OPTIONS]: CommentSortingOptionsPopover,
  [POPOVER_COMPOSE_POST_DESTINATION]: ComposePostDesinationPopover,
  [POPOVER_DATE_PICKER]: DatePickerPopover,
  [POPOVER_EMOJI_PICKER]: EmojiPickerPopover,
  [POPOVER_GROUP_LIST_SORT_OPTIONS]: GroupListSortOptionsPopover,
  [POPOVER_GROUP_MEMBER_OPTIONS]: GroupMemberOptionsPopover,
  [POPOVER_GROUP_OPTIONS]: GroupOptionsPopover,
  [POPOVER_GROUP_TIMELINE_SORT_OPTIONS]: GroupTimelineSortOptionsPopover,
  [POPOVER_GROUP_TIMELINE_SORT_TOP_OPTIONS]: GroupTimelineSortTopOptionsPopover,
  [POPOVER_NAV_SETTINGS]: NavSettingsPopover,
  [POPOVER_PROFILE_OPTIONS]: ProfileOptionsPopover,
  [POPOVER_SIDEBAR_MORE]: SidebarMorePopover,
  [POPOVER_STATUS_OPTIONS]: StatusOptionsPopover,
  [POPOVER_STATUS_EXPIRATION_OPTIONS]: StatusExpirationOptionsPopover,
  [POPOVER_SHARE]: SharePopover,
  [POPOVER_STATUS_VISIBILITY]: StatusVisibilityPopover,
  [POPOVER_TIMELINE_INJECTION_OPTIONS]: TimelineInjectionOptionsPopover,
  [POPOVER_USER_INFO]: UserInfoPopover,
  [POPOVER_VIDEO_STATS]: VideoStatsPopover,
}

class PopoverRoot extends React.PureComponent {

  componentDidUpdate() {
    const { type, width } = this.props

    if (width <= BREAKPOINT_EXTRA_SMALL && !!type) {
      document.body.classList.add(_s.overflowYHidden)
    } else {
      document.body.classList.remove(_s.overflowYHidden)
    }
  }

  renderLoading = () => {
    const { width } = this.props
    const isXS = width <= BREAKPOINT_EXTRA_SMALL

    return <LoadingPopover isXS={isXS} onClose={this.props.onClose} />
  }

  renderError = () => {
    const { width } = this.props
    const isXS = width <= BREAKPOINT_EXTRA_SMALL

    return <ErrorPopover isXS={isXS} onClose={this.props.onClose} />
  }

  setRef = () => {
    // : todo : ?
  }

  render() {
    const { type, props, onClose, width } = this.props

    const visible = !!type

    const isXS = width <= BREAKPOINT_EXTRA_SMALL
    const Wrapper = isXS ? ModalBase : PopoverBase

    //If is XS and popover is user info, dont show
    //Since on mobile this should not be visible
    if (isXS && type === POPOVER_USER_INFO) return null

    return (
      <Wrapper
        onClose={onClose}
        visible={visible}
        innerRef={this.setRef}
        {...props}
      >
        {
          visible &&
          <Bundle
            fetchComponent={POPOVER_COMPONENTS[type]}
            loading={this.renderLoading}
            error={this.renderError}
            renderDelay={150}
          >
            {
              (Component) => <Component innerRef={this.setRef} isXS={isXS} onClose={onClose} {...props} />
            }
          </Bundle>
        }
      </Wrapper>
    )
  }

}

const mapStateToProps = (state) => ({
  type: state.getIn(['popover', 'popoverType']),
  props: state.getIn(['popover', 'popoverProps'], {}),
  width: state.getIn(['settings', 'window_dimensions', 'width']),  
})

const mapDispatchToProps = (dispatch) => ({
  onClose: (type) => dispatch(closePopover(type)),
})

PopoverRoot.propTypes = {
  type: PropTypes.string,
  props: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(PopoverRoot)