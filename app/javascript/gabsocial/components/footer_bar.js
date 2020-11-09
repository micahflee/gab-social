import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { me } from '../initial_state'
import { openSidebar } from '../actions/sidebar'
import { CX } from '../constants'
import Button from './button'
import Avatar from './avatar'

class FooterBar extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  handleOnOpenSidebar = () => {
    this.props.onOpenSidebar()
  }

  render() {
    const {
      account,
      notificationCount,
      homeItemsQueueCount,
    } = this.props

    const noRouter = !this.context.router
    const currentPathname = noRouter ? '' : this.context.router.route.location.pathname

    const buttons = [
      {
        to: !me ? '/' : '/home',
        icon: 'home',
        title: 'Home',
        active: !me ? currentPathname === '/' : currentPathname === '/home',
      },
      {
        to: '/notifications',
        icon: 'notifications',
        title: 'Notifications',
        isHidden: !me,
        active: currentPathname.indexOf('/notifications') > -1,
      },
      {
        to: '/groups',
        icon: 'group',
        title: 'Groups',
        active: currentPathname.indexOf('/groups') > -1,
      },
      {
        to: '/search',
        icon: 'explore',
        title: 'Explore',
        active: currentPathname.indexOf('/search') > -1,
      },
      {
        to: '/news',
        icon: 'news',
        title: 'News',
        active: currentPathname.indexOf('/news') > -1,
      },
      {
        title: 'Menu',
        isHidden: !me,
        active: !!account ? currentPathname === `/${account.get('username')}` : false,
        onClick: this.handleOnOpenSidebar,
      },
    ]

    return (
      <div className={[_s.d, _s.z4, _s.minH58PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.posFixed, _s.left0, _s.right0, _s.bottom0, _s.minH58PX, _s.w100PC, _s.bgPrimary, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.h100PC, _s.minH58PX, _s.saveAreaInsetPB, _s.jcSpaceAround].join(' ')}>
            {
              buttons.map((props, i) => {
                if (props.isHidden) return null

                const classes = CX({
                  borderTop2PX: 1,
                  borderColorTransparent: !props.active,
                  borderColorBrand: props.active,
                  h100PC: 1,
                  minH58PX: 1,
                  px15: 1,
                  flexGrow1: 1,
                  aiCenter: 1,
                  jcCenter: 1,
                })
                
                const color = props.active ? 'brand' : 'secondary'
                let childIcon;
                if (props.to === '/notifications' && notificationCount > 0) {
                  childIcon = (
                    <div className={[_s.posAbs, _s.ml5, _s.top0, _s.pt5, _s.pl20].join(' ')}>
                      <span className={[_s.bgRed, _s.cWhite, _s.circle, _s.py2, _s.px2, _s.minW14PX, _s.displayBlock].join(' ')} style={{fontSize: '12px'}}>
                        {notificationCount}
                      </span>
                    </div>
                  )
                } else if (props.to === '/home' && homeItemsQueueCount > 0) {
                  childIcon = (
                    <div className={[_s.posAbs, _s.ml5, _s.top0, _s.pt2, _s.pl20].join(' ')}>
                      <span className={[_s.cBrand, _s.circle, _s.py2, _s.px2, _s.minW14PX, _s.displayBlock].join(' ')} style={{fontSize: '18px'}}>
                        •
                      </span>
                    </div>
                  )
                } else if (props.title === 'Menu' && !!account) {
                  const avatarContainerClasses = CX({
                    d: 1,
                    circle: 1,
                    boxShadowProfileAvatarFooter: !!props.active,
                  })
                  childIcon = (
                    <div className={avatarContainerClasses}>
                      <Avatar account={account} size={24} />
                    </div>
                  )
                }

                return (
                  <Button
                    isText
                    backgroundColor='none'
                    iconSize='20px'
                    color={color}
                    to={props.to}
                    onClick={props.onClick}
                    icon={props.icon}
                    href={props.href}
                    title={props.title}
                    className={classes}
                    key={`footer-bar-item-${i}`}
                  >
                    {childIcon}
                  </Button>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onOpenSidebar() {
    dispatch(openSidebar())
  },
})

const mapStateToProps = (state) => ({
  account: !!me ? state.getIn(['accounts', me]) : undefined,
  notificationCount: !!me ? state.getIn(['notifications', 'unread']) : 0,
  homeItemsQueueCount: !!me ? state.getIn(['timelines', 'home', 'totalQueuedItemsCount']) : 0,
})

FooterBar.propTypes = {
  account: ImmutablePropTypes.map,
  onOpenSidebar: PropTypes.func.isRequired,
  notificationCount: PropTypes.number.isRequired,
  homeItemsQueueCount: PropTypes.number.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FooterBar))