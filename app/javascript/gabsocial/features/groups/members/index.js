import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import ColumnIndicator from '../../../components/column_indicator';
import {
  fetchMembers,
  expandMembers,
} from '../../../actions/groups';
import { FormattedMessage } from 'react-intl';
import AccountContainer from '../../../containers/account_container';
import Column from '../../../components/column';
import ScrollableList from '../../../components/scrollable_list';

const mapStateToProps = (state, { params: { id } }) => ({
  group: state.getIn(['groups', id]),
  accountIds: state.getIn(['user_lists', 'groups', id, 'items']),
  hasMore: !!state.getIn(['user_lists', 'groups', id, 'next']),
});

export default @connect(mapStateToProps)
class GroupMembers extends ImmutablePureComponent {

	static propTypes = {
	  params: PropTypes.object.isRequired,
	  dispatch: PropTypes.func.isRequired,
	  accountIds: ImmutablePropTypes.list,
	  hasMore: PropTypes.bool,
	};

	componentWillMount () {
	  const { params: { id } } = this.props;

	  this.props.dispatch(fetchMembers(id));
	}

	componentWillReceiveProps (nextProps) {
	  if (nextProps.params.id !== this.props.params.id) {
	    this.props.dispatch(fetchMembers(nextProps.params.id));
	  }
	}

	handleLoadMore = debounce(() => {
	  this.props.dispatch(expandMembers(this.props.params.id));
	}, 300, { leading: true });

	render () {
	  const { accountIds, hasMore, group } = this.props;

	  if (!group || !accountIds) {
	    return (<ColumnIndicator type='loading' />);
	  }

	  return (
  <Column>
  <ScrollableList
	        scrollKey='members'
	        hasMore={hasMore}
	        onLoadMore={this.handleLoadMore}
	        emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not has any members.' />}
	      >
  {accountIds.map(id => <AccountContainer key={id} id={id} withNote={false} />)}
	      </ScrollableList>
	    </Column>
	  );
	}

}
