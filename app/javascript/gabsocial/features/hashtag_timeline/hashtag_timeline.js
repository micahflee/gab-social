import { FormattedMessage } from 'react-intl'
import { isEqual } from 'lodash'
import { expandHashtagTimeline, clearTimeline } from '../../actions/timelines'
import { connectHashtagStream } from '../../actions/streaming'
import StatusListContainer from '../../containers/status_list_container'

const mapStateToProps = (state, props) => ({
  hasUnread: state.getIn(['timelines', `hashtag:${props.params.id}`, 'unread']) > 0,
})

export default
@connect(mapStateToProps)
class HashtagTimeline extends PureComponent {

  disconnects = [];

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasUnread: PropTypes.bool,
  }

  title = () => {
    let title = [this.props.params.id]

    if (this.additionalFor('any')) {
      title.push(' ',
        <FormattedMessage
          key='any'
          id='hashtag.column_header.tag_mode.any'
          values={{
            additional: this.additionalFor('any')
          }}
          defaultMessage='or {additional}'
        />
      )
    }

    if (this.additionalFor('all')) {
      title.push(' ',
        <FormattedMessage
          key='all'
          id='hashtag.column_header.tag_mode.all'
          values={{
            additional: this.additionalFor('all')
          }}
          defaultMessage='and {additional}'
        />
      )
    }

    if (this.additionalFor('none')) {
      title.push(' ',
        <FormattedMessage
          key='none'
          id='hashtag.column_header.tag_mode.none'
          values={{
            additional: this.additionalFor('none')
          }}
          defaultMessage='without {additional}'
        />
      )
    }

    return title
  }

  additionalFor = (mode) => {
    const { tags } = this.props.params

    try {
      return tags[mode].map(tag => tag.value).join('/')
    } catch (error) {
      return ''
    }
  }

  _subscribe (dispatch, id, tags = {}) {
    let any = (tags.any || []).map(tag => tag.value)
    let all = (tags.all || []).map(tag => tag.value)
    let none = (tags.none || []).map(tag => tag.value);

    [id, ...any].map(tag => {
      this.disconnects.push(dispatch(connectHashtagStream(id, tag, status => {
        let tags = status.tags.map(tag => tag.name)

        return all.filter(tag => tags.includes(tag)).length === all.length &&
               none.filter(tag => tags.includes(tag)).length === 0
      })))
    })
  }

  _unsubscribe () {
    this.disconnects.map(disconnect => disconnect())
    this.disconnects = []
  }

  componentDidMount () {
    const { dispatch } = this.props
    const { id, tags } = this.props.params

    this._subscribe(dispatch, id, tags)
    dispatch(expandHashtagTimeline(id, { tags }))
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, params } = this.props
    const { id, tags } = nextProps.params

    if (id !== params.id || !isEqual(tags, params.tags)) {
      this._unsubscribe()
      this._subscribe(dispatch, id, tags)
      this.props.dispatch(clearTimeline(`hashtag:${id}`))
      this.props.dispatch(expandHashtagTimeline(id, { tags }))
    }
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

  handleLoadMore = maxId => {
    const { id, tags } = this.props.params
    this.props.dispatch(expandHashtagTimeline(id, { maxId, tags }))
  }

  render () {
    const { id } = this.props.params

    return (
      <StatusListContainer
        scrollKey='hashtag_timeline'
        timelineId={`hashtag:${id}`}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
      />
    );
  }

}
