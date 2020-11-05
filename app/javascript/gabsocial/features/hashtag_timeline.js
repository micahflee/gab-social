import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import isEqual from 'lodash.isequal'
import { expandHashtagTimeline, clearTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'

class HashtagTimeline extends React.PureComponent {

  title = () => {
    const title = [this.props.params.id]

    if (this.additionalFor('any')) {
      title.push(' ',
        <FormattedMessage
          key='any'
          id='hashtag.column_header.tag_mode.any'
          values={{
            additional: this.additionalFor('any'),
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
            additional: this.additionalFor('all'),
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
            additional: this.additionalFor('none'),
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

  componentDidMount () {
    const { dispatch } = this.props
    const { id, tags } = this.props.params

    dispatch(expandHashtagTimeline(id, { tags }))
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, params } = this.props
    const { id, tags } = nextProps.params

    if (id !== params.id || !isEqual(tags, params.tags)) {
      this.props.dispatch(clearTimeline(`hashtag:${id}`))
      this.props.dispatch(expandHashtagTimeline(id, { tags }))
    }
  }

  handleLoadMore = (maxId) => {
    const { id, tags } = this.props.params
    this.props.dispatch(expandHashtagTimeline(id, { maxId, tags }))
  }

  render () {
    const { id } = this.props.params

    return (
      <StatusList
        scrollKey='hashtag_timeline'
        timelineId={`hashtag:${id}`}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
      />
    );
  }

}

const mapStateToProps = (state, props) => ({
  hasUnread: state.getIn(['timelines', `hashtag:${props.params.id}`, 'unread']) > 0,
})

HashtagTimeline.propTypes = {
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  hasUnread: PropTypes.bool,
}

export default connect(mapStateToProps)(HashtagTimeline)