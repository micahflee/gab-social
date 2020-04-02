import ImmutablePureComponent from 'react-immutable-pure-component'
import Block from './block'
import ScrollableList from './scrollable_list'
import ListItem from './list_item'

export default class List extends ImmutablePureComponent {

  static propTypes = {
    items: PropTypes.array,
    scrollKey: PropTypes.string,
    emptyMessage: PropTypes.any,
    small: PropTypes.bool,
    onLoadMore: PropTypes.func,
    hasMore: PropTypes.bool,
  }

  render() {
    const {
      items,
      scrollKey,
      emptyMessage,
      hasMore,
      small,
      onLoadMore
    } = this.props

    return (
      <Block>
        <ScrollableList
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          scrollKey={scrollKey}
          emptyMessage={emptyMessage}
        >
          {
            items.map((item, i) => (
              <ListItem
                small={small}
                key={`list-item-${i}`}
                isLast={items.size - 1 === i}
                {...item}
              />
            ))
          }
        </ScrollableList>
    </Block>
    )
  }

}