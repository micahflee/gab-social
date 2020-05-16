import { withRouter } from 'react-router-dom'
import { me } from '../initial_state'
import { CX } from '../constants'
import Button from './button'

const mapStateToProps = (state) => ({
  notificationCount: state.getIn(['notifications', 'unread']),
})

export default
@withRouter
@connect(mapStateToProps)
class FooterBar extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    notificationCount: PropTypes.number.isRequired,
  }

  render() {
    const { notificationCount } = this.props
    if (!me) return false

    const noRouter = !this.context.router
    const currentPathname = noRouter ? '' : this.context.router.route.location.pathname

    const buttons = [
      {
        to: '/home',
        icon: 'home',
        title: 'Home',
        active: currentPathname === '/home',
      },
      {
        to: '/notifications',
        icon: 'notifications',
        title: 'Notifications',
        active: currentPathname === '/notifications',
      },
      {
        to: '/groups',
        icon: 'group',
        title: 'Groups',
        active: currentPathname === '/groups',
      },
      {
        href: 'https://trends.gab.com',
        icon: 'trends',
        title: 'Trends',
      },
    ]

    return (
      <div className={[_s.default, _s.z4, _s.heightMin58PX, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.posFixed, _s.left0, _s.right0, _s.bottom0, _s.heightMin58PX, _s.width100PC, _s.bgPrimary, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.height100PC, _s.heightMin58PX, _s.saveAreaInsetPB, _s.justifyContentSpaceAround].join(' ')}>
            {
              buttons.map((props) => {
                const classes = CX({
                  borderTop2PX: 1,
                  borderColorTransparent: !props.active,
                  borderColorBrand: props.active,
                  height100PC: 1,
                  heightMin58PX: 1,
                  px15: 1,
                  flexGrow1: 1,
                  alignItemsCenter: 1,
                  justifyContentCenter: 1,
                })
                
                const color = props.active ? 'brand' : 'secondary'
                const childIcon = props.to === '/notifications' && notificationCount > 0 ? (
                  <div className={[_s.posAbs, _s.ml5, _s.top0, _s.pt5, _s.pl20].join(' ')}>
                    <span className={[_s.bgRed, _s.colorWhite, _s.circle, _s.py2, _s.px2, _s.minWidth14PX, _s.displayBlock].join(' ')} style={{fontSize: '12px'}}>
                      {notificationCount}
                    </span>
                  </div>
                ) : null

                return (
                  <Button
                    isText
                    backgroundColor='none'
                    iconSize='20px'
                    color={color}
                    to={props.to}
                    icon={props.icon}
                    href={props.href}
                    title={props.title}
                    className={classes}
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
