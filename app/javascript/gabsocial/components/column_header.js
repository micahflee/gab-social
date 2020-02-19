import { injectIntl, defineMessages } from 'react-intl'
import Icon from './icon'

const messages = defineMessages({
  show: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
  hide: { id: 'column_header.hide_settings', defaultMessage: 'Hide settings' },
})

export default @injectIntl
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

  render () {
    const { title, showBackBtn, icon, active, children, actions, intl: { formatMessage } } = this.props
    const { collapsed } = this.state

    return (
      <div className={[_s.default, _s.height100PC, _s.flexRow].join(' ')}>
        {
          showBackBtn &&
          <button className={[_s.default, _s.cursorPointer, _s.backgroundTransparent, _s.alignItemsCenter, _s.marginRight10PX, _s.justifyContentCenter].join(' ')}>
            <Icon className={[_s.marginRight5PX, _s.fillColorBrand].join(' ')} id='back' width='20px' height='20px' />
          </button>
        }
        <h1 role='heading' className={[_s.default, _s.height100PC, _s.justifyContentCenter].join(' ')}>
          <span className={[_s.default, _s.text, _s.fontSize24PX, _s.fontWeightMedium, _s.colorPrimary].join(' ')}>
            {title}
          </span>
        </h1>
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
                  <Icon className={_s.fillcolorSecondary} id={action.icon} width='20px' height='20px' />
                </button>
              ))
            }
          </div>
        }
      </div>
    )

    // const wrapperClassName = classNames('column-header__wrapper', {
    //   'column-header__wrapper--active': active,
    // })

    // const buttonClassName = classNames('column-header', {
    //   'column-header--active': active,
    // })

    // const btnTitle = formatMessage(collapsed ? messages.show : messages.hide)
    // const hasTitle = icon && title
    // const hasChildren = !!children

    // if (!hasChildren && !hasTitle) {
    //   return null
    // } else if (!hasChildren && hasTitle) {
    //   return (
    //     <div className={wrapperClassName}>
    //       <h1 className={buttonClassName}>
    //         <Icon id={icon} fixedWidth className='column-header__icon' />
    //         {title}
    //       </h1>
    //     </div>
    //   )
    // }

    // const collapsibleClassName = classNames('column-header__collapsible', {
    //   'column-header__collapsible--collapsed': collapsed,
    // })

    // const collapsibleButtonClassName = classNames('column-header__button', {
    //   'column-header__button--active': !collapsed,
    // })

    // return (
    //   <div className={wrapperClassName}>
    //     <h1 className={buttonClassName}>
    //       {
    //         hasTitle && (
    //           <Fragment>
    //             <Icon id={icon} fixedWidth className='column-header__icon' />
    //             {title}
    //           </Fragment>
    //         )
    //       }

    //       <button
    //         className={collapsibleButtonClassName}
    //         title={btnTitle}
    //         aria-label={btnTitle}
    //         aria-pressed={!collapsed}
    //         onClick={this.handleToggleClick}
    //       >
    //         <Icon id='sliders' />
    //       </button>
    //     </h1>

    //     <div className={collapsibleClassName} tabIndex={collapsed ? -1 : null}>
    //       <div className='column-header__collapsible-inner'>
    //         {
    //           !collapsed &&
    //           <div key='extra-content' className='column-header__collapsible__extra'>
    //             {children}
    //           </div>
    //         }
    //       </div>
    //     </div>
    //   </div>
    // )
  }

}
