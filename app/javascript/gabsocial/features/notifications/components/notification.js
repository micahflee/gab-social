import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { HotKeys } from 'react-hotkeys'
import ImmutablePropTypes from 'react-immutable-proptypes'
import StatusContainer from '../../../containers/status_container'
import AccountContainer from '../../../containers/account_container'
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

  renderMention = () => {
    const { intl, accounts, createdAt, statusId } = this.props

    if (accounts.size === 0) return null
    const account = accounts.get(0)

    // : todo : render statuscontainer or commentcontainer

    return (
      <div className={[_s.default, _s.px10].join(' ')}>
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Icon id='comment' height='20px' width='20px' className={_s.mt5} />

            <div className={[_s.default, _s.ml15, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.flexRow].join(' ')}>
                <NavLink to={`/${account.get('acct')}`}>
                  <Avatar size='30' account={account} />
                </NavLink>
              </div>
              <div className={[_s.default, _s.pt10].join(' ')}>
                <div className={[_s.default, _s.flexRow].join(' ')}>
                  <div className={_s.text}>
                    <DisplayName account={account} noUsername />
                  </div>
                  <Text size='medium'>
                    {' '}
                    {intl.formatMessage(messages.mentionedInPost)}
                  </Text>
                </div>
              </div>

              <div className={[_s.default, _s.pt10, _s.mt5].join(' ')}>
                <StatusContainer
                  id={statusId}
                  isChild
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  renderPoll = () => {
    const { intl, statusId } = this.props

    return (
      <div className={[_s.default, _s.px10].join(' ')}>
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Icon id='poll' height='20px' width='20px' className={_s.mt5} />

            <div className={[_s.default, _s.ml15, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.pt5].join(' ')}>
                <Text size='medium'>
                  {intl.formatMessage(messages.poll)}
                </Text>
              </div>

              <div className={[_s.default, _s.pt10, _s.mt10].join(' ')}>
                <StatusContainer
                  id={statusId}
                  isChild
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  renderFollow = () => {
    const { intl, accounts, statusId } = this.props

    const count = accounts.size
    if (count === 0) return null

    return (
      <div className={[_s.default, _s.px10, _s.cursorPointer, _s.backgroundSubtle_onHover].join(' ')}>
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Icon id='group' height='20px' width='20px' className={_s.mt5} />

            <div className={[_s.default, _s.ml15, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.flexRow].join(' ')}>
                {
                  accounts.slice(0, 8).map((account, i) => (
                    <NavLink
                      to={`/${account.get('acct')}`}
                      key={`fav-avatar-${i}`}
                      className={_s.mr5}
                    >
                      <Avatar size='30' account={account} />
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
                    {intl.formatMessage(count > 1 ? messages.followedYouMultiple : messages.followedYouOne, {
                      count: count - 1,
                    })}
                  </Text>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  renderLike = () => {
    const { intl, accounts, statusId } = this.props

    const count = accounts.size
    if (count === 0 || !statusId) return null

    return (
      <div className={[_s.default, _s.px10, _s.cursorPointer, _s.backgroundSubtle_onHover].join(' ')}>
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Icon id='like' height='20px' width='20px' className={_s.mt5} />

            <div className={[_s.default, _s.ml15, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.flexRow].join(' ')}>
                {
                  accounts.slice(0, 8).map((account, i) => (
                    <NavLink
                      to={`/${account.get('acct')}`}
                      key={`fav-avatar-${i}`}
                      className={_s.mr5}
                    >
                      <Avatar size='30' account={account} />
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
                    {intl.formatMessage(count > 1 ? messages.likedStatusMultiple : messages.likedStatusOne, {
                      count: count - 1,
                    })}
                  </Text>
                </div>
              </div>
              <div className={[_s.default, _s.pt10, _s.mt5].join(' ')}>
                <StatusContainer
                  id={statusId}
                  isChild
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  renderRepost = () => {
    const { intl, accounts, statusId } = this.props

    const count = accounts.size
    if (count === 0 || !statusId) return null

    return (
      <div className={[_s.default, _s.px10, _s.cursorPointer, _s.backgroundSubtle_onHover].join(' ')}>
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Icon id='repost' height='20px' width='20px' className={_s.mt5} />

            <div className={[_s.default, _s.ml15, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.flexRow].join(' ')}>
                {
                  accounts.slice(0, 8).map((account, i) => (
                    <NavLink
                      to={`/${account.get('acct')}`}
                      key={`fav-avatar-${i}`}
                      className={_s.mr5}
                    >
                      <Avatar size='30' account={account} />
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
                    {intl.formatMessage(count > 1 ? messages.repostedStatusMultiple : messages.repostedStatusOne, {
                      count: count - 1,
                    })}
                  </Text>
                </div>
              </div>
              <div className={[_s.default, _s.pt10, _s.mt5].join(' ')}>
                <StatusContainer
                  id={statusId}
                  isChild
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  render() {
    const { type } = this.props

    switch (type) {
      case 'follow':
        return this.renderFollow()
      case 'mention':
        return this.renderMention()
      case 'like':
        return this.renderLike()
      case 'repost':
        return this.renderRepost();
      case 'poll':
        return this.renderPoll()
    }

    return null
  }

}
