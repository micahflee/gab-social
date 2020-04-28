import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ColumnIndicator from '../components/column_indicator'
import { fetchLikes } from '../actions/interactions'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'

const messages = defineMessages({
  refresh: { id: 'refresh', defaultMessage: 'Refresh' },
});

const mapStateToProps = (state, props) => ({
  accountIds: state.getIn(['user_lists', 'favourited_by', props.params.statusId]),
});

export default
@injectIntl
@connect(mapStateToProps)
class StatusLikes extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    shouldUpdateScroll: PropTypes.func,
    accountIds: ImmutablePropTypes.list,
    multiColumn: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentWillMount () {
    if (!this.props.accountIds) {
      this.props.dispatch(fetchLikes(this.props.params.statusId));
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.statusId !== this.props.params.statusId && nextProps.params.statusId) {
      this.props.dispatch(fetchLikes(nextProps.params.statusId));
    }
  }

  handleRefresh = () => {
    this.props.dispatch(fetchLikes(this.props.params.statusId));
  }

  render () {
    const { intl, shouldUpdateScroll, accountIds, multiColumn } = this.props;

    if (!accountIds) {
      return <ColumnIndicator type='loading' />
    }

    const emptyMessage = <FormattedMessage id='empty_column.favourites' defaultMessage='No one has favourited this toot yet. When someone does, they will show up here.' />;

    return (
      <div>
        <ScrollableList
          scrollKey='favourites'
          shouldUpdateScroll={shouldUpdateScroll}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
        >
          {accountIds.map(id =>
            <Account key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      </div>
    );
  }

}