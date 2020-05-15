import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openSidebar } from '../actions/sidebar'
import { openPopover } from '../actions/popover'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import Responsive from '../features/ui/util/responsive_component'
import {
  CX,
  POPOVER_NAV_SETTINGS,
} from '../constants'
import Avatar from './avatar'
import BackButton from './back_button'
import Button from './button'
import Heading from './heading'
import Icon from './icon'
import Search from './search'
import Text from './text'

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenSidebar() {
    dispatch(openSidebar())
  },

  onOpenNavSettingsPopover(targetRef) {
    dispatch(openPopover(POPOVER_NAV_SETTINGS, {
      targetRef,
      position: 'top',
    }))
  }
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class NavigationBar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    actions: PropTypes.array,
    tabs: PropTypes.array,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
    onOpenSidebar: PropTypes.func.isRequired,
    onOpenNavSettingsPopover: PropTypes.func.isRequired,
  }

  handleOnOpenNavSettingsPopover = () => {
    this.props.onOpenNavSettingsPopover(this.avatarNode)
  }

  setAvatarNode = (c) => {
    this.avatarNode = c
  }

  render() {
    const {
      title,
      showBackBtn,
      actions,
      tabs,
      account,
      onOpenSidebar,
    } = this.props


    return (
      <div className={[_s.default, _s.z4, _s.heightMin53PX, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.heightMin53PX, _s.bgNavigation, _s.alignItemsCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.default, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.flexRow, _s.width1255PX].join(' ')}>

            { /** Default */}
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>

              <div className={[_s.default, _s.flexRow].join(' ')}>

                <h1 className={[_s.default, _s.mr15].join(' ')}>
                  <Button
                    to='/'
                    isText
                    title='Gab'
                    aria-label='Gab'
                    color='none'
                    backgroundColor='none'
                    className={[_s.default, _s.justifyContentCenter, _s.noSelect, _s.noUnderline, _s.height53PX, _s.cursorPointer, _s.px10, _s.mr15].join(' ')}
                  >
                    <Icon id='logo' className={_s.fillNavigationBrand} />
                  </Button>
                </h1>

                <div className={[_s.default, _s.width340PX].join(' ')}>
                  <Search isInNav />
                </div>

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
                      ref={this.setAvatarNode}
                      title={account.get('display_name')}
                      onClick={this.handleOnOpenNavSettingsPopover}
                      className={[_s.height53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.default, _s.justifyContentCenter, _s.ml15].join(' ')}
                    >
                      <Avatar account={account} size={32} noHover />
                    </button>
                  }
                </div>
              </div>

            </Responsive>
            
            { /** Mobile */}
            <Responsive max={BREAKPOINT_EXTRA_SMALL}>
              <div className={[_s.default, _s.width84PX, _s.alignItemsStart, _s.pl10].join(' ')}>
                {
                  !!account && !showBackBtn &&
                  <button
                    title={account.get('display_name')}
                    onClick={onOpenSidebar}
                    className={[_s.height53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.default, _s.justifyContentCenter].join(' ')}
                  >
                    <Avatar account={account} size={32} noHover />
                  </button>
                }
                {
                  showBackBtn &&
                  <BackButton
                    className={_s.height53PX}
                    icon='angle-left'
                    iconSize='18px'
                    iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
                  />
                }
              </div>
              
              <div className={[_s.default, _s.height53PX, _s.justifyContentCenter, _s.mlAuto, _s.mrAuto].join(' ')}>
                <Heading size='h1'>
                  <span className={_s.colorNavigation}>
                    {title}
                  </span>
                </Heading>
              </div>

              <div className={[_s.default, _s.width84PX, _s.pr15].join(' ')}>
                <div className={[_s.default, _s.bgTransparent, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mlAuto].join(' ')}>
                  {
                    actions && actions.map((action, i) => (
                      <Button
                        isNarrow
                        backgroundColor='none'
                        color='primary'
                        onClick={() => action.onClick()}
                        key={`action-btn-${i}`}
                        className={[_s.ml5, _s.height53PX, _s.justifyContentCenter, _s.px5].join(' ')}
                        icon={action.icon}
                        iconClassName={_s.fillNavigation}
                        iconSize='18px'
                      />
                    ))
                  }
                  <Button
                    isNarrow
                    backgroundColor='none'
                    color='primary'
                    to='/search'
                    key={`action-btn-search`}
                    className={[_s.ml5, _s.height53PX, _s.justifyContentCenter, _s.px5].join(' ')}
                    icon='search'
                    iconClassName={_s.fillNavigation}
                    iconSize='18px'
                  />
                </div>
              </div>
              
            </Responsive>

          </div>

        </div>
      </div>
    )
  }

}

class NavigationBarButtonDivider extends PureComponent {

  render() {
    return (
      <div className={[_s.default, _s.height20PX, _s.width1PX, _s.mr10, _s.ml10, _s.bgNavigationBlend].join(' ')} />
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
      colorNavigation: 1,
      px10: !!title,
      px5: !title,
      colorWhite: !!title,
      fs13PX: !!title,
      fontWeightNormal: !!title,
      textUppercase: !!title,
    })

    const iconClasses = CX({
      fillNavigation: !!title || active,
      fillNavigationBlend: !title,
      mr10: !!title,
    })

    const iconSize = !!title ? '16px' : '18px'

    return (
      <Button
        to={to}
        href={href}
        attrTitle={attrTitle}
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