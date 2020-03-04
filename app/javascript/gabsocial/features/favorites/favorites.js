import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { fetchReblogs } from '../../actions/interactions';
import { fetchStatus } from '../../actions/statuses';
import { makeGetStatus } from '../../selectors';
import AccountContainer from '../../containers/account_container';
import ColumnIndicator from '../../components/column_indicator';
import ScrollableList from '../../components/scrollable_list';

const mapStateToProps = (state, props) => {
  const getStatus = makeGetStatus();
  const status = getStatus(state, {
    id: props.params.statusId,
    username: props.params.username,
  });

  return {
    status,
    accountIds: state.getIn(['user_lists', 'favorites', props.params.statusId]),
  };
};

export default
@connect(mapStateToProps)
class Favorites extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    status: ImmutablePropTypes.map,
  };

  componentWillMount() {
    this.props.dispatch(fetchReblogs(this.props.params.statusId));
    this.props.dispatch(fetchStatus(this.props.params.statusId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.statusId !== this.props.params.statusId && nextProps.params.statusId) {
      this.props.dispatch(fetchReblogs(nextProps.params.statusId));
      this.props.dispatch(fetchStatus(nextProps.params.statusId));
    }
  }

  render() {
    const { accountIds, status } = this.props;

    if (!accountIds) {
      return <ColumnIndicator type='loading' />
    } else if (!status) {
      return <ColumnIndicator type='missing' />
    }

    return (
      <ScrollableList
        scrollKey='reblogs'
        emptyMessage={<FormattedMessage id='status.reblogs.empty' defaultMessage='No one has reposted this gab yet. When someone does, they will show up here.' />}
      >
        {
          accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />
          )
        }
      </ScrollableList>
    );
  }

}
