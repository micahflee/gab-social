import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import isEqual from 'lodash.isequal'
import { expandHashtagTimeline, clearTimeline } from '../actions/timelines'
import { fetchHashtag } from '../actions/hashtags'
import StatusList from '../components/status_list'

class HashtagTimeline extends React.PureComponent {

  componentDidMount () {
    const { dispatch, tagName } = this.props
    const { id } = this.props.params

    dispatch(expandHashtagTimeline(id))
    // dispatch(fetchHashtag(tagName))
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, params } = this.props
    const { id } = nextProps.params

    if (id !== params.id) {
      this.props.dispatch(clearTimeline(`hashtag:${id}`))
      this.props.dispatch(expandHashtagTimeline(id))
    }
  }

  handleLoadMore = (maxId) => {
    const { id } = this.props.params
    this.props.dispatch(expandHashtagTimeline(id, { maxId }))
  }

  render () {
    const { tagName } = this.props

    return (
      <StatusList
        scrollKey='hashtag_timeline'
        timelineId={`hashtag:${tagName}`}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
      />
    )
  }

}

const mapStateToProps = (state, props) => ({
  tagName: props.params.id,
  // tag: state.getIn(['hashtags', `${props.params.id}`]),
  hasUnread: state.getIn(['timelines', `hashtag:${props.params.id}`, 'unread']) > 0,
})

HashtagTimeline.propTypes = {
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  hasUnread: PropTypes.bool,
}

export default connect(mapStateToProps)(HashtagTimeline)