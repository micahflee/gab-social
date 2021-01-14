import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import moment from 'moment-mini'
import { openModal } from '../actions/modal'
import {
  CX,
  MODAL_COMPOSE,
  MODAL_EDIT_PROFILE,
  BREAKPOINT_EXTRA_SMALL,
  PLACEHOLDER_MISSING_HEADER_SRC,
} from '../constants'
import { me } from '../initial_state'
import {
  isMobile,
  getWindowDimension,
} from '../utils/is_mobile'
import Button from '../components/button'
import Icon from '../components/icon'
import Text from '../components/text'
import { makeGetAccount } from '../selectors'

const initialState = getWindowDimension()

class WelcomeReminders extends ImmutablePureComponent {

  state = {
    isXS: isMobile(initialState.width),
    profileComplete: false,
    visible: false,
  }

  componentDidMount() {
    this.handleResize()
    this.handleSetVisible(this.props.account)
    window.addEventListener('resize', this.handleResize, false)
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props
    this.handleSetVisible(account)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false)
  }

  handleSetVisible = (account) => {
    if (!account) return

    const createdAt = account.get('created_at')
    const diff = moment().diff(createdAt, 'days')

    // Don't show to accounts older than 7 days old
    if (diff > 7) {
      this.setState({ visible: false })
      return
    }

    const hasFollowing = account.get('following_count') > 0
    const hasStatuses = account.get('statuses_count') > 0

    const avatarSrc = account.get('avatar')
    const avatarMissing = !avatarSrc ? true : avatarSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1

    const headerSrc = !!account ? account.get('header') : undefined
    const headerMissing = !headerSrc ? true : headerSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1
    const profileComplete = !avatarMissing && !headerMissing

    const visible = !hasFollowing || !hasStatuses || !profileComplete

    this.setState({ visible, profileComplete })
  }

  handleResize = () => {
    const { width } = getWindowDimension()
    this.setState({ isXS: isMobile(width) })
  }

  onOpenComposeModal = () => {
    this.props.dispatch(openModal(MODAL_COMPOSE))
  }

  onOpenEditProfileModal = () => {
    this.props.dispatch(openModal(MODAL_EDIT_PROFILE))
  }

  render() {
    const { account } = this.props
    const {
      isXS,
      visible,
      profileComplete,
    } = this.state

    if (!visible || !account) return false

    return (
      <div className={[_s.d, _s.flexRow, _s.mb10, _s.w100PC, _s.px10].join(' ')}>
        <WelcomeReminderItem
          icon='pencil'
          title='Send your first post'
          completed={account.get('statuses_count') > 0}
          to={isXS ? '/compose' : undefined}
          action={isXS ? undefined : this.onOpenComposeModal}
        />
        <WelcomeReminderItem
          icon='group'
          title='Follow others'
          to='/suggestions'
          completed={account.get('following_count') > 0}
        />
        <WelcomeReminderItem
          icon='media'
          title='Complete your profile'
          completed={profileComplete}
          action={this.onOpenEditProfileModal}
        />
      </div>
    )
  }
}

const WelcomeReminderItem = (props) => {
  const buttonClasses = CX({
    d: 1,
    overflowHidden: 1,
    flexGrow1: 1,
    outlineNone: 1,
    cursorPointer: 1,
    aiCenter: 1,
    jcCenter: 1,
    boxShadowBlock: 1,
    bgSubtle_onHover: !props.completed,
    px10: 1,
    pt10: 1,
    pb15: 1,
    bgPrimary: 1,
    borderColorSecondary: !props.completed,
    borderColorBrand: props.completed,
    border1PX: 1,
    radiusSmall: 1,
    noUnderline: 1,
  })

  return (
    <div className={[_s.d, _s.flexNormal].join(' ')}>
      <div className={[_s.d, _s.flexGrow1, _s.px10].join(' ')}>
        <Button
          noClasses
          onClick={props.completed ? null : props.action}
          to={props.completed ? null : props.to}
          className={buttonClasses}
        >
          {
            props.completed &&
            <Icon id='check' size='12px' className={[_s.d, _s.cWhite, _s.bottomRightRadiusSmall, _s.bgBrand, _s.py10, _s.px10, _s.posAbs, _s.top0, _s.left0, _s.z2].join(' ')} />
          }
          <div className={[_s.d, _s.flexRow, _s.mb10, _s.py10].join(' ')}>
            <div className={[_s.d, _s.circle, _s.borderDashed, _s.border2PX, _s.px15, _s.py15, _s.borderColorSecondary].join(' ')}>
              <Icon id={props.icon} className={[_s.px10, _s.py10, _s.cPrimary].join(' ')} size='22px' />
            </div>
          </div>
          <Text size='medium' align='center' weight='bold' className={_s.mb5}>{props.title}</Text>
        </Button>
      </div>
    </div>
  )
}


const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

WelcomeReminders.propTypes = {
  account: ImmutablePropTypes.map,
}

export default connect(mapStateToProps)(WelcomeReminders)