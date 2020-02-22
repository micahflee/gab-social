import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import {
  expandCommunityTimeline,
  expandPublicTimeline,
} from '../../actions/timelines';
import {
  connectCommunityStream,
  connectPublicStream,
} from '../../actions/streaming';
import StatusListContainer from '../../containers/status_list_container';;
// import ColumnSettingsContainer from '.containers/column_settings_container';
import Column from '../../components/column';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Community timeline' },
});

const mapStateToProps = state => {
  const allFediverse = state.getIn(['settings', 'community', 'other', 'allFediverse']);
  const onlyMedia = state.getIn(['settings', 'community', 'other', 'onlyMedia']);

  const timelineId = allFediverse ? 'public' : 'community';

  return {
    timelineId,
    allFediverse,
    onlyMedia,
    hasUnread: state.getIn(['timelines', `${timelineId}${onlyMedia ? ':media' : ''}`, 'unread']) > 0,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class CommunityTimeline extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    onlyMedia: PropTypes.bool,
    allFediverse: PropTypes.bool,
    timelineId: PropTypes.string,
  };

  componentDidMount () {
    const { dispatch, onlyMedia, allFediverse } = this.props;

    if (allFediverse) {
      dispatch(expandPublicTimeline({ onlyMedia }));
      this.disconnect = dispatch(connectPublicStream({ onlyMedia }));
    }
    else {
      dispatch(expandCommunityTimeline({ onlyMedia }));
      this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia || prevProps.allFediverse !== this.props.allFediverse) {
      const { dispatch, onlyMedia, allFediverse } = this.props;

      this.disconnect();

      if (allFediverse) {
        dispatch(expandPublicTimeline({ onlyMedia }));
        this.disconnect = dispatch(connectPublicStream({ onlyMedia }));
      }
      else {
        dispatch(expandCommunityTimeline({ onlyMedia }));
        this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
      }
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia, allFediverse } = this.props;

    if (allFediverse) {
      dispatch(expandPublicTimeline({ maxId, onlyMedia }));
    }
    else {
      dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
    }
  }

  render () {
    const { intl, hasUnread, onlyMedia, timelineId, allFediverse } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <StatusListContainer
          scrollKey={`${timelineId}_timeline`}
          timelineId={`${timelineId}${onlyMedia ? ':media' : ''}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The community timeline is empty. Write something publicly to get the ball rolling!' />}
        />
      </Column>
    );
  }

}
