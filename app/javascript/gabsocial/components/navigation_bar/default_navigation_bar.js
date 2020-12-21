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

class DefaultNavigationBar extends ImmutablePureComponent {

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
      minH53PX: emailConfirmed,
      minH106PX: !emailConfirmed,
      w100PC: 1,
    })

    const innerNavigationContainerClasses = CX({
      d: 1,
      minH53PX: 1,
      bgNavigation: 1,
      aiCenter: 1,
      z3: 1,
      top0: emailConfirmed,
      top53PX: !emailConfirmed,
      right0: 1,
      left0: 1,
      posFixed: 1,
    })

    const isHome = title === 'Home'

    return (
      <div className={navigationContainerClasses}>

        {
          !emailConfirmed &&
          <div className={[_s.d, _s.posFixed, _s.top0, _s.right0, _s.left0, _s.z3, _s.h53PX, _s.w100PC, _s.bgNavigationBlend].join(' ')}>
            <div className={[_s.d, _s.aiCenter, _s.jcCenter, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.flexRow, _s.w1255PX, _s.h53PX, _s.mlAuto, _s.mrAuto].join(' ')}>
              <div className={[_s.mr15, _s.colorNavigation, _s.pl10].join(' ')}>
                <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                  <Text color='inherit' size='small'>
                    Confirm your email address to access all of Gab's features.&nbsp;
                  </Text>
                </Responsive>
                <Text color='inherit' size='small'>
                  A confirmation message was sent to&nbsp;
                  <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                    <Text weight='bold' color='inherit' size='small'>{meEmail}</Text>
                  </Responsive>
                  <Responsive max={BREAKPOINT_EXTRA_SMALL}>
                    you
                  </Responsive>
                </Text>
              </div>
              <Button
                isNarrow
                backgroundColor='secondary'
                color='secondary'
                className={_s.mr10}
                onClick={this.handleOnClickResendConfirmationEmail}
              >
                <Text color='inherit' weight='medium'>
                  Resend Confirmation
                </Text>
              </Button>
            </div>
          </div>
        }

        <div className={innerNavigationContainerClasses}>

          <div className={[_s.d, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.flexRow, _s.w1255PX].join(' ')}>

            { /** Default */}
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>

              <div className={[_s.d, _s.flexRow].join(' ')}>

                <h1 className={[_s.d, _s.mr15].join(' ')}>
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

                <div className={[_s.d, _s.w340PX, _s.mr10].join(' ')}>
                  <Search isInNav />
                </div>

              </div>

              <div className={[_s.d, _s.mlAuto].join(' ')}>
                {
                  !noActions &&
                  <div className={[_s.d, _s.h53PX, _s.pl15, _s.flexRow, _s.aiCenter, _s.jcSpaceBetween].join(' ')}>

                    <NavigationBarButton title='Home' icon='home' to='/home' />
                    <NavigationBarButton title='Explore' icon='explore' to='/explore' />
                    <NavigationBarButton title='News' icon='news' to='/news' />
                    <NavigationBarButton title='Groups' icon='group' to='/groups' />
                    <NavigationBarButton title='TV' icon='tv' href='https://tv.gab.com' />

                    <div className={[_s.d, _s.h20PX, _s.w1PX, _s.mr10, _s.ml10, _s.bgNavigationBlend].join(' ')} />

                    <NavigationBarButton attrTitle='Notifications' icon='notifications' to='/notifications' count={notificationCount} />
                    <NavigationBarButton attrTitle='Chats' icon='chat' to='/messages' count={unreadChatsCount} />
                    <NavigationBarButton attrTitle='Dark/Muted/Light/White Mode' icon='light-bulb' onClick={this.handleOnClickLightBulb} />

                    <div className={[_s.d, _s.h20PX, _s.w1PX, _s.mr10, _s.ml10, _s.bgNavigationBlend].join(' ')} />
                  
                    {
                      !!account &&
                      <button
                        ref={this.setAvatarNode}
                        title={account.get('display_name')}
                        onClick={this.handleOnOpenNavSettingsPopover}
                        className={[_s.h53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.d, _s.jcCenter, _s.ml15].join(' ')}
                      >
                        <Avatar account={account} size={34} noHover />
                      </button>
                    }
                  </div>
                }
              </div>

            </Responsive>
            
            { /** Mobile */}
            <Responsive max={BREAKPOINT_EXTRA_SMALL}>
              <div className={[_s.d, _s.aiStart, _s.pl10].join(' ')}>
                {
                  !!account && isHome &&
                  <button
                    title='Gab.com'
                    href='/'
                    className={[_s.h53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.d, _s.jcCenter].join(' ')}
                  >
                    <Icon id='logo' className={_s.fillNavigationBrand} minimizeLogo={logoDisabled} />
                  </button>
                }
                {
                  showBackBtn && !isHome &&
                  <BackButton
                    className={_s.h53PX}
                    icon='angle-left'
                    iconSize='18px'
                    iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
                  />
                }
              </div>
              
              {
                !!title && !isHome &&
                <div className={[_s.d, _s.h53PX, _s.jcCenter].join(' ')}>
                  <Heading size='h1'>
                    <Text className={_s.colorNavigation} size='extraExtraLarge' weight='bold'>
                      {title}
                    </Text>
                  </Heading>
                </div>
              }

              <div className={[_s.d, _s.minW84PX, _s.pr15, _s.mlAuto].join(' ')}>
                <div className={[_s.d, _s.h100PC, _s.bgTransparent, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.mlAuto].join(' ')}>
                  {
                    actions && actions.map((action, i) => (
                      <NavigationBarButton
                        attrTitle={action.attrTitle}
                        title={action.title}
                        icon={action.icon}
                        count={action.count}
                        to={action.to || undefined}
                        href={action.href || undefined}
                        onClick={action.onClick ? () => action.onClick() : undefined}
                        key={`action-btn-${i}`}
                        isXS
                      />
                    ))
                  }
                </div>
              </div>
            </Responsive>

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

DefaultNavigationBar.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DefaultNavigationBar)