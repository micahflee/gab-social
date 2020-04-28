import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { getOrderedLists } from '../../selectors'
import { fetchLists } from '../../actions/lists'
import PanelLayout from './panel_layout'
import List from '../list'

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

  state = {
    fetched: false,
  }

  updateOnProps = [
    'lists',
  ]

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.isHidden && nextProps.isIntersecting && !prevState.fetched) {
      return {
        fetched: true,
      }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.fetched && this.state.fetched) {
      this.props.onFetchLists()
    }
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
        <div className={[_s.default, _s.boxShadowNone].join(' ')}>
          <List
            scrollKey='lists_sidebar_panel'
            items={listItems}
          />
        </div>
      </PanelLayout>
    )
  }
}