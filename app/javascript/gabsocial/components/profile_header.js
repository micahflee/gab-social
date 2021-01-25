import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import Sticky from 'react-stickynode'
import {
  CX,
  POPOVER_PROFILE_OPTIONS,
  PLACEHOLDER_MISSING_HEADER_SRC,
  MODAL_EDIT_PROFILE,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import {
  fetchRelationships,
} from '../actions/accounts'
import {
  addShortcut,
  removeShortcut,
} from '../actions/shortcuts'
import { createChatConversation } from '../actions/chat_conversations'
import { openModal } from '../actions/modal'
import { openPopover } from '../actions/popover'
import { me } from '../initial_state'
import AccountActionButton from './account_action_button'
import Avatar from './avatar'
import Button from './button'
import DisplayName from './display_name'
import Image from './image'
import TabBar from './tab_bar'
import Pills from './pills'
import Text from './text'
import Responsive from '../features/ui/util/responsive_component';
import ProfileHeaderXSPlaceholder from './placeholder/profile_header_xs_placeholder'

class ProfileHeader extends ImmutablePureComponent {

  static contextTypes = {
		router: PropTypes.object
  }
  
  state = {
    stickied: false,
  }

  componentDidMount() {
    this.checkRelationships(this.props.account)
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props
    if (prevProps.account !== account) {
      this.checkRelationships(account)
    }
  }

  checkRelationships = (account) => {
    if (!account) return
    if (!account.get('relationship')) {
      this.props.onFetchRelationships(account.get('id'))
    }
  }

  handleOnEditProfile = () => {
    this.props.onEditProfile()
  }

  handleOpenMore = () => {
    const { openProfileOptionsPopover, account } = this.props

    openProfileOptionsPopover({
      account,
      targetRef: this.openMoreNode,
      position: 'left',
    })
  }

  handleToggleShortcut = () => {
    const { account, isShortcut } = this.props
    const accountId = !!account ? account.get('id') : null
    
    if (!accountId) return

    if (isShortcut) {
      this.props.onRemoveShortcut(accountId)
    } else {
      this.props.onAddShortcut(accountId)
    }
  }

  onStickyStateChange = (status) => {
    if (status.status === Sticky.STATUS_FIXED) {
      this.setState({ stickied: true })
    } else {
      this.setState({ stickied: false })
    }
  }

  handleOnCreateChatConversation = () => {
    const { account } = this.props
    const accountId = !!account ? account.get('id') : null
    
    if (!accountId) return

    this.props.onCreateChatConversation(accountId, this.context.router.history)
  }

  setOpenMoreNodeRef = (n) => {
    this.openMoreNode = n
  }

  render() {
    const {
      account,
      children,
      intl,
      isShortcut,
      isXS
    } = this.props
    const { stickied } = this.state

    if (isXS && !account) {
      return (
        <div className={[_s.d, _s.z1, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.z1, _s.w100PC, _s.boxShadowBlock, _s.bgPrimary].join(' ')}>
            <div className={[_s.d, _s.w100PC].join(' ')}>
              <ProfileHeaderXSPlaceholder />
            </div>
          </div>
        </div>
      )
    }

    const tabs = !account ? null : [
      {
        to: `/${account.get('acct')}`,
        title: intl.formatMessage(messages.timeline),
      },
      {
        to: `/${account.get('acct')}/comments`,
        title: intl.formatMessage(messages.comments),
      },
      {
        to: `/${account.get('acct')}/photos`,
        title: intl.formatMessage(messages.photos),
      },
      {
        to: `/${account.get('acct')}/videos`,
        title: intl.formatMessage(messages.videos),
      },
    ]

    const isMyProfile = !account ? false : account.get('id') === me
    if (isMyProfile) {
      tabs.push({
        to: `/${account.get('acct')}/likes`,
        title: 'Likes',
      })
      tabs.push({
        to: `/${account.get('acct')}/bookmarks`,
        title: intl.formatMessage(messages.bookmarks),
      })
    }

    const headerSrc = !!account ? account.get('header') : undefined
    const headerMissing = !headerSrc ? true : headerSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1
    const avatarSize = headerMissing ? 75 : 150
    const top = headerMissing ? -46 : -430

    const avatarContainerClasses = CX({
      d: 1,
      circle: 1,
      mtNeg75PX: !headerMissing,
      boxShadowProfileAvatar: !headerMissing,
    })

    const stickyBarContainerClasses = CX({
      d: 1,
      flexRow: 1,
      px15: 1,
      aiCenter: 1,
      displayNone: !stickied,
    })

    const tabBarContainerClasses = CX({
      d: 1,
      displayNone: stickied,
    })

    const mobileDescriptionContainerClasses = CX({
      d: 1,
      w100PC: 1,
      px15: 1,
      mb10: 1,
      pt15: !!me,
    })

    return (
      <div className={[_s.d, _s.z1, _s.w100PC].join(' ')}>
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.d, _s.z1, _s.w100PC, _s.aiCenter, _s.boxShadowBlock, _s.bgPrimary].join(' ')}>

            <div className={[_s.d, _s.w100PC].join(' ')}>
              {
                !headerMissing &&
                <div className={[_s.d, _s.h172PX, _s.w100PC, _s.overflowHidden].join(' ')}>
                  <Image
                    alt={intl.formatMessage(messages.headerPhoto)}
                    className={_s.h100PC}
                    src={headerSrc}
                    expandOnClick
                  />
                </div>
              }
              {
                headerMissing &&
                <div className={[_s.d, _s.h53PX, _s.w100PC, _s.bgPrimary].join(' ')} />
              }

              <div className={[_s.d, _s.w100PC].join(' ')}>

                <div className={[_s.d, _s.px15].join(' ')}>
                  <div class={[_s.d, _s.flexRow].join(' ')}>
                    <div className={[_s.d, _s.circle, _s.boxShadowProfileAvatar, _s.mtNeg32PX].join(' ')}>
                      <Avatar size={88} account={account} noHover expandOnClick />
                    </div>
                    {
                      account && account.get('id') === me &&
                      <div className={[_s.d, _s.flexRow, _s.pt10, _s.flexGrow1, _s.h40PX, _s.jcEnd].join(' ')}>
                        <Button
                          isOutline
                          backgroundColor='none'
                          color='brand'
                          className={[_s.jcCenter, _s.aiCenter, _s.h40PX].join(' ')}
                          onClick={this.handleOnEditProfile}
                        >
                          <Text color='inherit' weight='bold' size='medium' className={_s.px15}>
                            {intl.formatMessage(messages.editProfile)}
                          </Text>
                        </Button>
                      </div>
                    }
  
                    {
                      account && account.get('id') !== me && !!me &&
                      <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.pt15, _s.flexGrow1, _s.h40PX, _s.jcEnd].join(' ')}>
                        <Button
                          icon={isShortcut ? 'star' : 'star-outline'}
                          iconSize='18px'
                          color='brand'
                          backgroundColor='none'
                          className={[_s.jcCenter, _s.aiCenter, _s.px10, _s.mr10].join(' ')}
                          onClick={this.handleToggleShortcut}
                        />
                        <div className={[_s.d, _s.flexRow, _s.h40PX].join(' ')}>
                          <AccountActionButton account={account} />
                        </div>
                      </div>
                    }
                  </div>

                  <div className={[_s.d, _s.flexRow, _s.flexNormal, _s.pt10].join(' ')}>
                    <DisplayName
                      account={account}
                      isMultiline
                      isLarge
                      noHover
                    />
                  </div>
                </div>

                <div className={[_s.d, _s.bgPrimary, _s.aiCenter].join(' ')}>
                  <div className={mobileDescriptionContainerClasses}>
                    {children}
                  </div>

                  <div className={[_s.d, _s.mt10, _s.mb10, _s.pt5, _s.w100PC].join(' ')}>
                    <Pills pills={tabs} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </Responsive>

        { /** desktop */ }
        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <Sticky top={top} enabled onStateChange={this.onStickyStateChange}>
            <div className={[_s.d, _s.z1, _s.w100PC, _s.aiCenter, _s.boxShadowBlock, _s.bgPrimary].join(' ')}>

              <div className={[_s.d, _s.w1255PX].join(' ')}>
                {
                  !headerMissing &&
                  <div className={[_s.d, _s.h400PX, _s.w100PC, _s.bottomRightRadiusSmall, _s.bottomLeftRadiusSmall, _s.overflowHidden].join(' ')}>
                    <Image
                      alt={intl.formatMessage(messages.headerPhoto)}
                      className={_s.h100PC}
                      src={headerSrc}
                      expandOnClick
                    />
                  </div>
                }
                {
                  headerMissing &&
                  <div className={[_s.d, _s.h20PX, _s.w100PC].join(' ')} />
                }

                <div className={[_s.d, _s.w1015PX, _s.mlAuto, _s.mrAuto].join(' ')}>

                  <div className={[_s.d, _s.flexRow, _s.pr15, _s.pl25, _s.mb5].join(' ')}>
                    <div className={avatarContainerClasses}>
                      {
                        account &&
                        <Avatar size={avatarSize} account={account} noHover expandOnClick />
                      }
                      {
                        !account &&
                        <div
                          className={[_s.d, _s.circle, _s.overflowHidden, _s.bgSecondary].join(' ')}
                          style={{
                            width: `${avatarSize}px`,
                            height: `${avatarSize}px`,
                          }}
                        />
                      }
                    </div>

                    <div className={[_s.d, _s.flexRow, _s.px15, _s.flexNormal, _s.py10].join(' ')}>
                      <DisplayName account={account} isMultiline isLarge noHover />
                    </div>
                  </div>

                  <div className={[_s.d, _s.flexRow, _s.bgPrimary, _s.h53PX].join(' ')}>
                    <div className={tabBarContainerClasses}>
                      <TabBar tabs={tabs} isLarge />
                    </div>

                    <div className={stickyBarContainerClasses}>
                      <Avatar size={36} account={account} noHover />
                      <div className={[_s.d, _s.ml10].join(' ')}>
                        <DisplayName account={account} noUsername noRelationship noHover isLarge />
                      </div>
                    </div>

                    {
                      account && account.get('id') === me &&
                      <div className={[_s.d, _s.flexRow, _s.mlAuto, _s.py5].join(' ')}>
                        <Button
                          isOutline
                          backgroundColor='none'
                          color='brand'
                          className={[_s.jcCenter, _s.aiCenter].join(' ')}
                          onClick={this.handleOnEditProfile}
                        >
                          <Text color='inherit' weight='bold' size='medium' className={_s.px15}>
                            {intl.formatMessage(messages.editProfile)}
                          </Text>
                        </Button>
                      </div>
                    }

                    {
                      account && account.get('id') !== me &&
                      <div className={[_s.d, _s.flexRow, _s.mlAuto, _s.pb2, _s.pt7].join(' ')}>
                        {
                          !!me &&
                          <div className={[_s.d, _s.flexRow, _s.mr5, _s.aiCenter, _s.jcCenter].join(' ')}>
                            <Button
                              icon={isShortcut ? 'star' : 'star-outline'}
                              iconSize='18px'
                              color='brand'
                              backgroundColor='none'
                              className={[_s.jcCenter, _s.aiCenter, _s.px10, _s.mr10].join(' ')}
                              onClick={this.handleToggleShortcut}
                            />
                            <Button
                              isOutline
                              icon='ellipsis'
                              iconSize='18px'
                              iconClassName={_s.inheritFill}
                              color='brand'
                              backgroundColor='none'
                              className={[_s.jcCenter, _s.aiCenter, _s.mr15, _s.px10].join(' ')}
                              onClick={this.handleOpenMore}
                              buttonRef={this.setOpenMoreNodeRef}
                            />
                          </div>
                        }

                        <div className={[_s.d, _s.flexRow, _s.pb2].join(' ')}>
                          <AccountActionButton account={account} />
                        </div>

                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Sticky>
        </Responsive>
      </div>
    )
  }

}

const mapStateToProps = (state, { account }) => {
  const accountId = account ? account.get('id') : null
  const shortcuts = state.getIn(['shortcuts', 'items'])
  const isShortcut = !!shortcuts.find((s) => {
    return s.get('shortcut_id') == accountId && s.get('shortcut_type') === 'account'
  })
  return { isShortcut }
}

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Following' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  headerPhoto: { id: 'header_photo', defaultMessage: 'Header photo' },
  timeline: { id: 'timeline', defaultMessage: 'Timeline' },
  comments: { id: 'comments', defaultMessage: 'Comments' },
  photos: { id: 'photos', defaultMessage: 'Photos' },
  videos: { id: 'videos', defaultMessage: 'Videos' },
  bookmarks: { id: 'bookmarks', defaultMessage: 'Bookmarks' },
  accountFollowsYou: { id: 'account.follows_you', defaultMessage: 'Follows you' },
  editProfile: { id: "account.edit_profile", defaultMessage: "Edit profile" },
})

const mapDispatchToProps = (dispatch) => ({
  openProfileOptionsPopover(props) {
    dispatch(openPopover(POPOVER_PROFILE_OPTIONS, props))
  },
  onEditProfile() {
    dispatch(openModal(MODAL_EDIT_PROFILE))
  },
  onAddShortcut(accountId) {
    dispatch(addShortcut('account', accountId))
  },
  onRemoveShortcut(accountId) {
    dispatch(removeShortcut(null, 'account', accountId))
  },
  onCreateChatConversation(accountId, routerHistory) {
    dispatch(createChatConversation(accountId, routerHistory))
  },
  onFetchRelationships(accountId) {
    dispatch(fetchRelationships([accountId]))
  },
});

ProfileHeader.propTypes = {
  account: ImmutablePropTypes.map,
  children: PropTypes.any,
  intl: PropTypes.object.isRequired,
  onAddShortcut: PropTypes.func.isRequired,
  onEditProfile: PropTypes.func.isRequired,
  onRemoveShortcut: PropTypes.func.isRequired,
  openProfileOptionsPopover: PropTypes.func.isRequired,
  isShortcut: PropTypes.bool.isRequired,
  isXS: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileHeader))