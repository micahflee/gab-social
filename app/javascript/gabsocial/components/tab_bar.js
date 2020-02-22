import TabBarItem from './tab_bar_item'

export default class TabBar extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array,
  }

  render() {
    const { tabs } = this.props

    return (
      <div className={[_s.default, _s.height53PX, _s.paddingHorizontal5PX, _s.flexRow].join(' ')}>
        {
          tabs.map((tab, i) => (
            <TabBarItem key={`tab-bar-item-${i}`} {...tab} />
          ))
        }
      </div>
    )
  }
}