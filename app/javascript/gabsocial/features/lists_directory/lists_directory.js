import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { createSelector } from 'reselect'
import { defineMessages, injectIntl } from 'react-intl'
import { fetchLists } from '../../actions/lists'
import ColumnIndicator from '../../components/column_indicator'
import List from '../../components/list'

const messages = defineMessages({
  add: { id: 'lists.new.create', defaultMessage: 'Add List' },
  empty: { id: 'empty_column.lists', defaultMessage: 'You don\'t have any lists yet. When you create one, it will show up here.' },
})

const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) return lists

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')))
})

const mapStateToProps = state => ({
  lists: getOrderedLists(state),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchLists() {
    return dispatch(fetchLists())
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListsDirectory extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    onFetchLists: PropTypes.func.isRequired,
    lists: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  }

  state = {
    fetched: false,
  }

  componentWillMount() {
    this.props.onFetchLists()
      .then(() => this.setState({ fetched: true }))
      .catch(() => this.setState({ fetched: true }))
  }

  render() {
    const { intl, lists } = this.props
    const { fetched } = this.state

    if (lists.size === 0 && !fetched) {
      return <ColumnIndicator type='loading' />
    }

    const emptyMessage = intl.formatMessage(messages.empty)

    const listItems = lists.map(list => ({
      to: `/list/${list.get('id')}`,
      title: list.get('title'),
    }))

    return (
      <List
        scrollKey='lists'
        emptyMessage={emptyMessage}
        items={listItems}
      />
    )
  }

}