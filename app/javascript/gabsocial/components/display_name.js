import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import {
  CX,
  POPOVER_USER_INFO,
} from '../constants'
import { openPopover, closePopover } from '../actions/popover'
import Icon from './icon'
import Text from './text'

class DisplayName extends ImmutablePureComponent {

  mouseOverTimeout = null

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove, true)
    clearTimeout(this.mouseOverTimeout)
  }

  handleMouseEnter = () => {
    if (this.mouseOverTimeout) return null
    this.mouseOverTimeout = setTimeout(() => {
      this.props.openUserInfoPopover({
        targetRef: this.node,
        position: 'top',
        accountId: this.props.account.get('id'),
      })
      document.addEventListener('mousemove', this.handleMouseMove, true)
    }, 1250)
  }

  handleMouseLeave = debounce((e) => {
    this.attemptToHidePopover(e)
  }, 250)

  handleMouseMove = debounce((e) => {
    this.attemptToHidePopover(e)
  }, 100)

  attemptToHidePopover = (e) => {
    const lastTarget = e.toElement || e.relatedTarget
    const isElement = (lastTarget instanceof Element || lastTarget instanceof HTMLDocument)
    const userInfoPopoverEl = document.getElementById('user-info-popover')

    if (this.mouseOverTimeout &&
      (
        !isElement && !userInfoPopoverEl ||
        (userInfoPopoverEl && isElement && lastTarget && !userInfoPopoverEl.contains(lastTarget)) ||
        (!userInfoPopoverEl && isElement && lastTarget &&  this.node && !this.node.contains(lastTarget))
      )) {
      document.removeEventListener('mousemove', this.handleMouseMove, true)
      clearTimeout(this.mouseOverTimeout)
      this.mouseOverTimeout = null
      this.props.closeUserInfoPopover()
    }
  }

  setRef = (n) => {
    this.node = n
  }

  render() {
    const {
      account,
      isMultiline,
      isLarge,
      noHover,
      noUsername,
      noRelationship,
      isSmall,
      isComment,
      isCentered,
      isInline,
    } = this.props

    if (!account) return null

    const containerClassName = CX({
      d: 1,
      maxW100PC: 1,
      aiCenter: !isMultiline,
      flexRow: !isMultiline,
      cursorPointer: !noHover,
      aiCenter: isCentered,
      displayInlineBlock: isInline,
    })

    const displayNameClasses = CX({
      text: 1,
      overflowWrapBreakWord: 1,
      whiteSpaceNoWrap: 1,
      fw600: 1,
      cPrimary: 1,
      mr2: 1,
      lineHeight125: !isSmall,
      fs14PX: isSmall,
      fs15PX: !isLarge,
      fs24PX: isLarge && !isSmall,
    })

    const usernameClasses = CX({
      text: 1,
      displayFlex: 1,
      flexNormal: 1,
      flexShrink1: 1,
      overflowWrapBreakWord: 1,
      textOverflowEllipsis: 1,
      cSecondary: 1,
      fw400: 1,
      lineHeight15: isMultiline,
      lineHeight125: !isMultiline,
      ml5: !isMultiline,
      fs14PX: isSmall,
      fs15PX: !isLarge,
      fs16PX: isLarge && !isSmall,
    })

    const iconSize =
      !!isLarge ? 19 :
      !!isComment ? 12 :
      !!isSmall ? 14 : 15

    let relationshipLabel
    if (me && account) {
      const accountId = account.get('id')
      const isFollowedBy = (me !==  accountId && account.getIn(['relationship', 'followed_by']))

      if (isFollowedBy) {
        relationshipLabel = 'Follows you'//intl.formatMessage(messages.accountFollowsYou)
      }
    }

    // {
    //   /* : todo : audio-mute, bot
    //   account.getIn(['relationship', 'muting'])
    //   */
    // }
    // bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },

    return (
      <div
        className={containerClassName}
        onMouseEnter={noHover ? undefined : this.handleMouseEnter}
        onMouseLeave={noHover ? undefined : this.handleMouseLeave}
        ref={this.setRef}
      >
        <span className={[_s.d, _s.flexRow, _s.aiCenter, _s.maxW100PC].join(' ')}>
          <bdi className={[_s.text, _s.whiteSpaceNoWrap, _s.textOverflowEllipsis].join(' ')}>
            <strong
              className={displayNameClasses}
              dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
            />
            {
              account.get('locked') &&
              <Icon id='lock-filled' size={`${iconSize - 3}px`} className={[_s.cPrimary, _s.ml5].join(' ')} />
            }
          </bdi>
          {
            account.get('is_verified') &&
            <Icon id='verified' size={`${iconSize}px`} className={[_s.ml5, _s.d].join(' ')} />
          }
        </span>
        {
          !noUsername &&
          <span className={usernameClasses}>
            @{account.get('acct')}
            {
              !noRelationship && !!relationshipLabel &&
              <span className={[_s.d, _s.ml5, _s.jcCenter].join(' ')}>
                <Text
                  size='extraSmall'
                  isBadge
                  color='tertiary'
                  className={[_s.bgSecondary, _s.py2].join(' ')}
                >
                  {relationshipLabel}
                </Text>
              </span>
            }
          </span>
        }
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  openUserInfoPopover(props) {
    dispatch(openPopover(POPOVER_USER_INFO, props))
  },
  closeUserInfoPopover() {
    dispatch(closePopover(POPOVER_USER_INFO))
  }
})

DisplayName.propTypes = {
  account: ImmutablePropTypes.map,
  openUserInfoPopover: PropTypes.func.isRequired,
  closeUserInfoPopover: PropTypes.func.isRequired,
  isLarge: PropTypes.bool,
  isMultiline: PropTypes.bool,
  isSmall: PropTypes.bool,
  noHover: PropTypes.bool,
  noRelationship: PropTypes.bool,
  noUsername: PropTypes.bool,
  isComment: PropTypes.bool,
  isCentered: PropTypes.bool,
  isInline: PropTypes.bool,
}

export default (connect(null, mapDispatchToProps)(DisplayName))