export default class CardView extends PureComponent {

  static propTypes = {
    children: PropTypes.any,
  }

  render() {
    const { children } = this.props

    return (
      <div className={[_s.default, _s.boxShadowBlock, _s.bgPrimary, _s.overflowHidden, _s.radiusSmall].join(' ')}>
        {children}
      </div>
    )
  }

}