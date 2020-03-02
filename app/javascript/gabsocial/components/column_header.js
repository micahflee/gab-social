import { injectIntl, defineMessages } from 'react-intl'
import TabBar from './tab_bar'
import Icon from './icon'
import Button from './button'
import Heading from './heading'

const messages = defineMessages({
  show: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
  hide: { id: 'column_header.hide_settings', defaultMessage: 'Hide settings' },
})

export default
@injectIntl
class ColumnHeader extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    intl: PropTypes.object.isRequired,
    title: PropTypes.node,
    icon: PropTypes.string,
    active: PropTypes.bool,
    children: PropTypes.node,
    showBackBtn: PropTypes.bool,
    actions: PropTypes.array,
    tabs: PropTypes.array,
  }

  state = {
    collapsed: true,
  }

  historyBack = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/home') // homehack
    } else {
      this.context.router.history.goBack()
    }
  }

  handleToggleClick = (e) => {
    e.stopPropagation()
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  handleBackClick = () => {
    this.historyBack()
  }

  render() {
    const { title, showBackBtn, tabs, icon, active, children, actions, intl: { formatMessage } } = this.props
    const { collapsed } = this.state

    return (
      <div className={[_s.default, _s.height100PC, _s.flexRow].join(' ')}>
        {
          showBackBtn &&
          <button className={[_s.default, _s.cursorPointer, _s.backgroundTransparent, _s.alignItemsCenter, _s.marginRight10PX, _s.justifyContentCenter].join(' ')}>
            <Icon className={[_s.marginRight5PX, _s.fillColorPrimary].join(' ')} id='back' width='20px' height='20px' />
          </button>
        }

        <div className={[_s.default, _s.height100PC, _s.justifyContentCenter, _s.marginRight10PX].join(' ')}>
          <Heading size='h1'>
            {title}
          </Heading>
        </div>

        {
          !!tabs &&
          <TabBar tabs={tabs} />
        }

        {
          !!actions &&
          <div className={[_s.default, _s.backgroundTransparent, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.marginLeftAuto].join(' ')}>
            {
              actions.map((action, i) => (
                <button
                  onClick={() => action.onClick()}
                  key={`column-header-action-btn-${i}`}
                  className={[_s.default, _s.marginLeft5PX, _s.cursorPointer, _s.backgroundSubtle2, _s.paddingHorizontal10PX, _s.paddingVertical10PX, _s.radiusSmall].join(' ')}
                >
                  <Icon className={_s.fillColorSecondary} id={action.icon} width='20px' height='20px' />
                </button>
              ))
            }
          </div>
        }
      </div>
    )
  }

}
