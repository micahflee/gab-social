import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import Sticky from 'react-stickynode'
import classNames from 'classnames/bind'
import { openPopover } from '../actions/popover'
import { me } from '../initial_state'
import AccountActionButton from './account_action_button'
import Avatar from './avatar'
import Button from './button'
import DisplayName from './display_name'
import Icon from './icon'
import Image from './image'
import MovedNote from './moved_note'
import TabBar from './tab_bar'
import Text from './text'

const cx = classNames.bind(_s)

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  headerPhoto: { id: 'header_photo', defaultMessage: 'Header photo' },
})

const mapDispatchToProps = (dispatch) => ({

  openProfileOptionsPopover(props) {
    dispatch(openPopover('PROFILE_OPTIONS', props))
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
      targetRef: this.openMoreNode,
      position: 'top',
      account: this.props.account,
    })
  }

  // : todo :
  makeInfo = () => {
    const { account, intl } = this.props

    const info = []

    if (!account || !me) return info;

    if (me !== account.get('id') && account.getIn(['relationship', 'followed_by'])) {
      info.push(<span key='followed_by' className='relationship-tag'>{intl.formatMessage(messages.accountFollowsYou)}</span>);
    } else if (me !== account.get('id') && account.getIn(['relationship', 'blocking'])) {
      info.push(<span key='blocked' className='relationship-tag'>{intl.formatMessage(messages.accountBlocked)}</span>);
    }

    if (me !== account.get('id') && account.getIn(['relationship', 'muting'])) {
      info.push(<span key='muted' className='relationship-tag'>{intl.formatMessage(messages.accountMuted)}</span>);
    } else if (me !== account.get('id') && account.getIn(['relationship', 'domain_blocking'])) {
      info.push(<span key='domain_blocked' className='relationship-tag'>{intl.formatMessage(messages.domainBlocked)}</span>);
    }

    return info
  }

  onStickyStateChange = (status) => {
    switch (status.status) {
      case Sticky.STATUS_FIXED:
        this.setState({ stickied: true })
        break;
      default:
        this.setState({ stickied: false })
        break;
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
        title: 'Timeline',
      },
      {
        to: `/${account.get('acct')}/comments`,
        title: 'Comments',
      },
      {
        to: `/${account.get('acct')}/media`,
        title: 'Media',
      },
      {
        to: '',
        title: 'More',
      },
    ]

    const headerSrc = !!account ? account.get('header') : ''
    const headerMissing = headerSrc.indexOf('/headers/original/missing.png') > -1 || !headerSrc
    const avatarSize = headerMissing ? 75 : 150

    const avatarContainerClasses = cx({
      circle: 1,
      mtNeg75PX: !headerMissing,
      borderColorWhite: 1,
      border2PX: 1,
    })

    const stickyBarContainerClasses = cx({
      default: 1,
      flexRow: 1,
      px15: 1,
      alignItemsCenter: 1,
      displayNone: !stickied,
    })

    const tabBarContainerClasses = cx({
      default: 1,
      displayNone: stickied,
    })


    // : todo : "follows you", "mutual follow"

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

          <div className={[_s.default, _s.flexRow, _s.px15, _s.mb5].join(' ')}>
            <div className={avatarContainerClasses}>
              <Avatar size={avatarSize} account={account} />
            </div>

            <div className={[_s.default, _s.flexRow, _s.px15, _s.py10].join(' ')}>
              <DisplayName account={account} multiline large />
              {
                account && account.get('locked') &&
                <Icon id='lock-filled' size='14px' className={[_s.mt10, _s.ml10].join(' ')} />
              }
              {
                /* : todo :
                account.getIn(['relationship', 'muting'])
                */
              }
            </div>
          </div>
          
          <Sticky enabled onStateChange={this.onStickyStateChange}>
            <div className={[_s.default, _s.flexRow, _s.backgroundColorSecondary3, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX].join(' ')}>
              <div className={tabBarContainerClasses}>
                <TabBar tabs={tabs} isLarge />
              </div>

              <div className={stickyBarContainerClasses}>
                <Avatar size={36} account={account} />
                <div className={[_s.default, _s.ml10].join(' ')}>
                  <DisplayName account={account} noUsername large />
                </div>
              </div>

              {
                account && account.get('id') === me &&
                <div className={[_s.default, _s.flexRow, _s.marginLeftAuto, _s.py5].join(' ')}>
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
                <div className={[_s.default, _s.flexRow, _s.marginLeftAuto, _s.py5].join(' ')}>
                  <div ref={this.setOpenMoreNodeRef}>
                    <Button
                      isOutline
                      icon='ellipsis'
                      iconSize='18px'
                      iconClassName={_s.inheritFill}
                      color='brand'
                      backgroundColor='none'
                      className={[_s.justifyContentCenter, _s.alignItemsCenter, _s.mr10, _s.px10].join(' ')}
                      onClick={this.handleOpenMore}
                    />
                  </div>

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