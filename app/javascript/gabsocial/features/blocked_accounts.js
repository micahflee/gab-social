import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { fetchBlocks, expandBlocks } from '../actions/blocks'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'

const messages = defineMessages({
  empty: { id: 'empty_column.blocks', defaultMessage: 'You haven\'t blocked any users yet.' },
})

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'blocks', 'items']),
  hasMore: !!state.getIn(['user_lists', 'blocks', 'next']),
  isLoading: state.getIn(['user_lists', 'blocks', 'isLoading'], true),
})

export default
@connect(mapStateToProps)
@injectIntl
class Blocks extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(fetchBlocks())
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandBlocks())
  }, 300, { leading: true })

  render() {
    const {
      intl,
      accountIds,
      hasMore,
      isLoading,
    } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <ScrollableList
        scrollKey='blocks'
        onLoadMore={this.handleLoadMore}
        hasMore={hasMore}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
      >
        {
          !!accountIds && accountIds.map(id =>
            <Account key={`blocked-${id}`} id={id} compact />
          )
        }
      </ScrollableList>
    )
  }

}
