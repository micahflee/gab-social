import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import ColumnIndicator from '../../components/column_indicator';
import Column from '../../components/column';
import AccountContainer from '../../containers/account_container';
import { fetchMutes, expandMutes } from '../../actions/mutes';
import ScrollableList from '../../components/scrollable_list';

const messages = defineMessages({
  heading: { id: 'column.mutes', defaultMessage: 'Muted users' },
});

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'mutes', 'items']),
  hasMore: !!state.getIn(['user_lists', 'mutes', 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class Mutes extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    accountIds: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.dispatch(fetchMutes());
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandMutes());
  }, 300, { leading: true });

  render() {
    const { intl, hasMore, accountIds } = this.props;

    if (!accountIds) {
      return (<ColumnIndicator type='loading' />);
    }

    return (
      <Column icon='volume-off' heading={intl.formatMessage(messages.heading)} backBtn='slim'>
        <ScrollableList
          scrollKey='mutes'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          emptyMessage={<FormattedMessage id='empty_column.mutes' defaultMessage="You haven't muted any users yet." />}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} />
          )}
        </ScrollableList>
      </Column>
    );
  }

}
