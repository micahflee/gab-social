import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import Sticky from 'react-stickynode'
import {
  CX,
  POPOVER_PROFILE_OPTIONS,
  PLACEHOLDER_MISSING_HEADER_SRC,
} from '../constants'
import { openPopover } from '../actions/popover'
import { me } from '../initial_state'
import AccountActionButton from './account_action_button'
import Avatar from './avatar'
import Button from './button'
import DisplayName from './display_name'
import Image from './image'
import MovedNote from './moved_note'
import TabBar from './tab_bar'
import Text from './text'

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  headerPhoto: { id: 'header_photo', defaultMessage: 'Header photo' },
  timeline: { id: 'timeline', defaultMessage: 'Timeline' },
  comments: { id: 'comments', defaultMessage: 'Comments' },
  media: { id: 'media', defaultMessage: 'Media' },
  accountFollowsYou: { id: 'account.follows_you', defaultMessage: 'Follows you' },
})

const mapDispatchToProps = (dispatch) => ({

  openProfileOptionsPopover(props) {
    dispatch(openPopover(POPOVER_PROFILE_OPTIONS, props))
  },

});

export default
@connect(null, mapDispatchToProps)
@injectIntl
class ProfileHeader extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    openProfileOptionsPopover: PropTypes.func.isRequired,
  }

  state = {
    stickied: false,
  }

  handleOpenMore = () => {
    const { openProfileOptionsPopover, account } = this.props

    openProfileOptionsPopover({
      account,
      targetRef: this.openMoreNode,
      position: 'top',
    })
  }

  onStickyStateChange = (status) => {
    if (status.status === Sticky.STATUS_FIXED) {
      this.setState({ stickied: true })
    } else {
      this.setState({ stickied: false })
    }
  }

  setOpenMoreNodeRef = (n) => {
    this.openMoreNode = n
  }

  render() {
    const { account, intl } = this.props
    const { stickied } = this.state

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
        to: `/${account.get('acct')}/media`,
        title: intl.formatMessage(messages.media),
      },
    ]

    const headerSrc = !!account ? account.get('header') : ''
    const headerMissing = headerSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1 || !headerSrc
    const avatarSize = headerMissing ? 75 : 150

    const avatarContainerClasses = CX({
      default: 1,
      circle: 1,
      mtNeg75PX: !headerMissing,
      boxShadowProfileAvatar: !headerMissing,
    })

    const stickyBarContainerClasses = CX({
      default: 1,
      flexRow: 1,
      px15: 1,
      alignItemsCenter: 1,
      displayNone: !stickied,
    })

    const tabBarContainerClasses = CX({
      default: 1,
      displayNone: stickied,
    })

    return (
      <div className={[_s.default, _s.z1, _s.width100PC].join(' ')}>

        {
          !headerMissing &&
          <div className={[_s.default, _s.height350PX, _s.width100PC, _s.radiusSmall, _s.overflowHidden].join(' ')}>
            <Image
              alt={intl.formatMessage(messages.headerPhoto)}
              className={_s.height350PX}
              src={headerSrc}
            />
          </div>
        }

        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary, _s.width100PC].join(' ')}>

          <div className={[_s.default, _s.flexRow, _s.pr15, _s.pl25, _s.mb5].join(' ')}>
            <div className={avatarContainerClasses}>
              <Avatar size={avatarSize} account={account} noHover />
            </div>

            <div className={[_s.default, _s.flexRow, _s.px15, _s.flexNormal, _s.py10].join(' ')}>
              <DisplayName account={account} isMultiline noRelationship isLarge noHover />
            </div>
          </div>
          
          <Sticky enabled onStateChange={this.onStickyStateChange}>
            <div className={[_s.default, _s.flexRow, _s.backgroundColorSecondary3, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX].join(' ')}>
              <div className={tabBarContainerClasses}>
                <TabBar tabs={tabs} isLarge />
              </div>

              <div className={stickyBarContainerClasses}>
                <Avatar size={36} account={account} noHover />
                <div className={[_s.default, _s.ml10].join(' ')}>
                  <DisplayName account={account} noUsername noRelationship noHover isLarge />
                </div>
              </div>

              {
                account && account.get('id') === me &&
                <div className={[_s.default, _s.flexRow, _s.mlAuto, _s.py5].join(' ')}>
                  <Button
                    isOutline
                    backgroundColor='none'
                    color='brand'
                    className={[_s.justifyContentCenter, _s.alignItemsCenter].join(' ')}
                    href=''
                  >
                    <Text
                      color='inherit'
                      weight='bold'
                      size='medium'
                      className={[_s.px15].join(' ')}
                    >
                      Edit Profile
                    </Text>
                  </Button>
                </div>
              }

              {
                account && account.get('id') !== me &&
                <div className={[_s.default, _s.flexRow, _s.mlAuto, _s.py5].join(' ')}>
                  <Button
                    isOutline
                    icon='ellipsis'
                    iconSize='18px'
                    iconClassName={_s.inheritFill}
                    color='brand'
                    backgroundColor='none'
                    className={[_s.justifyContentCenter, _s.alignItemsCenter, _s.mr10, _s.px10].join(' ')}
                    onClick={this.handleOpenMore}
                    buttonRef={this.setOpenMoreNodeRef}
                  />

                  <form action='https://chat.gab.com/private-message' method='POST'>
                    <Button
                      isOutline
                      type='submit'
                      icon='chat'
                      iconSize='18px'
                      iconClassName={_s.inheritFill}
                      color='brand'
                      backgroundColor='none'
                      className={[_s.justifyContentCenter, _s.alignItemsCenter, _s.mr10, _s.px10].join(' ')}
                    />
                    <input type='hidden' value={account.get('username')} name='username' />
                  </form>

                  <AccountActionButton account={account} />

                </div>
              }
            </div>
          </Sticky>
        </div>
      </div>
    )
  }

}