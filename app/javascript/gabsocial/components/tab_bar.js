import TabBarItem from './tab_bar_item'

export default class TabBar extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array,
    large: PropTypes.bool,
  }

  render() {
    const { tabs, large } = this.props

    return (
      <div className={[_s.default, _s.height53PX, _s.px5, _s.flexRow].join(' ')}>
        { !!tabs &&
          tabs.map((tab, i) => (
            <TabBarItem key={`tab-bar-item-${i}`} {...tab} large={large} />
          ))
        }
      </div>
    )
  }
}