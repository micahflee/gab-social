import { injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { debounce } from 'lodash'
import { fetchMutes, expandMutes } from '../actions/mutes'
import AccountContainer from '../containers/account_container'
import ColumnIndicator from '../components/column_indicator'
import ScrollableList from '../components/scrollable_list'

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'mutes', 'items']),
  hasMore: !!state.getIn(['user_lists', 'mutes', 'next']),
})

export default
@connect(mapStateToProps)
@injectIntl
class Mutes extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    accountIds: ImmutablePropTypes.list,
  }

  componentWillMount() {
    this.props.dispatch(fetchMutes())
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandMutes())
  }, 300, { leading: true })

  render() {
    const { hasMore, accountIds } = this.props

    if (!accountIds) {
      return <ColumnIndicator type='loading' />
    }

    return (
      <ScrollableList
        scrollKey='mutes'
        onLoadMore={this.handleLoadMore}
        hasMore={hasMore}
        emptyMessage={<FormattedMessage id='empty_column.mutes' defaultMessage="You haven't muted any users yet." />}
      >
        {
          accountIds.map(id =>
            <AccountContainer key={`mutes-${id}`} id={id} compact />
          )
        }
      </ScrollableList>
    )
  }

}
