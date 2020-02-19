import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connectListStream } from '../../actions/streaming';
import { expandListTimeline } from '../../actions/timelines';
import { fetchList, deleteList } from '../../actions/lists';
import { openModal } from '../../actions/modal';
import StatusListContainer from '../../containers/status_list_container';
import ColumnIndicator from '../../components/column_indicator';
import Button from '../../components/button';

const messages = defineMessages({
  deleteMessage: { id: 'confirmations.delete_list.message', defaultMessage: 'Are you sure you want to permanently delete this list?' },
  deleteConfirm: { id: 'confirmations.delete_list.confirm', defaultMessage: 'Delete' },
});

const mapStateToProps = (state, props) => ({
  list: state.getIn(['lists', props.params.id]),
});

export default @connect(mapStateToProps)
@injectIntl
class ListTimeline extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    list: PropTypes.oneOfType([ImmutablePropTypes.map, PropTypes.bool]),
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.handleConnect(this.props.params.id);
  }

  componentWillUnmount() {
    this.handleDisconnect();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.handleDisconnect();
      this.handleConnect(nextProps.params.id);
    }
  }

  handleConnect(id) {
    const { dispatch } = this.props;

    dispatch(fetchList(id));
    dispatch(expandListTimeline(id));

    this.disconnect = dispatch(connectListStream(id));
  }

  handleDisconnect() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = maxId => {
    const { id } = this.props.params;
    this.props.dispatch(expandListTimeline(id, { maxId }));
  }

  handleEditClick = () => {
    this.props.dispatch(openModal('LIST_EDITOR', { listId: this.props.params.id }));
  }

  handleDeleteClick = () => {
    const { dispatch, intl } = this.props;
    const { id } = this.props.params;

    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deleteMessage),
      confirm: intl.formatMessage(messages.deleteConfirm),
      onConfirm: () => {
        dispatch(deleteList(id));
        this.context.router.history.push('/lists');
      },
    }));
  }

  render() {
    const { list } = this.props;
    const { id } = this.props.params;
    const title = list ? list.get('title') : id;

    if (typeof list === 'undefined') {
      return (<ColumnIndicator type='loading' />);
    } else if (list === false) {
      return (<ColumnIndicator type='missing' />);
    }

    const emptyMessage = (
      <div>
        <FormattedMessage
          id='empty_column.list'
          defaultMessage='There is nothing in this list yet. When members of this list post new statuses, they will appear here.' />
        <br/><br/>
        <Button onClick={this.handleEditClick}>
          <FormattedMessage id='list.click_to_add' defaultMessage='Click here to add people' />
        </Button>
      </div>
    );

    return (
      <StatusListContainer
        scrollKey='list_timeline'
        timelineId={`list:${id}`}
        onLoadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
      />
    );
  }

}
