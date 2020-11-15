import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import Layout from './layout'
import Responsive from '../features/ui/util/responsive_component'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import MessagesSearch from '../features/messages/components/messages_search'
import MessagesList from '../features/messages/components/messages_list'
import MessagesHeader from '../features/messages/components/messages_header'

class MessagesLayout extends ImmutablePureComponent {

  render() {
    const {
      children,
      showBackBtn,
      title,
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
        showGlobalFooter
        noRightSidebar
        showLinkFooterInSidebar
        page='messages'
        title='Chats'
        actions={[
          {
            icon: 'cog',
            onClick: this.onOpenCommunityPageSettingsModal,
          },
          {
            icon: 'pencil',
            onClick: this.onOpenCommunityPageSettingsModal,
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
                  <div className={[_s.d, _s.w340PX].join(' ')}>
                    
                    { /* <MessagesHeader /> */ }
                    <MessagesSearch />
                    <MessagesList />

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

MessagesLayout.propTypes = {
  children: PropTypes.node,
  showBackBtn: PropTypes.bool,
  title: PropTypes.string,
}

export default MessagesLayout