import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import Responsive from '../features/ui/util/responsive_component'
import { CX } from '../constants'
import Avatar from './avatar'
import Button from './button'
import Icon from './icon'
import Search from './search'
import Text from './text'

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

export default
@connect(mapStateToProps)
class NavigationBar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    actions: PropTypes.array,
    tabs: PropTypes.array,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  handleProfileClick = () => {

  }

  render() {
    const {
      title,
      showBackBtn,
      actions,
      tabs,
      account,
    } = this.props

    return (
      <div className={[_s.default, _s.z4, _s.height53PX, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.height53PX, _s.bgBrand, _s.alignItemsCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.default, _s.flexRow, _s.width1255PX].join(' ')}>

            <div className={[_s.default, _s.flexRow].join(' ')}>

              <h1 className={[_s.default, _s.mr15].join(' ')}>
                <Button to='/' isText title='Gab' aria-label='Gab' className={[_s.default, _s.justifyContentCenter, _s.noSelect, _s.noUnderline, _s.height53PX, _s.cursorPointer, _s.px10, _s.mr15].join(' ')}>
                  <Icon id='gab-logo' className={_s.fillWhite} />
                </Button>
              </h1>

              <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                <div className={[_s.default, _s.width340PX].join(' ')}>
                  <Search />
                </div>
              </Responsive>

            </div>

            <div className={[_s.default, _s.mlAuto].join(' ')}>
              <div className={[_s.default, _s.height53PX, _s.pl15, _s.flexRow, _s.alignItemsCenter, _s.justifyContentSpaceBetween].join(' ')}>
                <NavigationBarButton title='Home' icon='home' to='/home' />
                
                <NavigationBarButtonDivider />

                <NavigationBarButton attrTitle='Notifications' icon='notifications' to='/notifications' />
                <NavigationBarButton attrTitle='Settings' icon='cog' href='/settings/preferences' />

                <NavigationBarButtonDivider />
              
                {
                  !!account &&
                  <button
                    title={account.get('display_name')}
                    onClick={this.handleProfileClick}
                    className={[_s.height53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.default, _s.justifyContentCenter, _s.ml15].join(' ')}
                  >
                    <Avatar account={account} size={32} noHover />
                  </button>
                }
              </div>
            </div>

          </div>

        </div>
      </div>
    )
  }

}

class NavigationBarButtonDivider extends PureComponent {

  render() {
    return (
      <div className={[_s.default, _s.height20PX, _s.width1PX, _s.mr10, _s.ml10, _s.bgBrandDark].join(' ')} />
    )
  }

}

class NavigationBarButton extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    to: PropTypes.string,
    href: PropTypes.string,
    attrTitle: PropTypes.string,
  }

  render() {
    const {
      title,
      icon,
      to,
      href,
      attrTitle,
    } = this.props

    const active = false

    const classes = CX({
      default: 1,
      height53PX: 1,
      flexRow: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      outlineNone: 1,
      cursorPointer: 1,
      bgTransparent: 1,
      noUnderline: 1,
      px10: !!title,
      px5: !title,
      colorWhite: !!title,
      fs13PX: !!title,
      fontWeightNormal: !!title,
      textUppercase: !!title,
      bgBrandDark_onHover: !!title,
    })

    const iconClasses = CX({
      fillWhite: !!title || active,
      fillBrandDark: !title,
      mr10: !!title,
    })

    const iconSize = !!title ? '16px' : '18px'

    return (
      <Button
        to={to}
        href={href}
        attrTitle={attrTitle}
        color='white'
        className={classes}
        noClasses
      >
        <Icon className={iconClasses} id={icon} size={iconSize} />
        {
          !!title &&
          <Text color='white'>
            {title}
          </Text>
        }
      </Button>
    )
  }

}