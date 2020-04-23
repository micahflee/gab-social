import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import classNames from 'classnames/bind'
import { openPopover, closePopover } from '../actions/popover'
import Icon from './icon'

const cx = classNames.bind(_s)

const mapDispatchToProps = (dispatch) => ({
  openUserInfoPopover(props) {
    dispatch(openPopover('USER_INFO', props))
  },
  closeUserInfoPopover() {
    dispatch(closePopover('USER_INFO'))
  }
})

export default
@connect(null, mapDispatchToProps)
class DisplayName extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    openUserInfoPopover: PropTypes.func.isRequired,
    closeUserInfoPopover: PropTypes.func.isRequired,
    multiline: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    noHover: PropTypes.bool,
    noUsername: PropTypes.bool,
  }

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
      multiline,
      large,
      noHover,
      noUsername,
      small
    } = this.props

    if (!account) return null

    const containerOptions = {
      className: cx({
        default: 1,
        maxWidth100PC: 1,
        alignItemsCenter: !multiline,
        flexRow: !multiline,
        cursorPointer: !noHover,
      }),
      onMouseEnter: noHover ? undefined : this.handleMouseEnter,
      onMouseLeave: noHover ? undefined : this.handleMouseLeave,
    }

    const displayNameClasses = cx({
      text: 1,
      overflowWrapBreakWord: 1,
      whiteSpaceNoWrap: 1,
      fontWeightBold: 1,
      colorPrimary: 1,
      mr2: 1,
      lineHeight125: !small,
      fontSize14PX: small,
      fontSize15PX: !large,
      fontSize24PX: large && !small,
    })

    const usernameClasses = cx({
      text: 1,
      displayFlex: 1,
      flexNormal: 1,
      flexShrink1: 1,
      overflowWrapBreakWord: 1,
      textOverflowEllipsis: 1,
      colorSecondary: 1,
      fontWeightNormal: 1,
      lineHeight15: multiline,
      lineHeight125: !multiline,
      ml5: !multiline,
      fontSize14PX: small,
      fontSize15PX: !large,
      fontSize16PX: large && !small,
    })

    const iconSize =
      !!large ? '19px' :
      !!small ? '14px' : '16px'

    const domain = account.get('acct').split('@')[1]
    const isRemoteUser = !!domain

    // : todo : remote
    console.log("domain, isRemoteUser:", domain, isRemoteUser)

    return (
      <span {...containerOptions} ref={this.setRef}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
          <bdi className={[_s.text, _s.whiteSpaceNoWrap, _s.textOverflowEllipsis].join(' ')}>
            <strong
              className={displayNameClasses}
              dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
            />
          </bdi>
          {
            account.get('is_verified') &&
            <Icon id='verified' size={iconSize} className={_s.default} />
          }
          {
            account.get('is_pro') &&
            <Icon id='pro' size={iconSize} className={_s.default} />
          }
          {
            account.get('is_donor') &&
            <Icon id='donor' size={iconSize} className={_s.default} />
          }
          {
            account.get('is_investor') &&
            <Icon id='investor' size={iconSize} className={_s.default} />
          }
        </div>
        {
          !noUsername &&
          <span className={usernameClasses}>
            @{account.get('acct')}
          </span>
        }
      </span>
    )
  }

}
