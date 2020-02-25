import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { fetchPinnedStatuses } from '../../actions/pin_statuses';
import { meUsername } from '../../initial_state';
import StatusList from '../../components/status_list/status_list';
import ColumnIndicator from '../../components/column_indicator';

const mapStateToProps = (state, { params: { username } }) => {
  return {
    isMyAccount: (username.toLowerCase() === meUsername.toLowerCase()),
    statusIds: state.getIn(['status_lists', 'pins', 'items']),
    hasMore: !!state.getIn(['status_lists', 'pins', 'next']),
  };
};;

export default
@connect(mapStateToProps)
class PinnedStatuses extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    hasMore: PropTypes.bool.isRequired,
    isMyAccount: PropTypes.bool.isRequired,
  };

  componentWillMount () {
    this.props.dispatch(fetchPinnedStatuses());
  }

  render () {
    const { statusIds, hasMore, isMyAccount } = this.props;

    if (!isMyAccount) {
      return <ColumnIndicator type='missing' />
    }

    return (
      <StatusList
        statusIds={statusIds}
        scrollKey='pinned_statuses'
        hasMore={hasMore}
        emptyMessage={<FormattedMessage id='pinned_statuses.none' defaultMessage='No pins to show.' />}
      />
    );
  }

}
