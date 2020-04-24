import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import {
  CX,
  POPOVER_USER_INFO,
} from '../constants'
import { openPopover, closePopover } from '../actions/popover'
import Icon from './icon'
import Text from './text'

const mapDispatchToProps = (dispatch) => ({
  openUserInfoPopover(props) {
    dispatch(openPopover(POPOVER_USER_INFO, props))
  },
  closeUserInfoPopover() {
    dispatch(closePopover(POPOVER_USER_INFO))
  }
})

export default
@connect(null, mapDispatchToProps)
class DisplayName extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    openUserInfoPopover: PropTypes.func.isRequired,
    closeUserInfoPopover: PropTypes.func.isRequired,
    isLarge: PropTypes.bool,
    isMultiline: PropTypes.bool,
    isSmall: PropTypes.bool,
    noHover: PropTypes.bool,
    noRelationship: PropTypes.bool,
    noUsername: PropTypes.bool,
  }

  updateOnProps = [
    'account',
    'isMultiline',
    'isSmall',
    'isLarge',
    'noHover',
    'noRelationship',
    'noUsername',
  ]

  mouseOverTimeout = null

  handleMouseEnter = () => {
    if (this.mouseOverTimeout) return null
    this.mouseOverTimeout = setTimeout(() => {
      this.props.openUserInfoPopover({
        targetRef: this.node,
        position: 'top',
        account: this.props.account,
      })
    }, 650)
  }

  handleMouseLeave = () => {
    if (this.mouseOverTimeout) {
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
      isSmall
    } = this.props

    if (!account) return null

    const containerClassName = CX({
      default: 1,
      maxWidth100PC: 1,
      alignItemsCenter: !isMultiline,
      flexRow: !isMultiline,
      cursorPointer: !noHover,
    })

    const displayNameClasses = CX({
      text: 1,
      overflowWrapBreakWord: 1,
      whiteSpaceNoWrap: 1,
      fontWeightBold: 1,
      colorPrimary: 1,
      mr2: 1,
      lineHeight125: !isSmall,
      fontSize14PX: isSmall,
      fontSize15PX: !isLarge,
      fontSize24PX: isLarge && !isSmall,
    })

    const usernameClasses = CX({
      text: 1,
      displayFlex: 1,
      flexNormal: 1,
      flexShrink1: 1,
      overflowWrapBreakWord: 1,
      textOverflowEllipsis: 1,
      colorSecondary: 1,
      fontWeightNormal: 1,
      lineHeight15: isMultiline,
      lineHeight125: !isMultiline,
      ml5: !isMultiline,
      fontSize14PX: isSmall,
      fontSize15PX: !isLarge,
      fontSize16PX: isLarge && !isSmall,
    })

    const iconSize =
      !!isLarge ? '19px' :
      !!isSmall ? '14px' : '16px'

    const domain = account.get('acct').split('@')[1]
    const isRemoteUser = !!domain

    let relationshipLabel
    if (me && account) {
      const accountId = account.get('id')
      const isFollowedBy = (me !==  accountId && account.getIn(['relationship', 'followed_by']))

      if (isFollowedBy) {
        relationshipLabel = 'Follows you'//intl.formatMessage(messages.accountFollowsYou)
      }
    }

    // {
    //   /* : todo : audio-mute
    //   account.getIn(['relationship', 'muting'])
    //   */
    // }

    // : todo : remote
    console.log("domain, isRemoteUser:", domain, isRemoteUser)

    return (
      <div
        className={containerClassName}
        onMouseEnter={noHover ? undefined : this.handleMouseEnter}
        onMouseLeave={noHover ? undefined : this.handleMouseLeave}
        ref={this.setRef}
      >
        <span className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
          <bdi className={[_s.text, _s.whiteSpaceNoWrap, _s.textOverflowEllipsis].join(' ')}>
            <strong
              className={displayNameClasses}
              dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
            />
            {
              !noRelationship && account.get('locked') &&
              <Icon id='lock-filled' size={iconSize} className={_s.ml5} />
            }
          </bdi>
          {
            account.get('is_verified') &&
            <Icon id='verified' size={iconSize} className={_s.default} />
          }
        </span>
        {
          !noUsername &&
          <span className={usernameClasses}>
            @{account.get('acct')}
            {
              !noRelationship && !!relationshipLabel &&
              <span className={[_s.default, _s.ml5, _s.justifyContentCenter].join(' ')}>
                <Text
                  size='extraSmall'
                  isBadge
                  color='tertiary'
                  className={[_s.backgroundSubtle2, _s.py2].join(' ')}
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
