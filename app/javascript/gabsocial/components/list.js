import ScrollableList from './scrollable_list'
import ListItem from './list_item'

export default class List extends PureComponent {

  static propTypes = {
    items: PropTypes.array,
    scrollKey: PropTypes.string,
    emptyMessage: PropTypes.any,
  }

  render() {
    const { items, scrollKey, emptyMessage } = this.props

    return (
      <div className={[_s.default, _s.backgroundColorPrimary, _s.radiusSmall, _s.overflowHidden, _s.border1PX, _s.borderColorSecondary].join(' ')}>
        <ScrollableList
          scrollKey={scrollKey}
          emptyMessage={emptyMessage}
        >
          {
            items.map((item, i) => {
              return (
                <ListItem
                  key={`list-item-${i}`}
                  to={item.to}
                  title={item.title}
                  isLast={items.length - 1 === i}
                />
              )
            })
          }
        </ScrollableList>
      </div>
    )
  }

}