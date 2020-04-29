import Button from './button'
import Heading from './heading'
import TabBar from './tab_bar'

export default class ColumnHeader extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    title: PropTypes.node,
    showBackBtn: PropTypes.bool,
    actions: PropTypes.array,
    tabs: PropTypes.array,
  }

  historyBack = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/home')
    } else {
      this.context.router.history.goBack()
    }
  }

  handleBackClick = () => {
    this.historyBack()
  }

  render() {
    const {
      title,
      showBackBtn,
      tabs,
      actions,
    } = this.props

    return (
      <div className={[_s.default, _s.height100PC, _s.flexRow].join(' ')}>
        {
          showBackBtn &&
          <Button
            color='primary'
            backgroundColor='none'
            className={[_s.alignItemsCenter, _s.pl0, _s.justifyContentCenter].join(' ')}
            icon='back'
            iconSize='20px'
            iconClassName={[_s.mr5, _s.fillPrimary].join(' ')}
            onClick={this.handleBackClick}
          />
        }

        <div className={[_s.default, _s.height100PC, _s.justifyContentCenter, _s.mr10].join(' ')}>
          <Heading size='h1'>

          </Heading>
        </div>
        
        {
          !!tabs &&
          <TabBar tabs={tabs} />
        }

        {
          !!actions &&
          <div className={[_s.default, _s.bgTransparent, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mlAuto].join(' ')}>
            {
              actions.map((action, i) => (
                <Button
                  backgroundColor='none'
                  color='primary'
                  onClick={() => action.onClick()}
                  key={`column-header-action-btn-${i}`}
                  className={[_s.ml5, _s.px10].join(' ')}
                  icon={action.icon}
                  iconClassName={_s.inheritFill}
                  iconSize='15px'
                />
              ))
            }
          </div>
        }
      </div>
    )
  }

}
