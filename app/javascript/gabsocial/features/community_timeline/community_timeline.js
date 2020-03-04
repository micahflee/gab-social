import { defineMessages, injectIntl } from 'react-intl'
import {
  expandCommunityTimeline,
  expandPublicTimeline,
} from '../../actions/timelines'
import {
  connectCommunityStream,
  connectPublicStream,
} from '../../actions/streaming'
import StatusListContainer from '../../containers/status_list_container'

const messages = defineMessages({
  empty: { id: 'empty_column.community', defaultMessage: 'The community timeline is empty. Write something publicly to get the ball rolling!' },
})

const mapStateToProps = state => {
  const allFediverse = state.getIn(['settings', 'community', 'other', 'allFediverse'])
  const onlyMedia = state.getIn(['settings', 'community', 'other', 'onlyMedia'])

  const timelineId = allFediverse ? 'public' : 'community'

  return {
    timelineId,
    allFediverse,
    onlyMedia,
  }
}

export default
@connect(mapStateToProps)
@injectIntl
class CommunityTimeline extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onlyMedia: PropTypes.bool,
    allFediverse: PropTypes.bool,
    timelineId: PropTypes.string,
  }

  componentDidMount () {
    const { dispatch, onlyMedia, allFediverse } = this.props

    if (allFediverse) {
      dispatch(expandPublicTimeline({ onlyMedia }))
      this.disconnect = dispatch(connectPublicStream({ onlyMedia }))
    }
    else {
      dispatch(expandCommunityTimeline({ onlyMedia }))
      this.disconnect = dispatch(connectCommunityStream({ onlyMedia }))
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia || prevProps.allFediverse !== this.props.allFediverse) {
      const { dispatch, onlyMedia, allFediverse } = this.props

      this.disconnect()

      if (allFediverse) {
        dispatch(expandPublicTimeline({ onlyMedia }))
        this.disconnect = dispatch(connectPublicStream({ onlyMedia }))
      }
      else {
        dispatch(expandCommunityTimeline({ onlyMedia }))
        this.disconnect = dispatch(connectCommunityStream({ onlyMedia }))
      }
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect()
      this.disconnect = null
    }
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia, allFediverse } = this.props

    if (allFediverse) {
      dispatch(expandPublicTimeline({ maxId, onlyMedia }))
    }
    else {
      dispatch(expandCommunityTimeline({ maxId, onlyMedia }))
    }
  }

  render () {
    const { intl, onlyMedia, timelineId } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusListContainer
        scrollKey={`${timelineId}_timeline`}
        timelineId={`${timelineId}${onlyMedia ? ':media' : ''}`}
        onLoadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
      />
    )
  }

}
