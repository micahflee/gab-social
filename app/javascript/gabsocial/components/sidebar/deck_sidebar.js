import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openPopover } from '../../actions/popover'
import { changeSetting, saveSettings } from '../../actions/settings'
import { resendUserConfirmationEmail } from '../../actions/user'
import { openModal } from '../../actions/modal'
import {
  BREAKPOINT_EXTRA_SMALL,
  MODAL_EMAIL_CONFIRMATION_REMINDER,
} from '../../constants'
import {
  me,
  meEmail,
  emailConfirmed,
} from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import Responsive from '../../features/ui/util/responsive_component'
import {
  CX,
  THEMES,
  DEFAULT_THEME,
  POPOVER_NAV_SETTINGS,
} from '../../constants'
import Avatar from '../avatar'
import BackButton from '../back_button'
import Button from '../button'
import Heading from '../heading'
import Icon from '../icon'
import NavigationBarButton from '../navigation_bar_button'
import Search from '../search'
import Text from '../text'
import Divider from '../divider'

class DeckSidebar extends ImmutablePureComponent {

  handleOnClickLightBulb = () => {
    let index = THEMES.findIndex((t) => t === this.props.theme)
    const nextIndex = (index === THEMES.length -1) ? 0 : index += 1
    const newTheme = THEMES[nextIndex]
    this.props.onChange('theme', newTheme)
  }

  handleOnOpenNavSettingsPopover = () => {
    this.props.onOpenNavSettingsPopover(this.avatarNode)
  }

  handleOnClickResendConfirmationEmail = () => {
    const { emailConfirmationResends } = this.props
    if (emailConfirmationResends % 2 === 0 && emailConfirmationResends > 0) {
      this.props.onOpenEmailModal()
    }
    this.props.onResendUserConfirmationEmail()
  }

  setAvatarNode = (c) => {
    this.avatarNode = c
  }

  render() {
    const {
      title,
      showBackBtn,
      actions,
      tabs,
      account,
      noActions,
      logoDisabled,
      unreadChatsCount,
      notificationCount,
    } = this.props

    const navigationContainerClasses = CX({
      d: 1,
      z4: 1,
      w76PX: 1,
      w100PC: 1,
    })

    const innerNavigationContainerClasses = CX({
      d: 1,
      w76PX: 1,
      bgNavigation: 1,
      aiCenter: 1,
      z3: 1,
      top0: 1,
      bottom0: 1,
      left0: 1,
      borderRight1PX: 1,
      borderColorSecondary: 1,
      posFixed: 1,
    })

    const isHome = title === 'Home'

    return (
      <div className={navigationContainerClasses}>

        <div className={innerNavigationContainerClasses}>

          <div className={[_s.d, _s.flexRow, _s.w76PX, _s.h100PC].join(' ')}>

            <div className={[_s.d].join(' ')}>

              <h1 className={[_s.d].join(' ')}>
                <Button
                  to='/'
                  isText
                  title='Gab'
                  aria-label='Gab'
                  color='none'
                  backgroundColor='none'
                  className={[_s.d, _s.jcCenter, _s.noSelect, _s.noUnderline, _s.h53PX, _s.cursorPointer, _s.px10, _s.mr5].join(' ')}
                >
                  <Icon id='logo' className={_s.fillNavigationBrand} minimizeLogo={logoDisabled} />
                </Button>
              </h1>

              <div className={[_s.d, _s.px10].join(' ')}>

                <NavigationBarButton icon='pencil' />
                
                <NavigationBarButton icon='search' />

                <Divider isSmall />

                <Divider isSmall />

                <NavigationBarButton title='&nbsp;' icon='add' />
              </div>

              <div className={[_s.d, _s.mtAuto, _s.aiCenter].join(' ')}>

                <Divider isSmall />

                <NavigationBarButton attrTitle='Dark/Muted/Light/White Mode' icon='light-bulb' onClick={this.handleOnClickLightBulb} />

                <button
                  ref={this.setAvatarNode}
                  title={account.get('display_name')}
                  onClick={this.handleOnOpenNavSettingsPopover}
                  className={[_s.h53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.d, _s.jcCenter].join(' ')}
                >
                  <Avatar account={account} size={34} noHover />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
  emailConfirmationResends: state.getIn(['user', 'emailConfirmationResends'], 0),
  theme: state.getIn(['settings', 'displayOptions', 'theme'], DEFAULT_THEME),
  logoDisabled: state.getIn(['settings', 'displayOptions', 'logoDisabled'], false),
  notificationCount: state.getIn(['notifications', 'unread']),
  unreadChatsCount: state.getIn(['chats', 'chatsUnreadCount']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenNavSettingsPopover(targetRef) {
    dispatch(openPopover(POPOVER_NAV_SETTINGS, {
      targetRef,
      position: 'left-end',
    }))
  },
  onOpenEmailModal() {
    dispatch(openModal(MODAL_EMAIL_CONFIRMATION_REMINDER))
  },
  onResendUserConfirmationEmail() {
    dispatch(resendUserConfirmationEmail())
  },
  onChange(key, value) {
    dispatch(changeSetting(['displayOptions', key], value))
    dispatch(saveSettings())
  },
})

DeckSidebar.propTypes = {
  account: ImmutablePropTypes.map,
  actions: PropTypes.array,
  tabs: PropTypes.array,
  title: PropTypes.string,
  showBackBtn: PropTypes.bool,
  notificationCount: PropTypes.number.isRequired,
  unreadChatsCount: PropTypes.number.isRequired,
  onOpenNavSettingsPopover: PropTypes.func.isRequired,
  onOpenEmailModal: PropTypes.func.isRequired,
  onResendUserConfirmationEmail: PropTypes.func.isRequired,
  emailConfirmationResends: PropTypes.number.isRequired,
  noActions: PropTypes.bool,
  theme: PropTypes.string,
  logoDisabled: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckSidebar)