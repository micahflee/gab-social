import { defineMessages, injectIntl } from 'react-intl'
import { expandHomeTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
  empty: { id: 'empty_column.home', defaultMessage: 'Your home timeline is empty. Start following other users to recieve their content here.' },
})

const mapStateToProps = (state) => ({
  isPartial: state.getIn(['timelines', 'home', 'isPartial']),
})

export default
@connect(mapStateToProps)
@injectIntl
class HomeTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isPartial: PropTypes.bool,
  }

  handleLoadMore = maxId => {
    this.props.dispatch(expandHomeTimeline({ maxId }))
  }

  componentDidMount () {
    this._checkIfReloadNeeded(false, this.props.isPartial)
  }

  componentDidUpdate (prevProps) {
    this._checkIfReloadNeeded(prevProps.isPartial, this.props.isPartial)
  }

  componentWillUnmount () {
    this._stopPolling()
  }

  _checkIfReloadNeeded (wasPartial, isPartial) {
    const { dispatch } = this.props

    if (!wasPartial && isPartial) {
      this.polling = setInterval(() => {
        dispatch(expandHomeTimeline())
      }, 3000)
    } else if (wasPartial && !isPartial) {
      this._stopPolling()
    }
  }

  _stopPolling () {
    if (this.polling) {
      clearInterval(this.polling)
      this.polling = null
    }
  }

  render () {
    const { intl } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusList
        scrollKey='home_timeline'
        onLoadMore={this.handleLoadMore}
        timelineId='home'
        emptyMessage={emptyMessage}
      />
    )
  }

}