import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { NavLink } from 'react-router-dom'
import { createSelector } from 'reselect'
import { defineMessages, injectIntl } from 'react-intl'
import classNames from 'classnames/bind'
import { fetchLists } from '../../actions/lists'
import ColumnIndicator from '../../components/column_indicator'
import ScrollableList from '../../components/scrollable_list'
import Icon from '../../components/icon'

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

const cx = classNames.bind(_s)

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Lists extends ImmutablePureComponent {

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

    return (
      <ScrollableList
        scrollKey='lists'
        emptyMessage={emptyMessage}
      >
        <div className={[_s.default, _s.backgroundWhite, _s.radiusSmall, _s.overflowHidden, _s.border1PX, _s.bordercolorSecondary].join(' ')}>
          {
            lists.map((list, i) => {
              const isLast = lists.length - 1 === i
              return (
                <ListItem key={list.get('id')} list={list} isLast={isLast} />
              )
            })
          }
        </div>
      </ScrollableList>
    )
  }

}

class ListItem extends ImmutablePureComponent {
  static propTypes = {
    isLast: PropTypes.bool,
    list: ImmutablePropTypes.map,
  }

  render() {
    const { list, isLast } = this.props

    const containerClasses = cx({
      default: 1,
      cursorPointer: 1,
      noUnderline: 1,
      paddingHorizontal15PX: 1,
      paddingVertical15PX: 1,
      flexRow: 1,
      alignItemsCenter: 1,
      backgroundSubtle_onHover: 1,
      bordercolorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    return (
      <NavLink to={`/list/${list.get('id')}`} className={containerClasses} >
        <span className={[_s.default, _s.text, _s.colorPrimary, _s.fontSize14PX].join(' ')}>
          {list.get('title')}
        </span>
        <Icon id='angle-right' className={[_s.marginLeftAuto, _s.fillColorBlack].join(' ')} width='10px' height='10px' />
      </NavLink>
    )
  }
}