import { injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { fetchMutes, expandMutes } from '../actions/mutes'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'mutes', 'items']),
  hasMore: !!state.getIn(['user_lists', 'mutes', 'next']),
  isLoading: state.getIn(['user_lists', 'mutes', 'isLoading'], true),
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
    isLoading: PropTypes.bool,
  }

  componentWillMount() {
    this.props.dispatch(fetchMutes())
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandMutes())
  }, 300, { leading: true })

  render() {
    const { hasMore, accountIds, isLoading } = this.props

    return (
      <ScrollableList
        scrollKey='mutes'
        onLoadMore={this.handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        emptyMessage={<FormattedMessage id='empty_column.mutes' defaultMessage="You haven't muted any users yet." />}
      >
        {
          accountIds && accountIds.map(id =>
            <Account key={`mutes-${id}`} id={id} compact />
          )
        }
      </ScrollableList>
    )
  }

}
