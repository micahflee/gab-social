import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { createSelector } from 'reselect'
import { fetchLists } from '../../actions/lists'
import PanelLayout from './panel_layout'
import List from '../list'

const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) return lists

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')))
})

const messages = defineMessages({
  title: { id: 'lists.subheading', defaultMessage: 'Your Lists' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
  all: { id: 'groups.sidebar-panel.all', defaultMessage: 'All' },
})

const mapStateToProps = (state) => ({
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
class ListsPanel extends ImmutablePureComponent {
  static propTypes = {
    onFetchLists: PropTypes.func.isRequired,
    lists: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.onFetchLists()
  }

  render() {
    const { intl, lists } = this.props
    const count = lists.count()

    if (count === 0) return null

    const maxCount = 6

    const listItems = lists.slice(0, maxCount).map(list => ({
      to: `/lists/${list.get('id')}`,
      title: list.get('title'),
    }))

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.all)}
        headerButtonTo='/lists'
        footerButtonTitle={count > maxCount ? intl.formatMessage(messages.show_all) : undefined}
        footerButtonTo={count > maxCount ? '/lists' : undefined}
        noPadding
      >
        <div className={_s.default}>
          <List
            unrounded
            scrollKey='lists_sidebar_panel'
            items={listItems}
          />
        </div>
      </PanelLayout>
    )
  }
}