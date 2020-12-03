import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { me } from '../initial_state'
import { openModal } from '../actions/modal'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
  MODAL_CHAT_CONVERSATION_CREATE,
} from '../constants'
import Layout from './layout'
import Responsive from '../features/ui/util/responsive_component'
import List from '../components/list'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import ChatConversationsSearch from '../features/messages/components/chat_conversations_search'
import ChatConversationsList from '../features/messages/components/chat_conversations_list'
import ChatSettingsHeader from '../features/messages/components/chat_settings_header'
import ChatConversationRequestsListItem from '../features/messages/components/chat_conversations_requests_list_item'

class MessagesLayout extends React.PureComponent {

  onClickAdd = () => {
    this.props.onOpenChatConversationCreateModal()
  }

  render() {
    const {
      title,
      children,
      isSettings,
      showBackBtn,
      source,
      currentConversationIsRequest,
    } = this.props

    const mainBlockClasses = CX({
      d: 1,
      w1015PX: 1,
      h100PC: 1,
      flexRow: 1,
      jcEnd: 1,
    })

    return (
      <Layout
        showBackBtn
        noRightSidebar
        noComposeButton
        showGlobalFooter
        showLinkFooterInSidebar
        page='messages'
        title='Chats'
        actions={[
          {
            icon: 'cog',
            to: '/messages/settings',
          },
          {
            icon: 'pencil',
            onClick: () => this.onClickAdd(),
          },
        ]}
      >
        <div className={[_s.d, _s.flexRow, _s.w100PC, _s.calcH53PX].join(' ')}>
          <ResponsiveClassesComponent
            classNames={[_s.d, _s.flexShrink1, _s.flexGrow1].join(' ')}
            classNamesSmall={[_s.d, _s.flexShrink1, _s.flexGrow1].join(' ')}
            classNamesXS={[_s.d, _s.w100PC].join(' ')}
          >
            <ResponsiveClassesComponent
              classNames={mainBlockClasses}
              classNamesXS={[_s.d, _s.w100PC, _s.jcEnd].join(' ')}
            >

              <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                <div className={[_s.d, _s.w340PX, _s.h100PC, _s.bgPrimary, _s.borderLeft1PX, _s.borderRight1PX, _s.borderColorSecondary].join(' ')}>
                  <div className={[_s.d, _s.h100PC, _s.overflowHidden, _s.w100PC, _s.boxShadowNone].join(' ')}>
                    
                    {
                      (isSettings || currentConversationIsRequest) &&
                      <React.Fragment>
                        <ChatSettingsHeader />
                        <List
                          items={[
                            {
                              title: 'Preferences',
                              to: '/messages/settings',
                            },
                            {
                              title: 'Message Requests',
                              to: '/messages/requests',
                            },
                            {
                              title: 'Blocked Chats',
                              to: '/messages/blocks',
                            },
                            {
                              title: 'Muted Chats',
                              to: '/messages/mutes',
                            },
                          ]}
                        />
                      </React.Fragment>
                    }

                    {
                      !isSettings && !currentConversationIsRequest &&
                      <React.Fragment>
                        <ChatConversationsSearch />
                        <div className={[_s.d, _s.w100PC, _s.posAbs, _s.bottom0, _s.top60PX, _s.overflowYScroll].join(' ')}>
                          <ChatConversationRequestsListItem />
                          <ChatConversationsList source={source} />
                        </div>
                      </React.Fragment>
                    }

                  </div>
                </div>
              </Responsive>
              

              <div className={[_s.d, _s.flexGrow1, _s.h100PC, _s.bgPrimary, _s.borderColorSecondary, _s.borderRight1PX, _s.z1].join(' ')}>
                <div className={[_s.d, _s.w100PC, _s.h100PC].join(' ')}>
                  {children}
                </div>
              </div>
            </ResponsiveClassesComponent>
          </ResponsiveClassesComponent>
        </div>
      </Layout>
    )
  }

}

const mapStateToProps = (state) => {
  const selectedId = state.getIn(['chats', 'selectedChatConversationId'], null)
  const currentConversationIsRequest = selectedId ? !state.getIn(['chat_conversations', selectedId, 'is_approved'], true) : false

  return { currentConversationIsRequest }
}

const mapDispatchToProps = (dispatch) => ({
  onOpenChatConversationCreateModal() {
    dispatch(openModal(MODAL_CHAT_CONVERSATION_CREATE))
  }
})

MessagesLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  isSettings: PropTypes.bool,
  showBackBtn: PropTypes.bool,
  source: PropTypes.string,
  onOpenChatConversationCreateModal: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesLayout)