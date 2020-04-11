import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { HotKeys } from 'react-hotkeys'
import ImmutablePropTypes from 'react-immutable-proptypes'
import StatusContainer from '../../../containers/status_container'
import Avatar from '../../../components/avatar'
import Icon from '../../../components/icon'
import Text from '../../../components/text'
import DisplayName from '../../../components/display_name'

const messages = defineMessages({
  poll: { id: 'notification.poll', defaultMessage: 'A poll you have voted in has ended' },
  mentionedInPost: { id: 'mentioned_in_post', defaultMessage: 'mentioned you in their post' },
  mentionedInComment: { id: 'mentioned_in_comment', defaultMessage: 'mentioned you in their comment' },
  followedYouOne: { id: 'followed_you_one', defaultMessage: 'followed you' },
  followedYouMultiple: { id: 'followed_you_multiple', defaultMessage: 'and {count} others followed you' },
  likedStatusOne: { id: 'liked_status_one', defaultMessage: 'liked your status' },
  likedStatusMultiple: { id: 'liked_status_multiple', defaultMessage: 'and {count} others liked your status' },
  repostedStatusOne: { id: 'reposted_status_one', defaultMessage: 'reposted your status' },
  repostedStatusMultiple: { id: 'reposted_status_multiple', defaultMessage: 'and {count} others reposted your status' },
})

const notificationForScreenReader = (intl, message, timestamp) => {
  const output = [message]

  output.push(intl.formatDate(timestamp, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }))

  return output.join(', ')
}

export default
@injectIntl
class Notification extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    intl: PropTypes.object.isRequired,
    accounts: ImmutablePropTypes.list.isRequired,
    createdAt: PropTypes.string,
    statusId: PropTypes.string,
    type: PropTypes.string.isRequired,
  }

  render() {
    const { intl, accounts, createdAt, type, statusId } = this.props
    
    const count = !!accounts ? accounts.size : 0

    let message
    let icon
    switch (type) {
      case 'follow':
        icon = 'group'
        message =  intl.formatMessage(count > 1 ? messages.followedYouMultiple : messages.followedYouOne, {
          count: count - 1,
        })
        break
      case 'mention':
        icon = 'comment'
        message = intl.formatMessage(messages.mentionedInPost)
        break
      case 'like':
        icon = 'like'
        message = intl.formatMessage(count > 1 ? messages.likedStatusMultiple : messages.likedStatusOne, {
          count: count - 1,
        })
        break
      case 'repost':
        icon = 'repost'
        message = intl.formatMessage(count > 1 ? messages.repostedStatusMultiple : messages.repostedStatusOne, {
          count: count - 1,
        })
        break
      case 'poll':
        icon = 'poll'
        message = intl.formatMessage(messages.poll)
        break
      default:
        return null
    }

    return (
      <div className={[_s.default, _s.px10, _s.cursorPointer, _s.backgroundSubtle_onHover].join(' ')}>
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Icon id={icon} height='20px' width='20px' className={_s.mt5} />

            <div className={[_s.default, _s.ml15, _s.flexNormal].join(' ')}>
              <div className={[_s.default, _s.flexRow].join(' ')}>
                {
                  accounts.slice(0, 8).map((account, i) => (
                    <NavLink
                      to={`/${account.get('acct')}`}
                      key={`fav-avatar-${i}`}
                      className={_s.mr5}
                    >
                      <Avatar size={30} account={account} />
                    </NavLink>
                  ))
                }
              </div>
              <div className={[_s.default, _s.pt10].join(' ')}>
                <div className={[_s.default, _s.flexRow].join(' ')}>
                  <div className={_s.text}>
                    {
                      accounts.slice(0, 1).map((account, i) => (
                        <DisplayName key={i} account={account} noUsername />
                      ))
                    }
                  </div>
                  <Text size='medium'>
                    {' '}
                    {message}
                  </Text>
                </div>
              </div>
              {
                !!statusId &&
                <div className={[_s.default, _s.pt10, _s.mt5].join(' ')}>
                  <StatusContainer
                    id={statusId}
                    isChild
                  />
                </div>
              }
            </div>

          </div>
        </div>
      </div>
    )
  }

}
