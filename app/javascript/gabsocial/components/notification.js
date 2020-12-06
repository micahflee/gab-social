import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../initial_state' 
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants' 
import Responsive from '../features/ui/util/responsive_component'
import StatusContainer from '../containers/status_container'
import Avatar from './avatar'
import Icon from './icon'
import Text from './text'
import DotTextSeperator from './dot_text_seperator'
import RelativeTimestamp from './relative_timestamp'
import DisplayName from './display_name'

class Notification extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    const {
      intl,
      accounts,
      createdAt,
      type,
      statusId,
      isHidden,
      isUnread,
      isCompact,
    } = this.props
    
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
        let msg = messages.poll
        if (accounts.size === 1) {
          if (accounts.first().get('id') === me) {
            msg = messages.ownPoll
          }
        }
        icon = 'poll'
        message = intl.formatMessage(msg)
        break
      default:
        return null
    }

    if (isHidden) {
      return (
        <React.Fragment>
          {
            accounts && accounts.slice(0, 1).map((account, i) => (
              <DisplayName key={i} account={account} noUsername />
            ))
          }
          {message}
        </React.Fragment>
      )
    }

    const containerClasses = CX({
      d: 1,
      px10: !isCompact,
      cursorPointer: 1,
      bgSubtle_onHover: !isUnread,
      highlightedComment: isUnread,
    })

    return (
      <div
        className={containerClasses}
        tabIndex='0'
        aria-label={`${message} ${createdAt}`}
      >
        <div className={[_s.d, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.d, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            {
              !isCompact &&
              <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                <Icon id={icon} size='20px' className={[_s.cPrimary, _s.minW20PX, _s.mt5, _s.mr15].join(' ')} />
              </Responsive>
            }

            <div className={[_s.d, _s.flexNormal].join(' ')}>
              <div className={[_s.d, _s.flexRow, _s.flexWrap].join(' ')}>
                {
                  accounts && accounts.map((account, i) => (
                    <NavLink
                      to={`/${account.get('acct')}`}
                      key={`fav-avatar-${i}`}
                      className={[_s.mr5, _s.mb5].join(' ')}
                    >
                      <Avatar size={34} account={account} />
                    </NavLink>
                  ))
                }
              </div>
              <div className={[_s.d, _s.pt5].join(' ')}>
                <div className={[_s.d, _s.displayInline].join(' ')}>
                  <div className={_s.text}>
                    {
                      accounts && accounts.slice(0, 1).map((account, i) => (
                        <DisplayName key={i} account={account} noUsername isInline />
                      ))
                    }
                  </div>
                  <Text size='medium'>
                    {' '}
                    {message}
                  </Text>
                  {
                    !!createdAt &&
                    <React.Fragment>
                      <DotTextSeperator />
                      <Text size='small' color='tertiary' className={_s.ml5}>
                        <RelativeTimestamp timestamp={createdAt} />
                      </Text>
                    </React.Fragment>
                  }
                </div>
              </div>
              {
                !!statusId &&
                <div className={[_s.d, _s.pt10, _s.mt5].join(' ')}>
                  <StatusContainer
                    contextType='notification'
                    id={statusId}
                    isChild
                    isNotification
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

const messages = defineMessages({
  poll: { id: 'notification.poll', defaultMessage: 'A poll you have voted in has ended' },
  ownPoll: { id: 'notification.own_poll', defaultMessage: 'Your poll has ended' },
  mentionedInPost: { id: 'mentioned_in_post', defaultMessage: 'mentioned you in their post' },
  mentionedInComment: { id: 'mentioned_in_comment', defaultMessage: 'mentioned you in their comment' },
  followedYouOne: { id: 'followed_you_one', defaultMessage: 'followed you' },
  followedYouMultiple: { id: 'followed_you_multiple', defaultMessage: 'and {count} others followed you' },
  likedStatusOne: { id: 'liked_status_one', defaultMessage: 'liked your status' },
  likedStatusMultiple: { id: 'liked_status_multiple', defaultMessage: 'and {count} others liked your status' },
  repostedStatusOne: { id: 'reposted_status_one', defaultMessage: 'reposted your status' },
  repostedStatusMultiple: { id: 'reposted_status_multiple', defaultMessage: 'and {count} others reposted your status' },
})

Notification.propTypes = {
  intl: PropTypes.object.isRequired,
  accounts: ImmutablePropTypes.list.isRequired,
  createdAt: PropTypes.string,
  statusId: PropTypes.string,
  type: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
  isUnread: PropTypes.bool,
  isCompact: PropTypes.bool,
}

export default injectIntl(Notification)