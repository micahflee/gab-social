import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { debounce } from 'lodash'
import classNames from 'classnames/bind'
import { openPopover, closePopover } from '../actions/popover'
import Badge from './badge'
import Icon from './icon'

const cx = classNames.bind(_s)

const mapDispatchToProps = dispatch => ({
  openUserInfoPopover() {
    dispatch(openPopover('USER_INFO'))
  },
  closeUserInfoPopover() {
    dispatch(closePopover())
  }
})

export default
@connect(null, mapDispatchToProps)
class DisplayName extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    openUserInfoPopover: PropTypes.func.isRequired,
    closeUserInfoPopover: PropTypes.func.isRequired,
    multiline: PropTypes.bool,
    large: PropTypes.bool,
    noHover: PropTypes.bool,
  }

  handleMouseEnter = debounce(() => {
    // console.log("SHOW - USER POPOVER")
    // this.props.openUserInfoPopover()
  }, 50, { leading: true })

  handleMouseLeave = () => {
    // console.log("HIDE - USER POPOVER")
    // this.props.closeUserInfoPopover()
  }

  render() {
    const { account, multiline, large, noHover } = this.props

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
      lineHeight125: 1,
      marginRight2PX: 1,
      fontSize15PX: !large,
      fontSize24PX: large,
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
      marginLeft5PX: !multiline,
      fontSize15PX: !large,
      fontSize16PX: large
    })

    const iconSize = !!large ? '19px' : '16px'

    // : todo :
    return (
      <span {...containerOptions}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
          <bdi className={[_s.text, _s.whiteSpaceNoWrap, _s.textOverflowEllipsis].join(' ')}>
            <strong
              className={displayNameClasses}
              dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
            />
          </bdi>
          {
            account.get('is_verified') &&
            <Icon id='verified' width={iconSize} height={iconSize} className={_s.default} title='Verified Account' />
          }
          { /*
            account.get('is_pro') &&
            <Icon id='verified' width='16px' height='16px' className={_s.default} title='Gab PRO' />
          */ }
          { /*
            account.get('is_donor') &&
            <Icon id='verified' width='16px' height='16px' className={_s.default} title='Gab Donor' />
          */ }
          { /*
            account.get('is_investor') &&
            <Icon id='verified' width='16px' height='16px' className={_s.default} title='Gab Investor' />
          */ }
        </div>
        <span className={usernameClasses}>
          @{account.get('acct')}
        </span>
      </span>
    )
  }

}
