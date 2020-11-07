import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Icon from './icon'
import Text from './text'

class StatusPrepend extends ImmutablePureComponent {

  render() {
    const {
      intl,
      status,
      isFeatured,
      isPromoted,
      isComment,
      isPinnedInGroup,
      onOpenProModal,
    } = this.props

    if (!status) return null

    const isRepost = (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object')
    const showRepostedComment = !!status.getIn(['reblog', 'in_reply_to_account_id'], null) && isRepost
    const reblogUrl = status.getIn(['reblog', 'url'], null)
    
    if (!isFeatured && !isPinnedInGroup && !isPromoted && !isRepost && !isComment) return null

    let iconId
    if (isFeatured || isPinnedInGroup) iconId = 'pin'
    else if (isPromoted) iconId = 'star'
    else if (isRepost) iconId = 'repost'
    else if (isComment) iconId = 'comment'

    return (
      <div className={[_s.d, _s.w100PC, _s.flexRow, _s.aiStart, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <div className={[_s.d, _s.flexNormal, _s.flexRow, _s.aiCenter, _s.py5, _s.px15, _s.overflowHidden].join(' ')}>
          <Icon id={iconId} size='12px' className={[_s.cSecondary, _s.mr5].join(' ')} />
          {
            isRepost && !isComment && !showRepostedComment &&
            <div className={[_s.d, _s.flexRow].join(' ')}>
              <Text size='small' color='secondary'>
                <FormattedMessage
                  id='status.reposted_by'
                  defaultMessage='{name} reposted'
                  values={{
                    name: (
                      <NavLink
                        className={[_s.noUnderline, _s.underline_onHover].join(' ')}
                        to={`/${status.getIn(['account', 'acct'])}`}
                      >
                        <Text size='small' color='secondary'>
                          <bdi>
                            <span dangerouslySetInnerHTML={{ __html: status.getIn(['account', 'display_name_html']) }} />
                          </bdi>
                        </Text>
                      </NavLink>
                    )
                  }}
                />
              </Text>
            </div>
          }
          {
            isRepost && !isComment && showRepostedComment &&
            <div className={[_s.d, _s.flexRow].join(' ')}>
              <Text size='small' color='secondary'>
                <FormattedMessage
                  id='status.reposted_comment_by'
                  defaultMessage='{name} reposted a {comment} on {this_post}'
                  values={{
                    name: (
                      <NavLink
                        className={[_s.noUnderline, _s.underline_onHover].join(' ')}
                        to={`/${status.getIn(['account', 'acct'])}`}
                      >
                        <Text size='small' color='secondary' weight='medium'>
                          <bdi>
                            <span dangerouslySetInnerHTML={{ __html: status.getIn(['account', 'display_name_html']) }} />
                          </bdi>
                        </Text>
                      </NavLink>
                    ),
                    comment: (
                      <a
                        className={[_s.noUnderline, _s.underline_onHover].join(' ')}
                        href={reblogUrl}
                      >
                        <Text size='small' color='secondary' weight='medium'>
                          comment
                        </Text>
                      </a>
                    ),
                    this_post: (
                      <a
                        className={[_s.noUnderline, _s.underline_onHover].join(' ')}
                        href={reblogUrl}
                      >
                        <Text size='small' color='secondary' weight='medium'>
                          a post
                        </Text>
                      </a>
                    )
                  }}
                />
              </Text>
            </div>
          }
          {
            !isRepost && !isComment &&
            <Text color='secondary' size='small'>
              {intl.formatMessage(isFeatured ? messages.pinned : isPinnedInGroup ? messages.pinnedByGroup : messages.promoted)}
            </Text>
          }
          {
            isComment &&
            <Text color='secondary' size='small'>
              <FormattedMessage
                id='status.commented_on_this'
                defaultMessage='{name} commented on this gab'
                values={{
                  name: (
                    <NavLink
                      className={[_s.noUnderline, _s.underline_onHover].join(' ')}
                      to={`/${status.getIn(['account', 'acct'])}`}
                    >
                      <Text size='small' color='secondary' weight='medium'>
                        <bdi>
                          <span dangerouslySetInnerHTML={{ __html: status.getIn(['account', 'display_name_html']) }} />
                        </bdi>
                      </Text>
                    </NavLink>
                  )
                }}
              />
            </Text>
          }
        </div>
        {
          isPromoted &&
          <div className={[_s.d, _s.h100PC, _s.pr10, _s.py2, _s.aiCenter, _s.jcCenter].join(' ')}>
            <button
              className={[_s.d, _s.cursorPointer, _s.outlineNone, _s.bgTertiary, _s.circle, _s.py2, _s.px5].join(' ')}
              onClick={onOpenProModal}
            >
              <Text color='tertiary' size='extraSmall' isBadge>
                ?
              </Text>
            </button>
          </div>
        }
      </div>
    )
  }

}

const messages = defineMessages({
  filtered: { id: 'status.filtered', defaultMessage: 'Filtered' },
  promoted: { id: 'status.promoted', defaultMessage: 'Promoted gab' },
  pinned: { id: 'status.pinned', defaultMessage: 'Pinned gab' },
  pinnedByGroup: { id: 'status.pinned_by_group', defaultMessage: 'Pinned to group' },
  reposted: { id: 'status.reposted_by', defaultMessage: '{name} reposted' },
})

StatusPrepend.propTypes = {
  intl: PropTypes.object.isRequired,
  status: ImmutablePropTypes.map,
  isComment: PropTypes.bool,
  isFeatured: PropTypes.bool,
  isPinnedInGroup: PropTypes.bool,
  isPromoted: PropTypes.bool,
  onOpenProModal: PropTypes.func.isRequired,
}

export default injectIntl(StatusPrepend)