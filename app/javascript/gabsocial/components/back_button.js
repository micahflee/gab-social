import Button from './button'

export default class BackButton extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    classNames: PropTypes.string,
    iconClassName: PropTypes.string,
    iconSize: PropTypes.string,
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
      classNames,
      iconClassName,
      iconSize,
    } = this.props
              
    return (
      <Button
        noClasses
        color='primary'
        backgroundColor='none'
        className={classNames || [_s.alignItemsCenter, _s.bgTransparent, _s.mr5, _s.cursorPointer, _s.outlineNone, _s.default, _s.justifyContentCenter].join(' ')}
        icon='arrow-left'
        iconSize={iconSize || '24px'}
        iconClassName={iconClassName || [_s.mr5, _s.fillPrimary].join(' ')}
        onClick={this.handleBackClick}
      />
    )
  }

}
