import ImmutablePureComponent from 'react-immutable-pure-component'
import Block from './block'
import ScrollableList from './scrollable_list'
import ListItem from './list_item'

export default class List extends ImmutablePureComponent {

  static propTypes = {
    items: PropTypes.array,
    scrollKey: PropTypes.string,
    emptyMessage: PropTypes.any,
    size: PropTypes.oneOf([
      'small',
      'large'
    ]),
    onLoadMore: PropTypes.func,
    hasMore: PropTypes.bool,
  }

  render() {
    const {
      items,
      scrollKey,
      emptyMessage,
      hasMore,
      size,
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
                size={size}
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